import type { Metadata } from 'next'
import './globals.css'
import { WalletContextProvider } from '@/lib/solana/provider'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'SolStake - NFT Staking Platform',
  description: 'Stake your NFTs and earn rewards on Solana',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
          <Toaster />
        </WalletContextProvider>
      </body>
    </html>
  )
}
