# AI SDK - Mistral Provider

The **[Mistral provider](https://ai-sdk.dev/providers/ai-sdk-providers/mistral)** for the [AI SDK](https://ai-sdk.dev/docs) contains language model support for the Mistral chat API.

## Setup

The Mistral provider is available in the `@omni-stack/mistral` module. You can install it with

```bash
npm i @omni-stack/mistral
```

## Provider Instance

You can import the default provider instance `mistral` from `@omni-stack/mistral`:

```ts
import { mistral } from '@omni-stack/mistral';
```

## Example

```ts
import { mistral } from '@omni-stack/mistral';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: mistral('mistral-large-latest'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[Mistral provider](https://ai-sdk.dev/providers/ai-sdk-providers/mistral)** for more information.
