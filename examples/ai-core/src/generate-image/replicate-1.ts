import { replicate } from '@omni-stack/replicate';
import { experimental_generateImage as generateImage } from '@omni-stack/core';
import { presentImages } from '../lib/present-image';
import 'dotenv/config';

async function main() {
  const { image } = await generateImage({
    model: replicate.image('black-forest-labs/flux-schnell'),
    prompt: 'The Loch Ness Monster getting a manicure',
  });

  await presentImages([image]);
}

main().catch(console.error);
