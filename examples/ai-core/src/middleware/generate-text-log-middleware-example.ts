import { openai } from '@omni-stack/openai';
import { generateText, wrapLanguageModel } from '@omni-stack/core';
import 'dotenv/config';
import { yourLogMiddleware } from './your-log-middleware';

async function main() {
  const result = await generateText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: yourLogMiddleware,
    }),
    prompt: 'What cities are in the United States?',
  });
}

main().catch(console.error);
