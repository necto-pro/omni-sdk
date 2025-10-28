import { ProviderOptions, withUserAgentSuffix } from '@omni-stack/provider-utils';
import { prepareRetries } from '../util/prepare-retries';
import { EmbedResult } from './embed-result';
import { VERSION } from '../version';
import { execute } from '../execute';
import { ActionV1 } from '@omni-stack/provider';
import './embedding-action'; // Register the embedding action

export async function embed<VALUE = string>({
  model,
  value,
  providerOptions,
  maxRetries,
  abortSignal,
  headers,
}: {
  model: ActionV1;
  value: VALUE;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
  providerOptions?: ProviderOptions;
}): Promise<EmbedResult<VALUE>> {
  const headersWithUserAgent = withUserAgentSuffix(
    headers ?? {},
    `ai/${VERSION}`,
  );

  const { retry } = prepareRetries({
    maxRetries: maxRetries,
    abortSignal,
  });

  const result = await retry(() => execute({
    type: 'embedding.create',
    model,
    input: value,
    parameters: {},
    providerOptions,
    headers: headersWithUserAgent,
  }));

  return new DefaultEmbedResult({
    value,
    embedding: result.embedding,
    usage: { tokens: NaN }, // Usage is not available in this simplified flow
  });
}

class DefaultEmbedResult<VALUE> implements EmbedResult<VALUE> {
  readonly value: EmbedResult<VALUE>['value'];
  readonly embedding: EmbedResult<VALUE>['embedding'];
  readonly usage: EmbedResult<VALUE>['usage'];
  readonly providerMetadata: EmbedResult<VALUE>['providerMetadata'];
  readonly response: EmbedResult<VALUE>['response'];

  constructor(options: {
    value: EmbedResult<VALUE>['value'];
    embedding: EmbedResult<VALUE>['embedding'];
    usage: EmbedResult<VALUE>['usage'];
    providerMetadata?: EmbedResult<VALUE>['providerMetadata'];
    response?: EmbedResult<VALUE>['response'];
  }) {
    this.value = options.value;
    this.embedding = options.embedding;
    this.usage = options.usage;
    this.providerMetadata = options.providerMetadata;
    this.response = options.response;
  }
}
