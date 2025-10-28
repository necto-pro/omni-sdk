// @ts-nocheck
import { createOpenAI } from '@open-stack/openai';

const openai = createOpenAI({
  apiKey: 'key',
  baseURL: 'url',
  headers: { 'custom': 'header' }
});
