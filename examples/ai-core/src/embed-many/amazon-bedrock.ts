import { bedrock } from '@omni-stack/amazon-bedrock';
import { embedMany } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { embeddings, usage } = await embedMany({
    model: bedrock.embedding('amazon.titan-embed-text-v2:0'),
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
