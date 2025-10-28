import { togetherai } from '@omni-stack/togetherai';
import { rerank } from '@omni-stack/core';
import { print } from '../lib/print';
import { run } from '../lib/run';

run(async () => {
  const result = await rerank({
    model: togetherai.reranking('Salesforce/Llama-Rank-v1'),
    documents: ['sunny day at the beach', 'rainy day in the city'],
    query: 'talk about rain',
  });

  print('Reranking:', result.ranking);
});
