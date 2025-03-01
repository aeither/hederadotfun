import { Bot } from "grammy";
import HederaAgentKit from "../src/agent";
import { createHederaTools } from "../src";
import { ChatCerebras } from "@langchain/cerebras";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";
import { CreateFTOptions } from "hedera-agent-kit";

dotenv.config();

function validateEnvironment(): void {
  const requiredVars = [
    "CEREBRAS_API_KEY",
    "HEDERA_ACCOUNT_ID",
    "HEDERA_PRIVATE_KEY",
    "TELEGRAM_BOT_TOKEN"
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set:", missingVars);
    process.exit(1);
  }
}

async function initializeAgent() {
  try {
    const llm = new ChatCerebras({
      model: "llama-3.3-70b"
    });

    const hederaKit = new HederaAgentKit(
      process.env.HEDERA_ACCOUNT_ID!,
      process.env.HEDERA_PRIVATE_KEY!,
      (process.env.HEDERA_NETWORK as "mainnet" | "testnet" | "previewnet") ?? "testnet"
    );

    const tools = createHederaTools(hederaKit);
    const memory = new MemorySaver();
    const config = { configurable: { thread_id: "Hedera Telegram Bot" } };

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful Telegram bot that can interact with the Hedera blockchain.
        You can perform on-chain actions using the Hedera Agent Kit tools.
        Keep your responses concise and helpful.
        If you need funds, you can request them from a faucet or from the user.
        If there is a 5XX error, ask the user to try again later.
        If asked to do something beyond your tools' capabilities, explain that limitation.
      `,
    });

    return { agent, config };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}

// Initialize bot and agent
validateEnvironment();
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
let agent: any;
let config: any;

// Initialize the agent when the bot starts
initializeAgent().then(({ agent: a, config: c }) => {
  agent = a;
  config = c;
  console.log("Agent initialized successfully!");
}).catch(error => {
  console.error("Failed to initialize agent:", error);
  process.exit(1);
});

bot.command("start", (ctx) => ctx.reply(
  "Hello! I'm a Hedera-powered Telegram bot. I can help you interact with the Hedera blockchain. " +
  "Just send me a message describing what you'd like to do!"
));
bot.command("ft", async (ctx) => {
  try {
    const hederaKit = new HederaAgentKit(
      process.env.HEDERA_ACCOUNT_ID!,
      process.env.HEDERA_PRIVATE_KEY!,
      (process.env.HEDERA_NETWORK as "mainnet" | "testnet" | "previewnet") ?? "testnet"
    );

    // Check account balance first
    const balance = await hederaKit.getHbarBalance();
    console.log("Account balance:", balance);
    
    if (balance < 1) {
      await ctx.reply("Insufficient balance. You need at least 1 HBAR to create a token.");
      return;
    }

    const options: CreateFTOptions = {
      name: "MyToken",       // Token name (string, required)
      symbol: "MTK",         // Token symbol (string, required)
      // decimals: 2,           // Number of decimal places (optional, defaults to 0)
      // initialSupply: 1000,   // Initial supply of tokens (optional, defaults to 0), given in base unit
      // isSupplyKey: true,     // Supply key flag (optional, defaults to false)
      // maxSupply: 10000,      // Maximum token supply (optional, if not set there is no maxSupply), given in base unit
      // isMetadataKey: true,   // Metadata key flag (optional, defaults to false)
      // isAdminKey: true,      // Admin key flag (optional, defaults to false)
      // tokenMetadata: new TextEncoder().encode("Metadata Info"), // Token metadata (optional, can be omitted if not needed)
      // memo: "Initial Token Creation" // Optional memo (string)
    };
  
    const result = await hederaKit.createFT(options);
    await ctx.reply(`Welcome! I've created a token for you. Token ID: ${result.tokenId}`);
  } catch (error) {
    console.error("Error creating token:", error);
    await ctx.reply("Sorry, I couldn't create a token for you. Please try again later.");
  }
});


// Handle incoming messages
bot.on("message:text", async (ctx) => {
  try {
    if (!agent) {
      await ctx.reply("Bot is still initializing. Please try again in a moment.");
      return;
    }

    // Send a "typing" action
    await ctx.replyWithChatAction("typing");

    console.log("Received message:", ctx.message.text);

    const stream = await agent.stream(
      { messages: [new HumanMessage(ctx.message.text)] },
      config
    );

    let response = "";

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        response += chunk.agent.messages[0].content + "\n";
      } else if ("tools" in chunk) {
        response += chunk.tools.messages[0].content + "\n";
      }
    }

    // Split response into chunks if it's too long (Telegram has a 4096 character limit)
    const MAX_LENGTH = 4000;
    for (let i = 0; i < response.length; i += MAX_LENGTH) {
      const chunk = response.slice(i, i + MAX_LENGTH);
      await ctx.reply(chunk);
    }

  } catch (error: any) {
    console.error("Error processing message:", error);

    let errorMessage = "An unexpected error occurred.";
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    await ctx.reply(`Sorry, there was an error: ${errorMessage}`);
  }
});

// Start the bot
bot.start();
console.log("Bot is running!");
