// @ts-nocheck
import { streamText } from '@omni-stack/core';

async function main() {
  const result = streamText({
    model: 'gpt-3.5-turbo',
    prompt: 'Hello, world!',
  });
  console.log(result);
}

main();
