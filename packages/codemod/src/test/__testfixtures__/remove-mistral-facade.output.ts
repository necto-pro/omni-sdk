// @ts-nocheck
import { createMistral } from '@omni-stack/mistral';

const mistral = createMistral({
  apiKey: 'key',
  baseURL: 'url',
  headers: { 'custom': 'header' }
});
