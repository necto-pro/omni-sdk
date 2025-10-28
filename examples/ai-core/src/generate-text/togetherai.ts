import { togetherai } from '@omni-stack/togetherai';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { text, usage } = await generateText({
    model: togetherai('meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  console.log(text);
  console.log();
  console.log('Usage:', usage);
}

main().catch(console.error);
