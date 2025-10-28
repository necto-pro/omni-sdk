import { anthropic } from '@omni-stack/anthropic';
import { streamText } from '@omni-stack/core';
import { run } from '../lib/run';
import { print } from '../lib/print';

run(async () => {
  const result = streamText({
    model: anthropic('claude-haiku-4-5'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  print('Request body:', (await result.request).body);
  print('Warnings:', await result.warnings);
});
