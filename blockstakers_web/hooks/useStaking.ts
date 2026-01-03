"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import {
  getConfigPda,
  getUserAccountPda,
  getStakeAccountPda,
  getMetadataPda,
  getMasterEditionPda,
  TOKEN_METADATA_PROGRAM_ID,
} from "@/lib/solana/pdas";
import { COLLECTION_MINT } from "@/lib/solana/constants";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

export const useStaking = () => {
  const { publicKey } = useWallet();
  const program = useProgram();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stake = useCallback(
    async (nftMint: PublicKey): Promise<string | null> => {
      if (!program || !publicKey) {
        setError("Wallet not connected");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const [configPda] = getConfigPda();
        const [userAccountPda] = getUserAccountPda(publicKey);
        const [stakeAccountPda] = getStakeAccountPda(nftMint, configPda);
        const [metadataPda] = getMetadataPda(nftMint);
        const [editionPda] = getMasterEditionPda(nftMint);
        const mintAta = await getAssociatedTokenAddress(nftMint, publicKey);

        const tx = await program.methods
          .stake()
          .accounts({
            user: publicKey,
            mint: nftMint,
            collection: COLLECTION_MINT,
            mintAta: mintAta,
            metadata: metadataPda,
            edition: editionPda,
            config: configPda,
            stakeAccount: stakeAccountPda,
            userAccount: userAccountPda,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: TOKEN_METADATA_PROGRAM_ID,
          })
          .rpc();

        return tx;
      } catch (err: unknown) {
        const errorMessage = parseError(err);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  const unstake = useCallback(
    async (nftMint: PublicKey): Promise<string | null> => {
      if (!program || !publicKey) {
        setError("Wallet not connected");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const [configPda] = getConfigPda();
        const [userAccountPda] = getUserAccountPda(publicKey);
        const [stakeAccountPda] = getStakeAccountPda(nftMint, configPda);
        const [metadataPda] = getMetadataPda(nftMint);
        const [editionPda] = getMasterEditionPda(nftMint);
        const mintAta = await getAssociatedTokenAddress(nftMint, publicKey);

        const tx = await program.methods
          .unstake()
          .accounts({
            user: publicKey,
            mint: nftMint,
            mintAta: mintAta,
            metadata: metadataPda,
            edition: editionPda,
            config: configPda,
            stakeAccount: stakeAccountPda,
            userAccount: userAccountPda,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: TOKEN_METADATA_PROGRAM_ID,
          })
          .rpc();

        return tx;
      } catch (err: unknown) {
        const errorMessage = parseError(err);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [program, publicKey]
  );

  return {
    stake,
    unstake,
    loading,
    error,
    clearError: () => setError(null),
  };
};

function parseError(err: unknown): string {
  const message = (err as Error)?.message || "";
  if (message.includes("IncorrectMint")) {
    return "This NFT cannot be staked - incorrect mint";
  }
  if (message.includes("IncorrectCollection")) {
    return "This NFT is not from the correct collection";
  }
  if (message.includes("CollectionNotVerified")) {
    return "This NFT's collection is not verified";
  }
  if (message.includes("MaxStakeReached")) {
    return "Maximum stake limit reached. Unstake some NFTs first.";
  }
  if (message.includes("FreezePeriodNotElapsed")) {
    return "Cannot unstake yet - freeze period has not elapsed";
  }
  if (message.includes("User rejected")) {
    return "Transaction cancelled by user";
  }
  if (message.includes("Account does not exist")) {
    return "Please initialize your account first";
  }
  return message || "An error occurred";
}
