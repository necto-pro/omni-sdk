// @ts-nocheck
import { streamText } from '@omni-stack/core';

async function main() {
  const result = await otherFunction({
    data: 'test',
  });
  const streamResult = streamText({
    model: 'gpt-3.5-turbo',
    prompt: 'Hello again!',
  });
  console.log(result, streamResult);
}

main();
