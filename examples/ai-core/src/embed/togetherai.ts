import { togetherai } from '@omni-stack/togetherai';
import { embed } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { embedding, usage } = await embed({
    model: togetherai.textEmbeddingModel('BAAI/bge-base-en-v1.5'),
    value: 'sunny day at the beach',
  });

  console.log(embedding);
  console.log(usage);
}

main().catch(console.error);
