# AI SDK - OpenAI Provider

The **[OpenAI provider](https://ai-sdk.dev/providers/ai-sdk-providers/openai)** for the [AI SDK](https://ai-sdk.dev/docs)
contains language model support for the OpenAI chat and completion APIs and embedding model support for the OpenAI embeddings API.

## Setup

The OpenAI provider is available in the `@omni-stack/openai` module. You can install it with

```bash
npm i @omni-stack/openai
```

## Provider Instance

You can import the default provider instance `openai` from `@omni-stack/openai`:

```ts
import { openai } from '@omni-stack/openai';
```

## Example

```ts
import { openai } from '@omni-stack/openai';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[OpenAI provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/openai)** for more information.
