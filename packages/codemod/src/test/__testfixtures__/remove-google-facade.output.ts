// @ts-nocheck
import { createGoogleGenerativeAI } from '@omni-stack/google';

const google = createGoogleGenerativeAI({
  apiKey: 'key',
  baseURL: 'url',
  headers: { 'custom': 'header' }
});
