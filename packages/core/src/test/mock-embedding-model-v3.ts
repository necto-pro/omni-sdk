import { EmbeddingModelV3 } from '../types/embedding-model';
import { Embedding } from '../types/embedding';
import { LanguageModelV3Response } from '@omni-stack/provider';
import { ActionV1 } from '@omni-stack/provider';

export class MockEmbeddingModelV3<VALUE> implements EmbeddingModelV3<VALUE>, ActionV1 {
  readonly specificationVersion = 'v3';

  readonly provider = 'mock-provider';
  readonly modelId = 'mock-model-id';
  readonly maxEmbeddingsPerCall: EmbeddingModelV3<VALUE>['maxEmbeddingsPerCall'];
  readonly supportsParallelCalls: EmbeddingModelV3<VALUE>['supportsParallelCalls'];

  doEmbed: EmbeddingModelV3<VALUE>['doEmbed'];

  constructor({
    provider = 'mock-provider',
    modelId = 'mock-model-id',
    maxEmbeddingsPerCall = 1,
    supportsParallelCalls = false,
    doEmbed = notImplemented,
  }: {
    provider?: EmbeddingModelV3<VALUE>['provider'];
    modelId?: EmbeddingModelV3<VALUE>['modelId'];
    maxEmbeddingsPerCall?:
      | EmbeddingModelV3<VALUE>['maxEmbeddingsPerCall']
      | null;
    supportsParallelCalls?: EmbeddingModelV3<VALUE>['supportsParallelCalls'];
    doEmbed?: EmbeddingModelV3<VALUE>['doEmbed'];
  } = {}) {
    this.provider = provider;
    this.modelId = modelId;
    this.maxEmbeddingsPerCall = maxEmbeddingsPerCall ?? undefined;
    this.supportsParallelCalls = supportsParallelCalls;
    this.doEmbed = doEmbed;
  }

  async doEmbed(options: any): Promise<any> {
    return this.options.doEmbed(options);
  }

  async doAction(options: any): Promise<any> {
    return this.doEmbed(options);
  }
}
