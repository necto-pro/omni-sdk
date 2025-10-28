import { anthropic, AnthropicProviderOptions } from '@omni-stack/anthropic';
import { ToolLoopAgent, InferAgentUIMessage } from '@omni-stack/core';

export const anthropicWebFetchAgent = new ToolLoopAgent({
  model: anthropic('claude-sonnet-4-5'),
  tools: {
    web_fetch: anthropic.tools.webFetch_20250910(),
  },
  providerOptions: {
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 },
    } satisfies AnthropicProviderOptions,
  },
});

export type AnthropicWebFetchMessage = InferAgentUIMessage<
  typeof anthropicWebFetchAgent
>;
