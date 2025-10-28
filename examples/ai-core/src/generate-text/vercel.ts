import 'dotenv/config';
import { vercel } from '@omni-stack/vercel';
import { generateText } from '@omni-stack/core';

async function main() {
  const result = await generateText({
    model: vercel('v0-1.5-md'),
    prompt: 'Implement Fibonacci in Lua.',
  });

  console.log(result.text);
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
}

main().catch(console.error);
