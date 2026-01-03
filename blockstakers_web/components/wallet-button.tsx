"use client";

import dynamic from "next/dynamic";

// Dynamically import WalletMultiButton with SSR disabled to prevent hydration errors
export const WalletButton = dynamic(
  async () => {
    const { WalletMultiButton } = await import("@solana/wallet-adapter-react-ui");
    return { default: WalletMultiButton };
  },
  {
    ssr: false,
    loading: () => (
      <button className="wallet-adapter-button wallet-adapter-button-trigger bg-purple-600 hover:bg-purple-700 rounded-md h-10 px-4 text-white text-sm font-medium">
        Select Wallet
      </button>
    ),
  }
);
