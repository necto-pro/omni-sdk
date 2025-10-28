import { openaiImageGenerationCustomToolAgent } from '@/agent/openai-image-generation-custom-tool-agent';
import { createAgentUIStreamResponse } from '@omni-stack/core';

export async function POST(request: Request) {
  const { messages } = await request.json();

  console.dir(messages, { depth: Infinity });

  return createAgentUIStreamResponse({
    agent: openaiImageGenerationCustomToolAgent,
    messages,
  });
}
