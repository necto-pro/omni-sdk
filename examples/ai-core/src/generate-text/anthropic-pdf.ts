import { anthropic } from '@omni-stack/anthropic';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';
import fs from 'node:fs';

async function main() {
  const result = await generateText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is an embedding model according to this document?',
          },
          {
            type: 'file',
            data: fs.readFileSync('./data/ai.pdf'),
            mediaType: 'application/pdf',
          },
        ],
      },
    ],
  });

  console.log(result.text);
}

main().catch(console.error);
