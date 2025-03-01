import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiWrapper } from "../lib/wagmi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hedera Agent Kit",
  description: "A toolkit for building agents on Hedera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiWrapper>
          {children}
        </WagmiWrapper>
      </body>
    </html>
  );
}
