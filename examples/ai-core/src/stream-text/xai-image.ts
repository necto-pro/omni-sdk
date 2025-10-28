import { xai } from '@omni-stack/xai';
import { streamText } from '@omni-stack/core';
import 'dotenv/config';
import fs from 'node:fs';

async function main() {
  const result = streamText({
    model: xai('grok-2-vision-1212'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          { type: 'image', image: fs.readFileSync('./data/comic-cat.png') },
        ],
      },
    ],
  });

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart);
  }
}

main().catch(console.error);
