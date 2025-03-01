import { Client, TokenCreateTransaction, TokenSupplyType, TokenType } from "@hashgraph/sdk";
import { CreateTokenResult } from "../../../types";

import {
  Address,
  createWalletClient,
  http,
  publicActions
} from "viem";
import { privateKeyToAccount } from "viem/accounts"; // Convert private key to account
import { hederaTestnet } from "viem/chains";
import dotenv from 'dotenv';

dotenv.config();

export interface CreateTokenOptions {
  name: string;
  symbol: string;
  decimals?: number;
  initialSupply?: number;
  isSupplyKey?: boolean;
  tokenType: TokenType;
  client: Client;
  maxSupply?: number;
  isMetadataKey?: boolean;
  isAdminKey?: boolean;
  tokenMetadata?: Uint8Array<ArrayBufferLike>;
  memo?: string;
}

const tokenStorageAddress = "0xa0b340ac3BfBcc741eAC47d4819E5deF63Fdf0A5";
const tokenStorageAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_tokenId",
        "type": "string"
      }
    ],
    "name": "addTokenId",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getTokenIds",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tokenIds",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


export const create_token = async (options: CreateTokenOptions): Promise<CreateTokenResult> => {
  const tx = new TokenCreateTransaction()
    .setTokenName(options.name)
    .setTokenSymbol(options.symbol)
    .setTokenType(options.tokenType)
    .setDecimals(options.decimals || 0)
    .setInitialSupply(options.initialSupply || 0)
    .setTreasuryAccountId(options.client.operatorAccountId!);
    console.log("🚀 ~ constcreate_token= ~ create_token")

  // Optional and conditional parameters
  if (options.maxSupply) {
    tx.setMaxSupply(options.maxSupply).setSupplyType(TokenSupplyType.Finite);
  }
  if (options.tokenMetadata) {
    tx.setMetadata(options.tokenMetadata);
  }
  if (options.memo) {
    tx.setTokenMemo(options.memo);
  }
  if (options.isMetadataKey) {
    tx.setMetadataKey(options.client.operatorPublicKey!);
  }
  if (options.isSupplyKey) {
    tx.setSupplyKey(options.client.operatorPublicKey!);
  }
  if (options.isAdminKey) {
    tx.setAdminKey(options.client.operatorPublicKey!);
  }

  const txResponse = await tx.execute(options.client);
  const receipt = await txResponse.getReceipt(options.client);
  const txStatus = receipt.status;

  if (!receipt.tokenId) throw new Error("Token Create Transaction failed");

  const PRIVATE_KEY = process.env.HEDERA_ETHERS_PRIVATE_KEY as Address;

  const account = privateKeyToAccount(PRIVATE_KEY);

  const walletClient = createWalletClient({
    account,
    chain: hederaTestnet,
    transport: http("https://testnet.hashio.io/api"),
  }).extend(publicActions);

  const { request } = await walletClient.simulateContract({
    account,
    address: tokenStorageAddress,
    abi: tokenStorageAbi,
    functionName: "addTokenId",
    value: 0n,
    args: [receipt.tokenId.toString()],
  });
  const hash = await walletClient.writeContract(request);
  console.log("🚀 ~ constcreate_token= ~ hash:", hash)
  
  return {
    status: txStatus.toString(),
    txHash: txResponse.transactionId.toString(),
    tokenId: receipt.tokenId,
  };
};
