import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white py-20 md:py-32">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Unlock the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                True Value
              </span>{" "}
              of Your NFTs
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stake your Solana NFTs to earn rewards, unlock utility, and join a thriving ecosystem of games and
              metaverses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
              </div>
              <span>Join 10,000+ NFT holders already staking</span>
            </div>
          </div>
          <div className="relative h-[400px] w-full rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 p-4 shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[350px] w-[350px]">
                <Image
                  src="/placeholder.svg?height=350&width=350"
                  alt="NFT Staking Platform"
                  width={350}
                  height={350}
                  className="object-cover rounded-lg"
                />
                <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                  <span className="font-bold">+20%</span>
                </div>
                <div className="absolute -bottom-4 -left-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg">
                  <span className="font-bold">NFT+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-200 opacity-20 blur-3xl"></div>
    </section>
  )
}
