import { streamText } from '@omni-stack/core';
import { registry } from './setup-registry';

async function main() {
  const result = streamText({
    model: registry.languageModel('anthropic:haiku'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
}

main().catch(console.error);
