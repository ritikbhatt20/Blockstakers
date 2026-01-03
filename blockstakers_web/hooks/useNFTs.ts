"use client";

import { useState, useCallback, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import {
  getConfigPda,
  getStakeAccountPda,
  getMetadataPda,
} from "@/lib/solana/pdas";
import { COLLECTION_MINT } from "@/lib/solana/constants";

export interface NFTData {
  mint: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  image?: string;
  isStaked: boolean;
  stakeTimestamp?: number;
}

export const useNFTs = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const program = useProgram();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [stakedNfts, setStakedNfts] = useState<NFTData[]>([]);
  const [unstakedNfts, setUnstakedNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = useCallback(async () => {
    if (!publicKey || !connection) {
      setNfts([]);
      setStakedNfts([]);
      setUnstakedNfts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const nftList: NFTData[] = [];
      const [configPda] = getConfigPda();

      for (const { account } of tokenAccounts.value) {
        const parsedInfo = account.data.parsed.info;
        const mintAddress = new PublicKey(parsedInfo.mint);
        const amount = parsedInfo.tokenAmount.uiAmount;

        if (amount === 1 && parsedInfo.tokenAmount.decimals === 0) {
          try {
            // Fetch metadata
            const [metadataPda] = getMetadataPda(mintAddress);
            const metadataAccountInfo = await connection.getAccountInfo(
              metadataPda
            );

            if (metadataAccountInfo) {
              // Parse metadata (simplified - in production use Metaplex SDK)
              const metadata = parseMetadata(metadataAccountInfo.data);

              // Check if NFT belongs to our collection
              if (metadata.collection?.key.equals(COLLECTION_MINT)) {
                // Check if staked
                const [stakeAccountPda] = getStakeAccountPda(
                  mintAddress,
                  configPda
                );
                let isStaked = false;
                let stakeTimestamp: number | undefined;

                if (program) {
                  try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const stakeAccount = await (program as any).account.stakeAccount.fetch(stakeAccountPda);
                    isStaked = true;
                    // Note: Anchor uses snake_case from IDL
                    const lastUpdate = (stakeAccount as any).last_update ?? (stakeAccount as any).lastUpdate;
                    stakeTimestamp = lastUpdate?.toNumber ? lastUpdate.toNumber() : lastUpdate;
                  } catch {
                    // Not staked
                  }
                }

                // Fetch image from URI
                let image: string | undefined;
                try {
                  const response = await fetch(metadata.uri);
                  const json = await response.json();
                  image = json.image;
                } catch {
                  // Failed to fetch image
                }

                nftList.push({
                  mint: mintAddress,
                  name: metadata.name,
                  symbol: metadata.symbol,
                  uri: metadata.uri,
                  image,
                  isStaked,
                  stakeTimestamp,
                });
              }
            }
          } catch {
            // Skip NFTs we can't parse
          }
        }
      }

      setNfts(nftList);
      setStakedNfts(nftList.filter((nft) => nft.isStaked));
      setUnstakedNfts(nftList.filter((nft) => !nft.isStaked));
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to fetch NFTs");
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection, program]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return {
    nfts,
    stakedNfts,
    unstakedNfts,
    loading,
    error,
    refetch: fetchNFTs,
  };
};

// Simple metadata parser (in production, use @metaplex-foundation/mpl-token-metadata)
function parseMetadata(data: Buffer): {
  name: string;
  symbol: string;
  uri: string;
  collection?: { verified: boolean; key: PublicKey };
} {
  // Metadata account structure (V1.3):
  // - key: 1 byte
  // - update_authority: 32 bytes
  // - mint: 32 bytes
  // - data: Data struct
  //   - name: 4 bytes length + 32 bytes max string
  //   - symbol: 4 bytes length + 10 bytes max string
  //   - uri: 4 bytes length + 200 bytes max string
  //   - seller_fee_basis_points: 2 bytes
  //   - creators: Option<Vec<Creator>>
  // - primary_sale_happened: 1 byte
  // - is_mutable: 1 byte
  // - edition_nonce: Option<u8>
  // - token_standard: Option<TokenStandard>
  // - collection: Option<Collection>

  let offset = 1 + 32 + 32; // Skip key, update_authority, mint

  // Read name (4 byte length prefix, but actual string is padded to 32 bytes)
  const nameLength = data.readUInt32LE(offset);
  offset += 4;
  const name = data
    .subarray(offset, offset + Math.min(nameLength, 32))
    .toString("utf8")
    .replace(/\0/g, "");
  offset += 32; // Name is always 32 bytes

  // Read symbol (4 byte length prefix, string padded to 10 bytes)
  const symbolLength = data.readUInt32LE(offset);
  offset += 4;
  const symbol = data
    .subarray(offset, offset + Math.min(symbolLength, 10))
    .toString("utf8")
    .replace(/\0/g, "");
  offset += 10; // Symbol is always 10 bytes

  // Read URI (4 byte length prefix, string padded to 200 bytes)
  const uriLength = data.readUInt32LE(offset);
  offset += 4;
  const uri = data
    .subarray(offset, offset + Math.min(uriLength, 200))
    .toString("utf8")
    .replace(/\0/g, "");
  offset += 200; // URI is always 200 bytes

  // Seller fee basis points (2 bytes)
  offset += 2;

  // Creators (Option<Vec<Creator>>)
  const hasCreators = data[offset] === 1;
  offset += 1;

  if (hasCreators) {
    const creatorsLength = data.readUInt32LE(offset);
    offset += 4;
    // Each creator is 32 (address) + 1 (verified) + 1 (share) = 34 bytes
    offset += creatorsLength * 34;
  }

  // primary_sale_happened: 1 byte
  offset += 1;

  // is_mutable: 1 byte
  offset += 1;

  // edition_nonce: Option<u8>
  const hasEditionNonce = data[offset] === 1;
  offset += 1;
  if (hasEditionNonce) {
    offset += 1; // Skip the nonce value
  }

  // token_standard: Option<TokenStandard> (added in v1.1)
  const hasTokenStandard = data[offset] === 1;
  offset += 1;
  if (hasTokenStandard) {
    offset += 1; // Skip token standard enum value
  }

  // collection: Option<Collection>
  let collection: { verified: boolean; key: PublicKey } | undefined;
  const hasCollection = data[offset] === 1;
  offset += 1;

  if (hasCollection) {
    const verified = data[offset] === 1;
    offset += 1;
    const key = new PublicKey(data.subarray(offset, offset + 32));
    collection = { verified, key };
  }

  return { name, symbol, uri, collection };
}
