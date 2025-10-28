import { google } from '@omni-stack/google';
import { embedMany } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { embeddings, usage } = await embedMany({
    model: google.textEmbeddingModel('gemini-embedding-001'),
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
