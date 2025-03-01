import { Client, TokenId, TokenMintTransaction, TransferTransaction, AccountId } from "@hashgraph/sdk";
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

interface TransferTokenResult {
  status: string;
  txHash: string;
}

async function getHederaAccount(ethAddress: string): Promise<string | null> {
  try {
    const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${ethAddress}`);
    if (!response.ok) {
      return null;
    }
    const accountDetails: AccountDetails = await response.json();
    return accountDetails.account || null;
  } catch (error) {
    console.error("Error fetching Hedera account:", error);
    return null;
  }
}

async function mintToken(
  tokenId: TokenId,
  amount: number
): Promise<MintTokenResult> {
  const adjustedAmount = amount * 100; // Adjust for decimals
  const tx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(adjustedAmount)
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

async function transferToken(
  tokenId: TokenId,
  toAccountId: string,
  amount: number
): Promise<TransferTokenResult> {
  const adjustedAmount = amount * 100; // Adjust for decimals
  const tx = new TransferTransaction()
    .addTokenTransfer(tokenId, client.operatorAccountId!, -adjustedAmount)
    .addTokenTransfer(tokenId, toAccountId, adjustedAmount);

  const txResponse = await tx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const txStatus = receipt.status;

  if (!txStatus.toString().includes("SUCCESS")) {
    throw new Error("Token Transfer Transaction failed");
  }

  return {
    status: txStatus.toString(),
    txHash: txResponse.transactionId.toString(),
  };
}

export async function POST(request: Request) {
  try {
    const { txHash, userAddress, tokenId, amount } = await request.json();

    // Get the user's Hedera account ID from their ETH address
    const hederaAccountId = await getHederaAccount(userAddress);
    if (!hederaAccountId) {
      return NextResponse.json(
        { success: false, error: "No associated Hedera account found" },
        { status: 400 }
      );
    }

    // Verify the payment transaction
    // TODO: Add transaction verification logic here
    // You should verify that:
    // 1. The transaction is confirmed
    // 2. The amount is correct (5 tokens)
    // 3. The recipient address matches your expected address

    // First mint tokens to the treasury account
    const mintResult = await mintToken(TokenId.fromString(tokenId), amount);

    // Then transfer tokens to the user's Hedera account
    const transferResult = await transferToken(
      TokenId.fromString(tokenId),
      hederaAccountId,
      amount
    );

    return NextResponse.json({
      success: true,
      mint: mintResult,
      transfer: transferResult,
      hederaAccountId,
    });
  } catch (error) {
    console.error("Error in mint endpoint:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process token transaction" },
      { status: 500 }
    );
  }
}
