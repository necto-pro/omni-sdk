// @ts-nocheck
import { generateText } from '@omni-stack/core';
import { createCohere } from '@omni-stack/cohere';
import { generateId } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const cohereProvider = createCohere({
    generateId,
  });

  const { text } = await generateText({
    model: cohereProvider('command-r-plus'),
    prompt: 'Write a short story about red pandas.',
  });
  console.log(text);
}

main().catch(console.error);
