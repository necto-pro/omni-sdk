import { anthropicWebFetchAgent } from '@/agent/anthropic-web-fetch-agent';
import { createAgentUIStreamResponse } from '@omni-stack/core';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: anthropicWebFetchAgent,
    messages,
    sendSources: true,
  });
}
