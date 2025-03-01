"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

export function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "Features", href: "/#features" },
    { name: "Tokens", href: "/tokens" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Tokenomics", href: "/#tokenomics" },
    { name: "FAQ", href: "/#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">hedera.fun</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </motion.header>
  );
}
