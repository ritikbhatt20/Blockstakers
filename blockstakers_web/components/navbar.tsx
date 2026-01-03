"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletButton } from "@/components/wallet-button"

import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { connected } = useWallet()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600"></div>
            <span className="font-bold text-xl">SolStake</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
            How It Works
          </Link>
          <Link href="#partnerships" className="text-sm font-medium hover:text-primary">
            Partnerships
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:text-primary">
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <WalletButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md !h-10 !text-sm !font-medium" />
          {connected && (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#partnerships"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Partnerships
              </Link>
              <Link href="#faq" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </Link>
            </nav>
            <div className="flex flex-col space-y-2">
              <WalletButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md !h-10 !text-sm !font-medium !w-full" />
              {connected && (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
