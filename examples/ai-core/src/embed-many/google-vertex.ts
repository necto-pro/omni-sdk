import { vertex } from '@omni-stack/google-vertex';
import { embedMany } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { embeddings, usage } = await embedMany({
    model: vertex.textEmbeddingModel('text-embedding-004'),
    values: [
      'sunny day at the beach',
      'rainy afternoon in the city',
      'snowy night in the mountains',
    ],
  });

  console.log(embeddings);
  console.log(usage);
}

main().catch(console.error);
