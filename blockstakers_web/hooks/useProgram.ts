"use client";

import { useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import idl from "@/lib/solana/idl/nft_staking.json";

export type NftStakingProgram = Program<Idl>;

export const useProgram = (): NftStakingProgram | null => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });

    return new Program(idl as Idl, provider);
  }, [connection, wallet]);

  return program;
};

export const useProvider = (): AnchorProvider | null => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet) return null;

    return new AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });
  }, [connection, wallet]);
};
