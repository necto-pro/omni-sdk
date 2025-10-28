import { createOpenAICompatible } from '@omni-stack/openai-compatible';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const nim = createOpenAICompatible({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    name: 'nim',
    headers: {
      Authorization: `Bearer ${process.env.NIM_API_KEY}`,
    },
  });
  const model = nim.chatModel('deepseek-ai/deepseek-r1');
  const result = await generateText({
    model,
    prompt: 'Tell me the history of the San Francisco Mission-style burrito.',
  });

  console.log(result.text);
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
}

main().catch(console.error);
