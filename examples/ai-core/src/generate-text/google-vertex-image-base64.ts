import { vertex } from '@omni-stack/google-vertex';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';
import fs from 'node:fs';

async function main() {
  const result = await generateText({
    model: vertex('gemini-1.5-flash'),
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe the image in detail.' },
          {
            type: 'image',
            image: fs.readFileSync('./data/comic-cat.png').toString('base64'),
          },
        ],
      },
    ],
  });

  console.log(result.text);
}

main().catch(console.error);
