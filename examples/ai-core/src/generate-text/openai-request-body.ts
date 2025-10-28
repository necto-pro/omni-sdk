import { openai } from '@omni-stack/openai';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { request } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  console.log('REQUEST BODY');
  console.log(request.body);
}

main().catch(console.error);
