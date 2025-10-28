import { google } from '@omni-stack/google';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';
import { presentImages } from '../lib/present-image';

async function main() {
  const result = await generateText({
    model: google('gemini-2.0-flash-exp'),
    prompt: 'Generate an image of a comic cat',
  });

  console.log(result.text);

  for (const file of result.files) {
    if (file.mediaType.startsWith('image/')) {
      await presentImages([file]);
    }
  }
}

main().catch(console.error);
