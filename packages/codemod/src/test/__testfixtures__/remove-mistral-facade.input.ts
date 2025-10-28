// @ts-nocheck
import { createMistral } from '@open-stack/mistral';

const mistral = createMistral({
  apiKey: 'key',
  baseURL: 'url',
  headers: { 'custom': 'header' }
});
