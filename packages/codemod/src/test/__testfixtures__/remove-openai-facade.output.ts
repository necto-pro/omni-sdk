// @ts-nocheck
import { createOpenAI } from '@omni-stack/openai';

const openai = createOpenAI({
  apiKey: 'key',
  baseURL: 'url',
  headers: { 'custom': 'header' }
});
