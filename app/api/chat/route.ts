import { ChatCerebras } from '@langchain/cerebras';
import { HumanMessage } from '@langchain/core/messages';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { NextResponse } from 'next/server';
import { createHederaTools, HederaAgentKit } from '../../../src';

let agent: any = null;
let config: any = null;

async function initializeAgent() {
  if (agent) return { agent, config };

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
  const agentConfig = { configurable: { thread_id: "Hedera Web Chat" } };

  agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `
      You are a helpful AI assistant that can interact with the Hedera blockchain.
      You can perform on-chain actions using the Hedera Agent Kit tools.
      Keep your responses concise and helpful.
      If you need funds, you can request them from a faucet or from the user.
      If there is a 5XX error, ask the user to try again later.
      If asked to do something beyond your tools' capabilities, explain that limitation.
      If user ask to create a token. Create only one.
    `,
  });

  config = agentConfig;
  return { agent, config };
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const { agent, config } = await initializeAgent();

    const stream = await agent.stream(
      { messages: [new HumanMessage(message)] },
      config
    );

    let response = '';
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        response += chunk.agent.messages[0].content + "\n";
      } else if ("tools" in chunk) {
        response += chunk.tools.messages[0].content + "\n";
      }
    }

    return NextResponse.json({ response: response.trim() });
  } catch (error: any) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
