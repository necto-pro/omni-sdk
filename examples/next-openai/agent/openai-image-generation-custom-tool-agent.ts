import { generateImageTool } from '@/tool/generate-image-tool';
import { openai } from '@omni-stack/openai';
import { ToolLoopAgent, InferAgentUIMessage } from '@omni-stack/core';

export const openaiImageGenerationCustomToolAgent = new ToolLoopAgent({
  model: openai('gpt-5-mini'),
  tools: {
    imageGeneration: generateImageTool,
  },
  onStepFinish: ({ request }) => {
    console.dir(request.body, { depth: 3 });
  },
});

export type OpenAIImageGenerationCustomToolMessage = InferAgentUIMessage<
  typeof openaiImageGenerationCustomToolAgent
>;
