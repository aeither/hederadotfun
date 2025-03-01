"use client";

import { useEffect, useState } from 'react';
import { createPublicClient, http, getContract } from 'viem';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Header } from "../../components/header";
import React from 'react';

interface TokenInfo {
  token_id: string;
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
  created_timestamp: string;
  treasury_account_id: string;
  custom_fees: {
    fixed_fees: any[];
    fractional_fees: any[];
  };
}

// Contract configuration
const tokenStorageAddress = "0xa0b340ac3BfBcc741eAC47d4819E5deF63Fdf0A5";
const tokenStorageAbi = [
  {
    inputs: [],
    name: "getTokenIds",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

// Create public client for reading from the contract
const publicClient = createPublicClient({
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet.hashio.io/api')
});

// Create contract instance
const contract = getContract({
  address: tokenStorageAddress as `0x${string}`,
  abi: tokenStorageAbi,
  client: {
    public: publicClient,
  }
});

// Function to get token information from Mirror Node
const getTokenInfo = async (tokenId: string): Promise<TokenInfo> => {
  const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch token info: ${response.statusText}`);
  }
  return response.json();
};

// Function to format the timestamp from nanoseconds to a readable date
const formatTimestamp = (timestamp: string) => {
  // Get only the integer part before the decimal point
  const seconds = parseInt(timestamp.split('.')[0]);
  const date = new Date(seconds * 1000);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function TokensPage() {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokens() {
      try {
        setLoading(true);
        setError(null);
        
        // Get all token IDs from the contract
        const storedTokenIds = await contract.read.getTokenIds() as string[];
        
        // Fetch token info for each ID
        const tokenInfoPromises = storedTokenIds.map(id => getTokenInfo(id));
        const tokenInfos = await Promise.all(tokenInfoPromises);
        console.log("🚀 ~ fetchTokens ~ tokenInfos:", tokenInfos)
        
        setTokens(tokenInfos);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to load tokens. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Available Tokens</h1>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeletons
              Array(6).fill(null).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : (
              tokens.map((token) => (
                <Card key={token.token_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {token.name}
                      <span className="text-sm text-muted-foreground">({token.symbol})</span>
                    </CardTitle>
                    <CardDescription>ID: {token.token_id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Supply</span>
                      <span className="font-medium">{Number(token.total_supply).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="font-medium">{formatTimestamp(token.created_timestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Decimals</span>
                      <span className="font-medium">{token.decimals}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">
                      Buy Token
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
