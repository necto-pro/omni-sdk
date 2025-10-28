# AI SDK - Baseten Provider

The **[Baseten provider](https://ai-sdk.dev/providers/ai-sdk-providers/baseten)** for the [AI SDK](https://ai-sdk.dev/docs) contains language model and embedding model support for the [Baseten](https://baseten.co) platform.

## Setup

The Baseten provider is available in the `@omni-stack/baseten` module. You can install it with

```bash
npm i @omni-stack/baseten
```

## Provider Instance

You can import the default provider instance `baseten` from `@omni-stack/baseten`:

```ts
import { baseten } from '@omni-stack/baseten';
```

## Language Model Example (Model APIs)

```ts
import { baseten } from '@omni-stack/baseten';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: baseten('deepseek-ai/DeepSeek-V3-0324'),
  prompt: 'What is the meaning of life?',
});
```

## Documentation

Please check out the **[Baseten provider](https://ai-sdk.dev/providers/ai-sdk-providers/baseten)** for more information.
