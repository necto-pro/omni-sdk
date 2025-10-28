# AI SDK - Google Generative AI Provider

The **[Google Generative AI provider](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)** for the [AI SDK](https://ai-sdk.dev/docs) contains language model support for the [Google Generative AI](https://ai.google/discover/generativeai/) APIs.

## Setup

The Google Generative AI provider is available in the `@open-stack/google` module. You can install it with

```bash
npm i @open-stack/google
```

## Provider Instance

You can import the default provider instance `google` from `@open-stack/google`:

```ts
import { google } from '@open-stack/google';
```

## Example

```ts
import { google } from '@open-stack/google';
import { generateText } from 'ai';

const { text } = await generateText({
  model: google('gemini-1.5-pro-latest'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[Google Generative AI provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)** for more information.
