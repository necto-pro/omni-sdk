import {
  GoogleVertexImageProviderOptions,
  vertex,
} from '@omni-stack/google-vertex';
import { experimental_generateImage as generateImage } from '@omni-stack/core';
import 'dotenv/config';
import { presentImages } from '../lib/present-image';

async function main() {
  const { image } = await generateImage({
    model: vertex.image('imagen-3.0-generate-002'),
    prompt: 'A burrito launched through a tunnel',
    aspectRatio: '1:1',
    providerOptions: {
      vertex: {
        addWatermark: false,
      } satisfies GoogleVertexImageProviderOptions,
    },
  });

  await presentImages([image]);
}

main().catch(console.error);
