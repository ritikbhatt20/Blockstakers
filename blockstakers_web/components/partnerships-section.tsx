import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function PartnershipsSection() {
  return (
    <section className="container py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ecosystem Partnerships</h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          We're building a network of games, metaverses, and NFT projects to maximize utility
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 mb-4"></div>
            <CardTitle>Gaming Integrations</CardTitle>
            <CardDescription>Connect your NFTs with popular blockchain games</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500">
              Stake your NFTs to earn in-game assets, exclusive access, and gameplay advantages across multiple gaming
              platforms.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="px-0 text-purple-600">
              Explore Games <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 mb-4"></div>
            <CardTitle>Metaverse Connections</CardTitle>
            <CardDescription>Unlock virtual world benefits and experiences</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500">
              Your staked NFTs can provide access to exclusive metaverse locations, events, and digital assets across
              partner platforms.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="px-0 text-purple-600">
              Discover Metaverses <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 mb-4"></div>
            <CardTitle>NFT Project Collaborations</CardTitle>
            <CardDescription>Cross-collection benefits and rewards</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500">
              Stake NFTs from one collection to earn rewards from partner collections, creating a network of
              interconnected value.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="px-0 text-purple-600">
              View Collections <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Become a Partner</h3>
            <p className="text-gray-600 mb-6">
              Join our ecosystem to enhance your project's utility and provide more value to your community. We're
              looking for games, metaverses, and NFT projects that want to expand their reach.
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Apply for Partnership
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-white p-2 shadow-sm flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
