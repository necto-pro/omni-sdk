# Vercel AI SDK - Hugging Face Provider

The **[Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/index)** for the [Vercel AI SDK](https://ai-sdk.dev/docs) contains language model support for thousands of models through multiple inference providers via the Hugging Face router API.

## Setup

The Hugging Face provider is available in the `@omni-stack/huggingface` module. You can install it with:

```bash
npm i @omni-stack/huggingface
```

## Provider Instance

You can import the default provider instance `huggingface` from `@omni-stack/huggingface`:

```ts
import { huggingface } from '@omni-stack/huggingface';
```

## Example

```ts
import { huggingface } from '@omni-stack/huggingface';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: huggingface('meta-llama/Llama-3.1-8B-Instruct'),
  prompt: 'Write a vegetarian lasagna recipe.',
});
```

## Documentation

Please check out the **[Hugging Face provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/huggingface)** for more information.
