# AI SDK - Azure OpenAI Provider

The **[Azure provider](https://ai-sdk.dev/providers/ai-sdk-providers/azure)** for the [AI SDK](https://ai-sdk.dev/docs) contains language model support for the Azure OpenAI API.

## Setup

The Azure provider is available in the `@omni-stack/azure` module. You can install it with

```bash
npm i @omni-stack/azure
```

## Provider Instance

You can import the default provider instance `azure` from `@omni-stack/azure`:

```ts
import { azure } from '@omni-stack/azure';
```

## Example

```ts
import { azure } from '@omni-stack/azure';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: azure('gpt-4o'), // your deployment name
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[Azure provider](https://ai-sdk.dev/providers/ai-sdk-providers/azure)** for more information.
