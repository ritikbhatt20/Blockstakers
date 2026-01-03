/**
 * Script to initialize the staking config on devnet
 * Run this once after deploying/redeploying the program
 *
 * Usage: node scripts/init-config.mjs
 */

import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import os from "os";

const DEVNET_RPC = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("AdoejzehfQRcKmgH1S81x2A9y9nG6Hjmq3sH9WfsQ5LF");

// Staking config parameters
const POINTS_PER_STAKE = 1; // 1 point per minute per staked NFT
const MAX_STAKE = 100;
const FREEZE_PERIOD = 0; // 0 minutes for testing

async function main() {
  console.log("🚀 Initializing Staking Config on Devnet\n");

  // Load CLI wallet
  const walletPath = path.join(os.homedir(), ".config/solana/id.json");
  const secretKey = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
  const payer = Keypair.fromSecretKey(new Uint8Array(secretKey));

  console.log(`Payer: ${payer.publicKey.toString()}`);
  console.log(`Program: ${PROGRAM_ID.toString()}`);

  // Create connection and provider
  const connection = new Connection(DEVNET_RPC, "confirmed");
  const wallet = new anchor.Wallet(payer);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  // Load the IDL
  const idlPath = path.join(process.cwd(), "target/idl/nft_staking.json");
  const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

  // Create program instance
  const program = new anchor.Program(idl, provider);

  // Derive config PDA
  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID
  );

  console.log(`\nConfig PDA: ${configPda.toString()}`);

  // Check if config already exists
  try {
    const existingConfig = await connection.getAccountInfo(configPda);
    if (existingConfig) {
      console.log("\n⚠️  Config account already exists!");
      console.log("   If you want to reinitialize, you need to redeploy the program.");
      return;
    }
  } catch (e) {
    // Account doesn't exist, proceed with initialization
  }

  console.log("\n📝 Initializing config with:");
  console.log(`   Points per stake: ${POINTS_PER_STAKE} point/min`);
  console.log(`   Max stake: ${MAX_STAKE}`);
  console.log(`   Freeze period: ${FREEZE_PERIOD} minutes`);

  try {
    const tx = await program.methods
      .initializeConfig(POINTS_PER_STAKE, MAX_STAKE, FREEZE_PERIOD)
      .accounts({
        admin: payer.publicKey,
        config: configPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log(`\n✅ Config initialized successfully!`);
    console.log(`   Transaction: ${tx}`);
    console.log(`   Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  } catch (e) {
    console.error(`\n❌ Failed to initialize config: ${e.message}`);
    if (e.logs) {
      console.error("\nTransaction logs:");
      e.logs.forEach((log, i) => console.error(`  ${i}: ${log}`));
    }
  }
}

main().catch(console.error);
