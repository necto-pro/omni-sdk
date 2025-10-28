import { openai } from '@omni-stack/openai';
import { generateText } from '@omni-stack/core';
import { run } from '../lib/run';

run(async () => {
  await generateText({
    model: openai('gpt-4o'),
    prompt: 'Invent a new holiday and describe its traditions.',
    onFinish(event) {
      console.dir(event, { depth: Infinity });
    },
  });
});
