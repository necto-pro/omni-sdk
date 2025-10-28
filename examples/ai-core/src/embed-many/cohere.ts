import { cohere } from '@omni-stack/cohere';
import { embedMany } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { embeddings, usage } = await embedMany({
    model: cohere.embedding('embed-multilingual-v3.0'),
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
