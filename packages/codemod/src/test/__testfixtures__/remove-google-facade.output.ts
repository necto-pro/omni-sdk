// @ts-nocheck
import { createGoogleGenerativeAI } from '@open-stack/google';

const google = createGoogleGenerativeAI({
  apiKey: 'key',
  baseURL: 'url',
  headers: { 'custom': 'header' }
});
