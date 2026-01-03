import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";

// Seed constants (matching the Rust contract)
const CONFIG_SEED = Buffer.from("config");
const USER_SEED = Buffer.from("user");
const STAKE_SEED = Buffer.from("stake");
const REWARDS_SEED = Buffer.from("rewards");

/**
 * Derive the Config PDA
 * Seeds: ["config"]
 */
export const getConfigPda = (): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync([CONFIG_SEED], PROGRAM_ID);
};

/**
 * Derive the User Account PDA
 * Seeds: ["user", user_pubkey]
 */
export const getUserAccountPda = (
  userPubkey: PublicKey
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [USER_SEED, userPubkey.toBuffer()],
    PROGRAM_ID
  );
};

/**
 * Derive the Stake Account PDA for a specific NFT
 * Seeds: ["stake", nft_mint, config]
 */
export const getStakeAccountPda = (
  nftMint: PublicKey,
  configPda: PublicKey
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [STAKE_SEED, nftMint.toBuffer(), configPda.toBuffer()],
    PROGRAM_ID
  );
};

/**
 * Derive the Rewards Mint PDA
 * Seeds: ["rewards", config]
 */
export const getRewardsMintPda = (
  configPda: PublicKey
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [REWARDS_SEED, configPda.toBuffer()],
    PROGRAM_ID
  );
};

/**
 * Get all PDAs needed for staking operations
 */
export const getAllPdas = (userPubkey: PublicKey, nftMint?: PublicKey) => {
  const [configPda, configBump] = getConfigPda();
  const [userAccountPda, userAccountBump] = getUserAccountPda(userPubkey);
  const [rewardsMintPda, rewardsMintBump] = getRewardsMintPda(configPda);

  const result: {
    configPda: PublicKey;
    configBump: number;
    userAccountPda: PublicKey;
    userAccountBump: number;
    rewardsMintPda: PublicKey;
    rewardsMintBump: number;
    stakeAccountPda?: PublicKey;
    stakeAccountBump?: number;
  } = {
    configPda,
    configBump,
    userAccountPda,
    userAccountBump,
    rewardsMintPda,
    rewardsMintBump,
  };

  if (nftMint) {
    const [stakeAccountPda, stakeAccountBump] = getStakeAccountPda(
      nftMint,
      configPda
    );
    result.stakeAccountPda = stakeAccountPda;
    result.stakeAccountBump = stakeAccountBump;
  }

  return result;
};

// Metaplex Token Metadata Program ID
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

/**
 * Derive the Metadata PDA for an NFT
 */
export const getMetadataPda = (mint: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
};

/**
 * Derive the Master Edition PDA for an NFT
 */
export const getMasterEditionPda = (mint: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
};
