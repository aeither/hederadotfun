import { Client, TokenId, TokenMintTransaction } from "@hashgraph/sdk";
import { NextResponse } from "next/server";

type AccountDetails = {
  account: string;
  alias: string;
  auto_renew_period: number;
  balance: {
    balance: number;
    timestamp: string;
    tokens: Array<{
      token_id: string;
      balance: number;
    }>;
  };
};


// Initialize Hedera client
const client = Client.forTestnet();

if (!process.env.HEDERA_ACCOUNT_ID || !process.env.HEDERA_PRIVATE_KEY) {
  throw new Error("HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be set in environment variables");
}

client.setOperator(
  process.env.HEDERA_ACCOUNT_ID,
  process.env.HEDERA_PRIVATE_KEY
);

interface MintTokenResult {
  status: string;
  txHash: string;
}

async function mintToken(
  tokenId: TokenId,
  amount: number
): Promise<MintTokenResult> {
  const tx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(amount)
    .freezeWith(client);

  const txResponse = await tx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const txStatus = receipt.status;

  if (!txStatus.toString().includes("SUCCESS")) {
    throw new Error("Token Minting Transaction failed");
  }

  return {
    status: txStatus.toString(),
    txHash: txResponse.transactionId.toString(),
  };
}

export async function POST(request: Request) {
  try {
    const { txHash, userAddress, tokenId, amount } = await request.json();

    // Verify the payment transaction
    // TODO: Add transaction verification logic here
    // You should verify that:
    // 1. The transaction is confirmed
    // 2. The amount is correct (5 tokens)
    // 3. The recipient address matches your expected address

    
    // Mint tokens to the user
    const result = await mintToken(TokenId.fromString(tokenId), amount);

    return NextResponse.json({
      success: true,
      ...result,
      userAddress,
    });
  } catch (error) {
    console.error("Error in mint endpoint:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mint token" },
      { status: 500 }
    );
  }
}
