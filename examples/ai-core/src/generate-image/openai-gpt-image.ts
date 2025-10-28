import { openai } from '@omni-stack/openai';
import { experimental_generateImage as generateImage } from '@omni-stack/core';
import { presentImages } from '../lib/present-image';
import 'dotenv/config';

async function main() {
  const { image } = await generateImage({
    model: openai.image('gpt-image-1'),
    prompt: 'A salamander at sunrise in a forest pond in the Seychelles.',
    providerOptions: {
      openai: { quality: 'high' },
    },
  });

  await presentImages([image]);
}

main().catch(console.error);
