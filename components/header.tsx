"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

export function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "Chat", href: "/chat" },
    { name: "Tokens", href: "/tokens" },
  ];

  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 flex h-16 items-center">
        <div className="flex gap-8 items-center">
          <Link href="/" className="font-bold text-xl">
            Hedera Agent
          </Link>
          <div className="flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
