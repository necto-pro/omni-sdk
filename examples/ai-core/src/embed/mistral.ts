import { mistral } from '@omni-stack/mistral';
import { embed } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const { embedding, usage } = await embed({
    model: mistral.embedding('mistral-embed'),
    value: 'sunny day at the beach',
  });

  console.log(embedding);
  console.log(usage);
}

main().catch(console.error);
