// @ts-nocheck
import { createAnthropic } from '@omni-stack/anthropic';

const anthropic = createAnthropic({
  apiKey: 'key',
  baseURL: 'url',
  headers: { 'custom': 'header' }
});
