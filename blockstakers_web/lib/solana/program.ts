import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PROGRAM_ID, RPC_ENDPOINT } from "./constants";
import idl from "./idl/nft_staking.json";

// Type for the NFT Staking program
export type NftStakingProgram = Program<Idl>;

// Get connection instance
export const getConnection = (): Connection => {
  return new Connection(RPC_ENDPOINT, "confirmed");
};

// Get Anchor Provider
export const getProvider = (wallet: AnchorWallet): AnchorProvider => {
  const connection = getConnection();
  return new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
  });
};

// Get Program instance
export const getProgram = (wallet: AnchorWallet): NftStakingProgram => {
  const provider = getProvider(wallet);
  return new Program(idl as Idl, provider);
};

// Get Program with only connection (read-only, no wallet needed)
export const getReadOnlyProgram = (): NftStakingProgram => {
  const connection = getConnection();
  // Create a dummy provider for read-only operations
  const provider = {
    connection,
    publicKey: null,
  } as unknown as AnchorProvider;

  return new Program(idl as Idl, provider);
};

// Export program ID for convenience
export { PROGRAM_ID };
