# AI SDK - xAI Grok Provider

The **[xAI Grok provider](https://ai-sdk.dev/providers/ai-sdk-providers/xai)** for the [AI SDK](https://ai-sdk.dev/docs)
contains language model support for the xAI chat and completion APIs.

## Setup

The xAI Grok provider is available in the `@omni-stack/xai` module. You can install it with

```bash
npm i @omni-stack/xai
```

## Provider Instance

You can import the default provider instance `xai` from `@omni-stack/xai`:

```ts
import { xai } from '@omni-stack/xai';
```

## Example

```ts
import { xai } from '@omni-stack/xai';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: xai('grok-3-beta'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[xAI Grok provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/xai)** for more information.
