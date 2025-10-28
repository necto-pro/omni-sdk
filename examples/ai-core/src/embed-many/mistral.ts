import { mistral } from '@omni-stack/mistral';
import { embedMany } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { embeddings, usage } = await embedMany({
    model: mistral.embedding('mistral-embed'),
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
