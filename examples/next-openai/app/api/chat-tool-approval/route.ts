import { weatherWithApprovalAgent } from '@/agent/weather-with-approval-agent';
import { createAgentUIStreamResponse } from '@omni-stack/core';

export async function POST(request: Request) {
  const { messages } = await request.json();

  console.dir(messages, { depth: Infinity });

  return createAgentUIStreamResponse({
    agent: weatherWithApprovalAgent,
    messages,
  });
}
