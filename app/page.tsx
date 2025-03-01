"use client";

import Link from "next/link"
import { ArrowRight, Github, MessageSquare, Shield, Zap } from "lucide-react"

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input"
import React from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">hedera.fun</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#tokenomics" className="text-sm font-medium hover:text-primary">
              Tokenomics
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              Documentation
            </Button>
            <Link href="/chat">
              <Button size="sm">Launch App</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-2">Powered by Hedera</div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  The Secure Token Launching Platform
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Create and trade tokens with confidence on Hedera's fastest and most secure network. Fair launches, no
                  presales, no team allocations.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-1">
                    Start Trading <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
                <div className="pt-4">
                  <div className="inline-block rounded-lg bg-muted/50 px-3 py-1 text-sm">Hackathon Project</div>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-3xl opacity-50" />
                <div className="relative bg-background border rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4 border-b bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <div className="ml-2 text-sm font-medium">hedera.fun AI Chat</div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-sm max-w-[80%]">
                          Hi there! I'm your Hedera token assistant. How can I help you today?
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-primary/20 rounded-lg p-3 text-sm max-w-[80%]">
                          I want to create a new token called "GreenEnergy" for tracking renewable energy credits
                        </div>
                        <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                          <div className="h-4 w-4 rounded-full bg-secondary"></div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-sm max-w-[80%]">
                          Great! I'll create a "GreenEnergy" token with symbol "GREN" on Hedera. Would you like to set
                          an initial supply or any custom tokenomics?
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." className="flex-1" />
                      <Button>Send</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose hedera.fun?</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Built on Hedera's secure and lightning-fast network, hedera.fun offers the best token launching
                  experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/20 p-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Natural Language Creation</h3>
                <p className="text-center text-muted-foreground">
                  Create tokens using simple conversation with our AI assistant. No technical knowledge required.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/20 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Hedera Native</h3>
                <p className="text-center text-muted-foreground">
                  Built on Hedera's high-performance network with carbon-negative footprint and minimal transaction
                  fees.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/20 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Enterprise Ready</h3>
                <p className="text-center text-muted-foreground">
                  Leverage Hedera's security and compliance features for building real-world applications with
                  confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">Process</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Simple, transparent, and secure token launching in just a few steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Pick a coin that you like",
                    description: "Browse through available tokens or create your own with just a few clicks.",
                  },
                  {
                    step: 2,
                    title: "Buy the coin on the bonding curve",
                    description: "Purchase tokens using the automated bonding curve mechanism for fair pricing.",
                  },
                  {
                    step: 3,
                    title: "Sell at any time to lock in profits",
                    description: "Freedom to exit your position whenever you want and secure your gains.",
                  },
                  {
                    step: 4,
                    title: "Market cap growth",
                    description: "When enough people buy on the bonding curve, it reaches a market cap of $100k.",
                  },
                  {
                    step: 5,
                    title: "Liquidity management",
                    description: "17% of liquidity is deposited in raydium and burned for long-term sustainability.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {item.step}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative order-first md:order-last">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-3xl opacity-50" />
                <div className="relative rounded-lg border bg-background p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="space-y-2 text-center">
                      <h3 className="text-xl font-bold">How it works</h3>
                      <p className="text-sm text-muted-foreground">
                        pump ensures that all created tokens are safe to trade through a secure and battle-tested token
                        launching system
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        each coin on pump is a <span className="font-medium">fair-launch</span> with:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>no presale</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>no team allocation</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-4">
                      <Button className="w-full">I'm ready to pump</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to create your token?</h2>
              <p className="text-primary-foreground/80 md:text-xl max-w-[800px]">
                Experience the future of token creation on Hedera with our AI-powered assistant. No coding required.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Button variant="secondary" size="lg" className="gap-1">
                  Try It Now <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} hedera.fun. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
