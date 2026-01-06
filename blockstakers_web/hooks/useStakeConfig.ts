"use client";

import { useState, useCallback, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { getConfigPda, getRewardsMintPda } from "@/lib/solana/pdas";
import idl from "@/lib/solana/idl/nft_staking.json";
import { PublicKey } from "@solana/web3.js";

export interface StakeConfigData {
  pointsPerStake: number;
  maxStake: number;
  freezePeriod: number;
  rewardsBump: number;
  bump: number;
}

export const useStakeConfig = () => {
  const { connection } = useConnection();
  const [config, setConfig] = useState<StakeConfigData | null>(null);
  const [rewardsMint, setRewardsMint] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = {
        connection,
        publicKey: null,
      } as unknown as AnchorProvider;

      const program = new Program(idl as Idl, provider);
      const [configPda] = getConfigPda();
      const [rewardsMintPda] = getRewardsMintPda(configPda);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const account = await (program as any).account.stakeConfig.fetch(configPda);

      setConfig({
        pointsPerStake: (account as Record<string, number>).points_per_stake ?? (account as Record<string, number>).pointsPerStake,
        maxStake: (account as Record<string, number>).max_stake ?? (account as Record<string, number>).maxStake,
        freezePeriod: (account as Record<string, number>).freeze_period ?? (account as Record<string, number>).freezePeriod,
        rewardsBump: (account as Record<string, number>).rewards_bump ?? (account as Record<string, number>).rewardsBump,
        bump: (account as Record<string, number>).bump,
      });
      setRewardsMint(rewardsMintPda);
      setIsInitialized(true);
    } catch (err: unknown) {
      const message = (err as Error)?.message || "";
      if (message.includes("Account does not exist")) {
        setIsInitialized(false);
        setConfig(null);
      } else {
        setError(message || "Failed to fetch stake config");
      }
    } finally {
      setLoading(false);
    }
  }, [connection]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const calculateAPY = useCallback(() => {
    if (!config) return 12;
    // Base APY calculation: more points per minute = higher APY
    // Using a realistic scale where 1 point/min gives ~12% APY
    const baseAPY = 12;
    const apy = baseAPY * config.pointsPerStake;
    return Math.round(apy * 10) / 10;
  }, [config]);

  return {
    config,
    rewardsMint,
    isInitialized,
    loading,
    error,
    calculateAPY,
    refetch: fetchConfig,
  };
};
