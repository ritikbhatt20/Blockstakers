import { ArrowRight, Award, Coins, Gamepad2, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { StakingDemo } from "@/components/staking-demo"
import { PartnershipsSection } from "@/components/partnerships-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}
        <section className="container py-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform offers unique benefits that enhance NFT utility and create lasting value
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Coins}
              title="Earn Rewards"
              description="Stake your NFTs to earn native tokens, additional NFTs, and exclusive digital assets"
            />
            <FeatureCard
              icon={Shield}
              title="Low Fees"
              description="Built on Solana to ensure minimal transaction costs and maximum efficiency"
            />
            <FeatureCard
              icon={Gamepad2}
              title="Gaming Integration"
              description="Connect with games and metaverses to unlock in-game benefits and assets"
            />
            <FeatureCard
              icon={Users}
              title="Community Building"
              description="Foster stronger communities through shared staking incentives and goals"
            />
            <FeatureCard
              icon={Award}
              title="Tiered Rewards"
              description="Earn more based on rarity, staking duration, and collection completeness"
            />
            <FeatureCard
              icon={ArrowRight}
              title="Easy Onboarding"
              description="Simple interface for both NFT creators and holders to participate"
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gradient-to-b from-purple-50 to-white py-20">
          <div className="container space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform makes staking your NFTs simple and rewarding
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">1. Connect Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Link your Solana wallet to access your NFT collection and begin the staking process
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">2. Select NFTs</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Choose which NFTs to stake from your collection and select your preferred staking duration
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">3. Earn Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Start earning rewards immediately based on your staked NFTs' rarity and staking parameters
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Staking Demo */}
        <StakingDemo />

        {/* Partnerships */}
        <PartnershipsSection />

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-900 to-indigo-800 py-20 text-white">
          <div className="container text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Enhance Your NFT Utility?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join our platform to start earning rewards and unlocking new possibilities for your NFT collection
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                Join Waitlist
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
