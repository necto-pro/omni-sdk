import { openai } from '@omni-stack/openai';
import { streamText } from '@omni-stack/core';
import { run } from '../lib/run';

run(async () => {
  const result = streamText({
    model: openai('gpt-5-codex'),
    prompt: 'Write a JavaScript function that returns the sum of two numbers.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }

  console.log();
  console.log('Token usage:', await result.usage);
  console.log('Finish reason:', await result.finishReason);
});
