import { fal } from '@omni-stack/fal';
import { experimental_generateImage as generateImage } from '@omni-stack/core';
import { presentImages } from '../lib/present-image';
import 'dotenv/config';

async function main() {
  const { images } = await generateImage({
    model: fal.image('fal-ai/recraft/v3/text-to-image'),
    prompt:
      'A Sumatran rhino meandering through a dense forest among fireflies at dusk',
  });
  await presentImages(images);
}

main().catch(console.error);
