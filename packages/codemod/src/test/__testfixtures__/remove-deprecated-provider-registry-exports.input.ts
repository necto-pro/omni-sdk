// @ts-nocheck
import { Provider, experimental_createProviderRegistry } from '@omni-stack/core';

function createProvider(): Provider {
  return {
    languageModel: () => null,
    textEmbeddingModel: () => null
  };
}

function createRegistry(): Provider {
  return experimental_createProviderRegistry({
    test: createProvider()
  });
}

const registry: Provider = createRegistry();
