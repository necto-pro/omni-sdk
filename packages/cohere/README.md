# AI SDK - Cohere Provider

The **[Cohere provider](https://ai-sdk.dev/providers/ai-sdk-providers/cohere)** for the [AI SDK](https://ai-sdk.dev/docs) contains language model support for the Cohere API.

## Setup

The Cohere provider is available in the `@omni-stack/cohere` module. You can install it with

```bash
npm i @omni-stack/cohere
```

## Provider Instance

You can import the default provider instance `cohere` from `@omni-stack/cohere`:

```ts
import { cohere } from '@omni-stack/cohere';
```

## Example

```ts
import { cohere } from '@omni-stack/cohere';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: cohere('command-r-plus'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[Cohere provider](https://ai-sdk.dev/providers/ai-sdk-providers/cohere)** for more information.
