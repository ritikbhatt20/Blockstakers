/**
 * Script to check NFT ownership and collection details
 * Usage: node scripts/check-nfts.mjs
 */

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchDigitalAsset,
  fetchAllDigitalAssetByOwner,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

const DEVNET_RPC = "https://api.devnet.solana.com";

// Phantom wallet address
const PHANTOM_WALLET = "G2k6ShTNEyJo84Gu6Dey6ubKagaFQzjBxffncNtPJuqR";

// Expected collection mint
const EXPECTED_COLLECTION = "ARRDcyMSfnBZxEYsa2uNyXQVLWbVCE9Zh8CZ5ReJRdSe";

async function main() {
  console.log("🔍 Checking NFTs for wallet:", PHANTOM_WALLET);
  console.log("Expected Collection:", EXPECTED_COLLECTION);
  console.log("=".repeat(60) + "\n");

  const umi = createUmi(DEVNET_RPC).use(mplTokenMetadata());

  try {
    // Fetch all NFTs owned by the wallet
    console.log("📦 Fetching all NFTs owned by wallet...\n");
    const assets = await fetchAllDigitalAssetByOwner(umi, publicKey(PHANTOM_WALLET));

    console.log(`Found ${assets.length} NFT(s) in wallet:\n`);

    for (const asset of assets) {
      console.log("-".repeat(50));
      console.log(`Name: ${asset.metadata.name}`);
      console.log(`Mint: ${asset.mint.publicKey}`);
      console.log(`Symbol: ${asset.metadata.symbol}`);

      const collectionData = asset.metadata.collection;
      if (collectionData && collectionData.__option === 'Some') {
        const collection = collectionData.value;
        console.log(`Collection Key: ${collection.key}`);
        console.log(`Collection Verified: ${collection.verified}`);

        if (collection.key.toString() === EXPECTED_COLLECTION) {
          console.log(`✅ Matches expected collection!`);
        } else {
          console.log(`❌ Does NOT match expected collection`);
        }
      } else {
        console.log(`Collection: None`);
      }
      console.log("");
    }

    if (assets.length === 0) {
      console.log("No NFTs found in this wallet on devnet.");
      console.log("\nPossible reasons:");
      console.log("1. NFTs haven't been confirmed yet (wait a few minutes)");
      console.log("2. NFTs were sent to a different wallet");
      console.log("3. RPC is having issues fetching data");
    }

  } catch (error) {
    console.error("Error fetching NFTs:", error.message);
  }

  // Also try to fetch specific NFT mints we created
  console.log("\n" + "=".repeat(60));
  console.log("🔍 Checking specific NFT mints we created:\n");

  const knownMints = [
    "J3WZ6LJV2GvffZbAXY9bgznHQRUhLVSZViSovZpmJpT3",
    "5PqFXFnqSjdVrqxLg15ebgbQLCGK4kKHFTjvwL4m1h1K",
    "5r1B9h77hx85tgGFxaZjZKrHwJsXXg5xAnos2WxDRojT",
  ];

  for (const mint of knownMints) {
    try {
      console.log(`Checking mint: ${mint}`);
      const asset = await fetchDigitalAsset(umi, publicKey(mint));
      console.log(`  Name: ${asset.metadata.name}`);
      console.log(`  Owner: Check token account...`);

      const collectionData = asset.metadata.collection;
      if (collectionData && collectionData.__option === 'Some') {
        console.log(`  Collection: ${collectionData.value.key}`);
        console.log(`  Verified: ${collectionData.value.verified}`);
      } else {
        console.log(`  Collection: None`);
      }
      console.log("");
    } catch (e) {
      console.log(`  ❌ Could not fetch: ${e.message}\n`);
    }
  }
}

main().catch(console.error);
