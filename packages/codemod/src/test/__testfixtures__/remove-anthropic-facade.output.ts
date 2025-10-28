// @ts-nocheck
import { createAnthropic } from '@open-stack/anthropic';

const anthropic = createAnthropic({
  apiKey: 'key',
  baseURL: 'url',
  headers: { 'custom': 'header' }
});
