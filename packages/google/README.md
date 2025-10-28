# AI SDK - Google Generative AI Provider

The **[Google Generative AI provider](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)** for the [AI SDK](https://ai-sdk.dev/docs) contains language model support for the [Google Generative AI](https://ai.google/discover/generativeai/) APIs.

## Setup

The Google Generative AI provider is available in the `@omni-stack/google` module. You can install it with

```bash
npm i @omni-stack/google
```

## Provider Instance

You can import the default provider instance `google` from `@omni-stack/google`:

```ts
import { google } from '@omni-stack/google';
```

## Example

```ts
import { google } from '@omni-stack/google';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: google('gemini-1.5-pro-latest'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[Google Generative AI provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai)** for more information.
