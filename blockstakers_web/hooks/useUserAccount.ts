"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { getUserAccountPda } from "@/lib/solana/pdas";
import { SystemProgram } from "@solana/web3.js";

export interface UserAccountData {
  points: number;
  amountStaked: number;
  bump: number;
}

export const useUserAccount = () => {
  const { publicKey } = useWallet();
  const program = useProgram();
  const [userAccount, setUserAccount] = useState<UserAccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserAccount = useCallback(async () => {
    if (!program || !publicKey) {
      setUserAccount(null);
      setIsInitialized(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userAccountPda] = getUserAccountPda(publicKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const account = await (program as any).account.userAccount.fetch(userAccountPda);

      setUserAccount({
        points: (account as Record<string, number>).points,
        amountStaked: (account as Record<string, number>).amount_staked ?? (account as Record<string, number>).amountStaked,
        bump: (account as Record<string, number>).bump,
      });
      setIsInitialized(true);
    } catch (err: unknown) {
      const message = (err as Error)?.message || "";
      if (message.includes("Account does not exist")) {
        setIsInitialized(false);
        setUserAccount(null);
      } else {
        setError(message || "Failed to fetch user account");
      }
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  const initializeUser = useCallback(async (): Promise<string | null> => {
    if (!program || !publicKey) {
      setError("Wallet not connected");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const [userAccountPda] = getUserAccountPda(publicKey);

      const tx = await program.methods
        .initializeUser()
        .accounts({
          user: publicKey,
          userAccount: userAccountPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await fetchUserAccount();
      return tx;
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to initialize user account");
      return null;
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, fetchUserAccount]);

  useEffect(() => {
    fetchUserAccount();
  }, [fetchUserAccount]);

  return {
    userAccount,
    isInitialized,
    loading,
    error,
    initializeUser,
    refetch: fetchUserAccount,
  };
};
