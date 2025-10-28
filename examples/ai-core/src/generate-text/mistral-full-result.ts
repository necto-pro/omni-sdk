import { mistral } from '@omni-stack/mistral';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const result = await generateText({
    model: mistral('open-mistral-7b'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
