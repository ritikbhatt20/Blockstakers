"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { NETWORK, RPC_ENDPOINT } from "./constants";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
}) => {
  // You can also use a custom RPC endpoint
  const endpoint = useMemo(() => {
    // Use custom endpoint if provided, otherwise use cluster API
    return RPC_ENDPOINT || clusterApiUrl(NETWORK as "devnet" | "mainnet-beta");
  }, []);

  // Use empty wallets array - the wallet adapter will auto-detect installed wallets
  // This avoids issues with WalletConnect/Torus dependencies
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
