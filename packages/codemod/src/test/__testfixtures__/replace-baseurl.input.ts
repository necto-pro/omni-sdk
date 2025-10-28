// @ts-nocheck
import { createAnthropic } from '@omni-stack/anthropic';
import { createOpenAI } from '@omni-stack/openai';
import { createMistral } from '@omni-stack/mistral';

const anthropic = createAnthropic({
  baseUrl: 'https://api.anthropic.com'
});

const openai = createOpenAI({
  baseUrl: 'https://api.openai.com'
});

const mistral = createMistral({
  baseUrl: 'https://api.mistral.ai'
});

// Should NOT rename - not in provider creation
const config = {
  baseUrl: 'https://example.com'
};

// Should NOT rename - not a provider
function someOtherFunction({ baseUrl }) {
  return baseUrl;
}
