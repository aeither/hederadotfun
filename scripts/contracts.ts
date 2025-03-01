import { createWalletClient, createPublicClient, http, getContract } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';
dotenv.config();

// Function to get token information from Mirror Node
const getTokenInfo = async (tokenId: string) => {
    const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch token info: ${response.statusText}`);
    }
    return response.json();
};

// Example usage for Hedera
const accountId = process.env.HEDERA_ACCOUNT_ID;
const privateKey = process.env.HEDERA_PRIVATE_KEY;

if (!accountId || !privateKey) {
    throw new Error("Environment variables HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be present");
}

// Check for Ethereum private key
const ethPrivateKey = process.env.ETH_PRIVATE_KEY;
if (!ethPrivateKey) {
    throw new Error("Environment variable ETH_PRIVATE_KEY must be present");
}

// Ensure private key has 0x prefix
const formattedPrivateKey = ethPrivateKey.startsWith('0x') ? ethPrivateKey as `0x${string}`: `0x${ethPrivateKey}` as `0x${string}`;

// Ethereum wallet setup for viem
const account = privateKeyToAccount(formattedPrivateKey);
const rpcUrl = process.env.RPC_URL || 'https://testnet.hashio.io/api';

// Create wallet client for writing to the contract
const walletClient = createWalletClient({
    account,
    transport: http(rpcUrl)
});

// Create public client for reading from the contract
const publicClient = createPublicClient({
    transport: http(rpcUrl)
});

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

// Create contract instance
const contract = getContract({
    address: tokenStorageAddress as `0x${string}`,
    abi: tokenStorageAbi,
    client: {
        public: publicClient,
        wallet: walletClient
    }
});

const tokenId = "'0.0.5639536"; // Replace with your token ID

// Main function to execute the flow
async function main() {
    try {
        // Get token info from Mirror Node
        const tokenInfo = await getTokenInfo(tokenId.replace(/'/g, ''));
        console.log("Token Info:", tokenInfo);
        
        // // Store the token ID in the smart contract
        // console.log(`Storing token ID ${tokenId} in the contract...`);
        
        // // Call the contract's addTokenId function
        // const hash = await contract.write.addTokenId([tokenId]);
        // console.log(`Transaction submitted with hash: ${hash}`);
        
        // // Wait for transaction to be mined
        // const receipt = await publicClient.waitForTransactionReceipt({ hash });
        // console.log("Transaction confirmed in block:", receipt.blockNumber);
        
        // // Verify the token was added by reading from the contract
        const storedTokens = await contract.read.getTokenIds();
        console.log("Stored tokens:", storedTokens);
    } catch (error) {
        console.error("Error in main function:", error);
    }
}

// Execute the main function
main();
