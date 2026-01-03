import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600"></div>
              <span className="font-bold text-xl">SolStake</span>
            </div>
            <p className="text-sm text-gray-500">
              Unlocking the true value of NFTs through staking, rewards, and ecosystem partnerships.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Stay Updated</h3>
            <p className="text-sm text-gray-500">Subscribe to our newsletter for the latest updates and features.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="max-w-[220px]" />
              <Button variant="outline">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© 2025 SolStake. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
