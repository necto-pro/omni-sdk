import { ProviderOptions, withUserAgentSuffix } from '@omni-stack/provider-utils';
import { prepareRetries } from '../util/prepare-retries';
import { Embedding, EmbeddingModel, ProviderMetadata } from '../types';
import { EmbedManyResult } from './embed-many-result';
import { VERSION } from '../version';
import { execute } from '../execute';
import { ActionV1 } from '@omni-stack/provider';
import './embedding-action'; // Register the embedding action

export async function embedMany<VALUE = string>({
  model,
  values,
  maxParallelCalls = Infinity,
  maxRetries,
  abortSignal,
  headers,
  providerOptions,
}: {
  model: ActionV1;
  values: Array<VALUE>;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
  providerOptions?: ProviderOptions;
  maxParallelCalls?: number;
}): Promise<EmbedManyResult<VALUE>> {
  const headersWithUserAgent = withUserAgentSuffix(
    headers ?? {},
    `ai/${VERSION}`,
  );

  const { retry } = prepareRetries({
    maxRetries: maxRetries,
    abortSignal,
  });

  // Note: chunking and parallelization are now expected to be handled by the provider.
  const result = await retry(() => execute({
    type: 'embedding.create',
    model,
    input: values,
    parameters: {
      maxParallelCalls,
    },
    stream: false,
    providerOptions,
    headers: headersWithUserAgent,
  }));

  return new DefaultEmbedManyResult({
    values,
    embeddings: result.embeddings,
    usage: { tokens: NaN }, // Usage is not available in this simplified flow
  });
}

class DefaultEmbedManyResult<VALUE> implements EmbedManyResult<VALUE> {
  readonly values: EmbedManyResult<VALUE>['values'];
  readonly embeddings: EmbedManyResult<VALUE>['embeddings'];
  readonly usage: EmbedManyResult<VALUE>['usage'];
  readonly providerMetadata: EmbedManyResult<VALUE>['providerMetadata'];
  readonly responses: EmbedManyResult<VALUE>['responses'];

  constructor(options: {
    values: EmbedManyResult<VALUE>['values'];
    embeddings: EmbedManyResult<VALUE>['embeddings'];
    usage: EmbedManyResult<VALUE>['usage'];
    providerMetadata?: EmbedManyResult<VALUE>['providerMetadata'];
    responses?: EmbedManyResult<VALUE>['responses'];
  }) {
    this.values = options.values;
    this.embeddings = options.embeddings;
    this.usage = options.usage;
    this.providerMetadata = options.providerMetadata;
    this.responses = options.responses;
  }
}
