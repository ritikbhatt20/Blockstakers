import { PublicKey } from "@solana/web3.js";

// Program ID from your deployed contract
export const PROGRAM_ID = new PublicKey(
  "GVajNdhMaLfek7mqbR8iTqGJCAVFcZUBXQkevAdeTq5c"
);

// Network configuration
export const NETWORK = "devnet"; // Change to "mainnet-beta" for production

// RPC Endpoints
export const RPC_ENDPOINTS = {
  devnet: "https://api.devnet.solana.com",
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
  localnet: "http://localhost:8899",
} as const;

// Get current RPC endpoint
export const RPC_ENDPOINT = RPC_ENDPOINTS[NETWORK as keyof typeof RPC_ENDPOINTS];

/**
 * IMPORTANT: Collection Mint Address
 *
 * You MUST replace this placeholder with your actual NFT collection's mint address.
 * The smart contract validates that staked NFTs belong to this collection.
 * All stake transactions will FAIL until this is set correctly.
 *
 * To find your collection mint:
 * 1. If you created the collection via Metaplex, it's the collection NFT's mint address
 * 2. You can find it in Solana Explorer by looking at your NFT's metadata
 */
export const COLLECTION_MINT = new PublicKey(
  "ARRDcyMSfnBZxEYsa2uNyXQVLWbVCE9Zh8CZ5ReJRdSe"
);

// Staking configuration defaults (should match your on-chain config)
export const DEFAULT_CONFIG = {
  pointsPerStake: 1, // 1 point per minute
  maxStake: 100,
  freezePeriod: 0, // minutes
};

// Token decimals for reward token
export const REWARD_TOKEN_DECIMALS = 6;
