import { FetchFunction } from '@open-stack/provider-utils';

export type GroqConfig = {
  provider: string;
  url: (options: { modelId: string; path: string }) => string;
  headers: () => Record<string, string | undefined>;
  fetch?: FetchFunction;
  generateId?: () => string;
};
