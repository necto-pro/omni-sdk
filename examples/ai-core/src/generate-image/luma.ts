import { luma } from '@omni-stack/luma';
import { experimental_generateImage as generateImage } from '@omni-stack/core';
import { presentImages } from '../lib/present-image';
import 'dotenv/config';

async function main() {
  const result = await generateImage({
    model: luma.image('photon-flash-1'),
    prompt: 'A salamander at dusk in a forest pond, in the style of ukiyo-e',
    aspectRatio: '1:1',
    providerOptions: {
      luma: {
        // add'l options here
      },
    },
  });

  await presentImages(result.images);
}

main().catch(console.error);
