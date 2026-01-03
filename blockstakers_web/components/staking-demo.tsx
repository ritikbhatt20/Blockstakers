"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Clock, Coins, Gem, Loader2, AlertCircle } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletButton } from "@/components/wallet-button"
import { PublicKey } from "@solana/web3.js"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useNFTs, useStaking, useUserAccount, useStakeConfig, useRewards } from "@/hooks"

export function StakingDemo() {
  const { connected } = useWallet()
  const { unstakedNfts, stakedNfts, loading: nftsLoading, refetch: refetchNFTs } = useNFTs()
  const { stake, unstake, loading: stakingLoading, error: stakingError, clearError } = useStaking()
  const { userAccount, isInitialized, initializeUser, loading: userLoading } = useUserAccount()
  const { config, calculateAPY } = useStakeConfig()
  const { claim, loading: claimLoading } = useRewards()

  const [selectedNfts, setSelectedNfts] = useState<string[]>([])
  const [txSuccess, setTxSuccess] = useState<string | null>(null)

  // Clear success message after 5 seconds
  useEffect(() => {
    if (txSuccess) {
      const timer = setTimeout(() => setTxSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [txSuccess])

  const toggleNft = (mintAddress: string) => {
    if (selectedNfts.includes(mintAddress)) {
      setSelectedNfts(selectedNfts.filter((addr) => addr !== mintAddress))
    } else {
      setSelectedNfts([...selectedNfts, mintAddress])
    }
  }

  const handleStake = async () => {
    if (selectedNfts.length === 0) return

    clearError()

    for (const mintAddress of selectedNfts) {
      const tx = await stake(new PublicKey(mintAddress))
      if (tx) {
        setTxSuccess(`Successfully staked NFT! TX: ${tx.slice(0, 8)}...`)
      }
    }

    setSelectedNfts([])
    refetchNFTs()
  }

  const handleUnstake = async (mintAddress: string) => {
    clearError()
    const tx = await unstake(new PublicKey(mintAddress))
    if (tx) {
      setTxSuccess(`Successfully unstaked NFT! TX: ${tx.slice(0, 8)}...`)
    }
    refetchNFTs()
  }

  const handleClaim = async () => {
    const tx = await claim()
    if (tx) {
      setTxSuccess(`Successfully claimed rewards! TX: ${tx.slice(0, 8)}...`)
    }
  }

  const handleInitializeUser = async () => {
    const tx = await initializeUser()
    if (tx) {
      setTxSuccess(`Account initialized! TX: ${tx.slice(0, 8)}...`)
    }
  }

  // Demo NFTs for when wallet is not connected
  const demoNfts = [
    { id: "1", name: "Cosmic Ape #1024", rarity: "Legendary", apy: "24%" },
    { id: "2", name: "Solana Surfer #498", rarity: "Rare", apy: "18%" },
    { id: "3", name: "Pixel Punk #7652", rarity: "Uncommon", apy: "15%" },
    { id: "4", name: "Degen Dino #302", rarity: "Rare", apy: "17%" },
  ]

  const displayNfts = connected ? unstakedNfts : demoNfts
  const isLoading = nftsLoading || stakingLoading || userLoading || claimLoading

  return (
    <section className="container py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Experience the Platform</h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          {connected
            ? "Select your NFTs below to start earning rewards"
            : "Connect your wallet to stake real NFTs and start earning rewards"
          }
        </p>
      </div>

      {/* Success/Error Alerts */}
      {txSuccess && (
        <Alert className="mb-6 max-w-5xl mx-auto bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{txSuccess}</AlertDescription>
        </Alert>
      )}
      {stakingError && (
        <Alert className="mb-6 max-w-5xl mx-auto bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{stakingError}</AlertDescription>
        </Alert>
      )}

      {/* Initialize User Account */}
      {connected && !isInitialized && !userLoading && (
        <div className="mb-6 max-w-5xl mx-auto">
          <Alert className="bg-purple-50 border-purple-200">
            <AlertDescription className="flex items-center justify-between">
              <span>You need to initialize your staking account first.</span>
              <Button onClick={handleInitializeUser} disabled={userLoading} size="sm">
                {userLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Initialize Account"}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="mx-auto max-w-5xl rounded-xl border bg-card shadow-sm">
        <Tabs defaultValue="stake" className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-14">
              <TabsTrigger value="stake" className="text-sm">
                Stake NFTs
              </TabsTrigger>
              <TabsTrigger value="rewards" className="text-sm">
                Rewards
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="text-sm">
                Dashboard
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="stake" className="p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Select NFTs to Stake</h3>
                  <span className="text-sm text-gray-500">
                    {connected ? `${selectedNfts.length} selected` : "Demo Mode"}
                  </span>
                </div>

                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  </div>
                )}

                {!isLoading && displayNfts.length === 0 && connected && (
                  <div className="text-center py-12 text-gray-500">
                    <p>No NFTs found in your wallet from this collection.</p>
                    <p className="text-sm mt-2">Make sure you have NFTs from the supported collection.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {!isLoading && displayNfts.map((nft: any) => {
                    const mintAddress = connected ? nft.mint.toString() : nft.id
                    const isSelected = selectedNfts.includes(mintAddress)

                    return (
                      <Card
                        key={mintAddress}
                        className={`cursor-pointer transition-all ${
                          isSelected ? "ring-2 ring-purple-500" : "hover:border-purple-200"
                        } ${!connected ? "opacity-75" : ""}`}
                        onClick={() => connected && toggleNft(mintAddress)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{nft.name}</CardTitle>
                            <div className="flex items-center gap-1">
                              <Gem className="h-3 w-3 text-purple-500" />
                              <span className="text-xs font-medium">
                                {connected ? "NFT" : nft.rarity}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="relative h-32 w-full overflow-hidden rounded-md bg-gray-100">
                            {nft.image ? (
                              <Image
                                src={nft.image}
                                alt={nft.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Image
                                src={`/placeholder.svg?height=128&width=128&text=${encodeURIComponent(nft.name?.slice(0, 10) || 'NFT')}`}
                                alt={nft.name || "NFT"}
                                width={128}
                                height={128}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            <span>APY: {config ? `${calculateAPY()}%` : nft.apy || "~18%"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Min: {config?.freezePeriod || 7} days</span>
                          </div>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Staking Summary</CardTitle>
                    <CardDescription>Review your selection before staking</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Selected NFTs</span>
                        <span className="font-medium">{selectedNfts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Estimated APY</span>
                        <span className="font-medium text-purple-600">
                          {config ? `${calculateAPY()}%` : "~18%"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Staking Period</span>
                        <span className="font-medium">{config?.freezePeriod || 7} days min</span>
                      </div>
                      {userAccount && (
                        <div className="flex justify-between">
                          <span className="text-sm">Currently Staked</span>
                          <span className="font-medium">{userAccount.amountStaked} NFTs</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Potential Rewards</span>
                        <span className="font-medium">
                          ~{selectedNfts.length * (config?.pointsPerStake || 10)} points/day
                        </span>
                      </div>
                      <Progress value={selectedNfts.length * 25} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    {connected ? (
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        disabled={selectedNfts.length === 0 || stakingLoading || !isInitialized}
                        onClick={handleStake}
                      >
                        {stakingLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {!isInitialized ? "Initialize Account First" : `Stake ${selectedNfts.length} NFT${selectedNfts.length !== 1 ? 's' : ''}`}
                      </Button>
                    ) : (
                      <WalletButton className="!w-full !bg-gradient-to-r !from-purple-600 !to-indigo-600 hover:!from-purple-700 hover:!to-indigo-700 !rounded-md !h-10" />
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="p-6">
            {connected ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-purple-600">
                        {userAccount?.points || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Staked NFTs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userAccount?.amountStaked || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Points Per Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">
                        +{(userAccount?.amountStaked || 0) * (config?.pointsPerStake || 10)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Claim Rewards</CardTitle>
                    <CardDescription>Convert your points to reward tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      You have <span className="font-bold text-purple-600">{userAccount?.points || 0} points</span> available to claim.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleClaim}
                      disabled={!userAccount?.points || claimLoading}
                      className="w-full"
                    >
                      {claimLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Claim {userAccount?.points || 0} Reward Tokens
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Connect your wallet to view rewards</h3>
                <p className="text-gray-500 mb-6">See your earned rewards and staking history</p>
                <WalletButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboard" className="p-6">
            {connected ? (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Your Staked NFTs</h3>

                {stakedNfts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>You have no staked NFTs.</p>
                    <p className="text-sm mt-2">Go to the Stake tab to stake your first NFT!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {stakedNfts.map((nft) => {
                      const daysStaked = nft.stakeTimestamp
                        ? Math.floor((Date.now() / 1000 - nft.stakeTimestamp) / 86400)
                        : 0

                      return (
                        <Card key={nft.mint.toString()}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{nft.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="relative h-32 w-full overflow-hidden rounded-md bg-gray-100">
                              {nft.image ? (
                                <Image src={nft.image} alt={nft.name} fill className="object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              <p>Staked for: {daysStaked} days</p>
                              <p>Earned: ~{daysStaked * (config?.pointsPerStake || 10)} points</p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => handleUnstake(nft.mint.toString())}
                              disabled={stakingLoading}
                            >
                              {stakingLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Unstake
                            </Button>
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Connect your wallet to view dashboard</h3>
                <p className="text-gray-500 mb-6">Track your staked NFTs and performance</p>
                <WalletButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-md" />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
