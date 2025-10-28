// @ts-nocheck
import { streamText as myStreamText } from '@omni-stack/core';

async function main() {
  const result = myStreamText({
    model: 'gpt-3.5-turbo',
    prompt: 'Hello, world!',
  });
  console.log(result);
}

main();
