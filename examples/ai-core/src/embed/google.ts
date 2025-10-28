import { google } from '@omni-stack/google';
import { embed } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { embedding, usage } = await embed({
    model: google.textEmbeddingModel('gemini-embedding-001'),
    value: 'sunny day at the beach',
  });

  console.log(embedding);
  console.log(usage);
}

main().catch(console.error);
