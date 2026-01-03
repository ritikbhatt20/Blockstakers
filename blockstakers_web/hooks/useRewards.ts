"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import {
  getConfigPda,
  getUserAccountPda,
  getRewardsMintPda,
} from "@/lib/solana/pdas";
import { REWARD_TOKEN_DECIMALS } from "@/lib/solana/constants";
import { SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

export const useRewards = () => {
  const { publicKey } = useWallet();
  const program = useProgram();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePendingRewards = useCallback(
    (lastUpdate: number, pointsPerStake: number): number => {
      const now = Math.floor(Date.now() / 1000);
      const secondsElapsed = now - lastUpdate;
      const daysElapsed = secondsElapsed / 86400;
      return Math.floor(daysElapsed * pointsPerStake);
    },
    []
  );

  const pointsToTokens = useCallback((points: number): number => {
    return points;
  }, []);

  const claim = useCallback(async (): Promise<string | null> => {
    if (!program || !publicKey) {
      setError("Wallet not connected");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const [configPda] = getConfigPda();
      const [userAccountPda] = getUserAccountPda(publicKey);
      const [rewardsMintPda] = getRewardsMintPda(configPda);
      const rewardsAta = await getAssociatedTokenAddress(
        rewardsMintPda,
        publicKey
      );

      const tx = await program.methods
        .claim()
        .accounts({
          user: publicKey,
          userAccount: userAccountPda,
          rewardsMint: rewardsMintPda,
          config: configPda,
          rewardsAta: rewardsAta,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .rpc();

      return tx;
    } catch (err: unknown) {
      const message = (err as Error)?.message || "";
      if (message.includes("User rejected")) {
        setError("Transaction cancelled by user");
      } else {
        setError(message || "Failed to claim rewards");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  const formatRewards = useCallback((points: number): string => {
    const tokens = points / Math.pow(10, REWARD_TOKEN_DECIMALS);
    return tokens.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  return {
    claim,
    calculatePendingRewards,
    pointsToTokens,
    formatRewards,
    loading,
    error,
    clearError: () => setError(null),
  };
};
