"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletButton } from "@/components/wallet-button"
import {
  ArrowLeft,
  Coins,
  Clock,
  TrendingUp,
  Wallet,
  Loader2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import {
  useNFTs,
  useStaking,
  useUserAccount,
  useStakeConfig,
  useRewards,
  useToast,
  NFTData,
} from "@/hooks"
import { PublicKey } from "@solana/web3.js"
import { NETWORK } from "@/lib/solana/constants"

const getExplorerTxUrl = (signature: string) => {
  const cluster = (NETWORK as string) === "mainnet-beta" ? "" : `?cluster=${NETWORK}`
  return `https://explorer.solana.com/tx/${signature}${cluster}`
}

export default function DashboardPage() {
  const router = useRouter()
  const { connected, publicKey } = useWallet()
  const {
    nfts,
    stakedNfts,
    unstakedNfts,
    loading: nftsLoading,
    refetch: refetchNFTs,
  } = useNFTs()
  const {
    stake,
    unstake,
    loading: stakingLoading,
    error: stakingError,
  } = useStaking()
  const {
    userAccount,
    isInitialized,
    initializeUser,
    loading: userLoading,
    refetch: refetchUser,
  } = useUserAccount()
  const { config, calculateAPY } = useStakeConfig()
  const { claim, loading: claimLoading } = useRewards()
  const { toast } = useToast()

  // State for NFT details modal
  const [selectedNft, setSelectedNft] = useState<NFTData | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopyMint = (mintAddress: string) => {
    navigator.clipboard.writeText(mintAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getExplorerUrl = (mintAddress: string) => {
    const cluster = (NETWORK as string) === "mainnet-beta" ? "" : `?cluster=${NETWORK}`
    return `https://explorer.solana.com/address/${mintAddress}${cluster}`
  }

  // Redirect if not connected
  useEffect(() => {
    if (!connected) {
      // Give a moment for wallet to auto-connect
      const timer = setTimeout(() => {
        if (!connected) {
          router.push("/")
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [connected, router])

  const showTxToast = (action: string, signature: string) => {
    const shortSig = `${signature.slice(0, 4)}...${signature.slice(-4)}`
    toast({
      title: `${action} Successful`,
      description: (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{shortSig}</span>
          <a
            href={getExplorerTxUrl(signature)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      ),
    })
  }

  const handleUnstake = async (mintAddress: string) => {
    const tx = await unstake(new PublicKey(mintAddress))
    if (tx) {
      showTxToast("Unstake", tx)
      refetchNFTs()
      refetchUser()
    }
  }

  const handleStake = async (mintAddress: string) => {
    const tx = await stake(new PublicKey(mintAddress))
    if (tx) {
      showTxToast("Stake", tx)
      refetchNFTs()
      refetchUser()
    }
  }

  const handleClaim = async () => {
    const tx = await claim()
    if (tx) {
      showTxToast("Claim", tx)
      refetchUser()
    }
  }

  const handleInitialize = async () => {
    const tx = await initializeUser()
    if (tx) {
      showTxToast("Initialize", tx)
    }
  }

  const handleRefresh = () => {
    refetchNFTs()
    refetchUser()
  }

  const isLoading = nftsLoading || stakingLoading || userLoading || claimLoading

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <WalletButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <WalletButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md !h-9 !text-sm" />
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Initialize Account Banner */}
        {!isInitialized && !userLoading && (
          <Card className="mb-8 bg-purple-50 border-purple-200">
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-medium">Initialize Your Staking Account</h3>
                <p className="text-sm text-gray-600">
                  Create your staking account to start earning rewards
                </p>
              </div>
              <Button onClick={handleInitialize} disabled={userLoading}>
                {userLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Initialize Account
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total NFTs
              </CardTitle>
              <Wallet className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nfts.length}</div>
              <p className="text-xs text-gray-500">
                {stakedNfts.length} staked, {unstakedNfts.length} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Staked NFTs
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {userAccount?.amountStaked || 0}
              </div>
              <Progress
                value={
                  nfts.length > 0
                    ? ((userAccount?.amountStaked || 0) / nfts.length) * 100
                    : 0
                }
                className="h-1 mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Points
              </CardTitle>
              <Coins className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {userAccount?.points || 0}
              </div>
              <p className="text-xs text-gray-500">
                +{(userAccount?.amountStaked || 0) * (config?.pointsPerStake || 1)}{" "}
                points/min
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Estimated APY
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {config ? `${calculateAPY()}%` : "~12%"}
              </div>
              <p className="text-xs text-gray-500">
                {config?.pointsPerStake || 1} points/NFT/min
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Claim Rewards Card */}
        {(userAccount?.points || 0) > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <CardContent className="flex items-center justify-between py-6">
              <div>
                <h3 className="text-lg font-medium">Rewards Available</h3>
                <p className="text-3xl font-bold mt-1">
                  {userAccount?.points || 0} Points
                </p>
                <p className="text-sm text-purple-100 mt-1">
                  Claim now to convert to reward tokens
                </p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleClaim}
                disabled={claimLoading}
              >
                {claimLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Claim Rewards
              </Button>
            </CardContent>
          </Card>
        )}

        {/* NFTs Tabs */}
        <Tabs defaultValue="staked" className="space-y-6">
          <TabsList>
            <TabsTrigger value="staked">
              Staked NFTs ({stakedNfts.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Available NFTs ({unstakedNfts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staked">
            {nftsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : stakedNfts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No staked NFTs yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Stake your NFTs from the Available tab to start earning
                    rewards.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {stakedNfts.map((nft) => {
                  const minutesStaked = nft.stakeTimestamp
                    ? Math.floor(
                        (Date.now() / 1000 - nft.stakeTimestamp) / 60
                      )
                    : 0
                  const earnedPoints =
                    minutesStaked * (config?.pointsPerStake || 1)

                  return (
                    <Card key={nft.mint.toString()} className="overflow-hidden">
                      <div className="relative h-48 bg-gray-100">
                        {nft.image ? (
                          <Image
                            src={nft.image}
                            alt={nft.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                          Staked
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base truncate">
                          {nft.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1 text-sm text-gray-500">
                          <div className="flex justify-between">
                            <span>Staked for:</span>
                            <span className="font-medium">{minutesStaked} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Est. Rewards:</span>
                            <span className="font-medium text-green-600">
                              ~{earnedPoints} points
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleUnstake(nft.mint.toString())}
                          disabled={stakingLoading}
                        >
                          {stakingLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Unstake
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available">
            {nftsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : unstakedNfts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No available NFTs to stake.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    All your NFTs are currently staked or you don't have any
                    NFTs from this collection.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {unstakedNfts.map((nft) => (
                  <Card key={nft.mint.toString()} className="overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      {nft.image ? (
                        <Image
                          src={nft.image}
                          alt={nft.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base truncate">
                        {nft.name}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedNft(nft)}
                      >
                        View Details
                      </Button>
                      <Button
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleStake(nft.mint.toString())}
                        disabled={stakingLoading || !isInitialized}
                      >
                        {stakingLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {isInitialized ? "Stake" : "Initialize"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {stakingError && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg">
            {stakingError}
          </div>
        )}

        {/* NFT Details Modal */}
        <Dialog open={!!selectedNft} onOpenChange={() => setSelectedNft(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedNft?.name}</DialogTitle>
              <DialogDescription>
                NFT Details and Staking Information
              </DialogDescription>
            </DialogHeader>
            {selectedNft && (
              <div className="space-y-4">
                {/* NFT Image */}
                <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
                  {selectedNft.image ? (
                    <Image
                      src={selectedNft.image}
                      alt={selectedNft.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* NFT Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-500">Symbol</span>
                    <span className="font-medium">{selectedNft.symbol || "BSTK"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-500">Mint Address</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {selectedNft.mint.toString().slice(0, 4)}...{selectedNft.mint.toString().slice(-4)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopyMint(selectedNft.mint.toString())}
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <a
                        href={getExplorerUrl(selectedNft.mint.toString())}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-500">Estimated APY</span>
                    <span className="font-medium text-green-600">
                      {config ? `${calculateAPY()}%` : "~12%"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-500">Rewards Rate</span>
                    <span className="font-medium text-purple-600">
                      {config?.pointsPerStake || 1} points/min
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-500">Lock Period</span>
                    <span className="font-medium">
                      {config?.freezePeriod === 0 ? "None" : `${config?.freezePeriod || 0} min`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-500">Max Stake</span>
                    <span className="font-medium">{config?.maxStake || 100} NFTs</span>
                  </div>
                </div>

                {/* Stake Button */}
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    handleStake(selectedNft.mint.toString())
                    setSelectedNft(null)
                  }}
                  disabled={stakingLoading || !isInitialized}
                >
                  {stakingLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isInitialized ? "Stake This NFT" : "Initialize Account First"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
