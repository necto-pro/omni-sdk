# AI SDK - Together.ai Provider

The **[Together.ai provider](https://ai-sdk.dev/providers/ai-sdk-providers/togetherai)** for the [AI SDK](https://ai-sdk.dev/docs) contains language model support for the [Together.ai](https://together.ai) platform.

## Setup

The Together.ai provider is available in the `@omni-stack/togetherai` module. You can install it with

```bash
npm i @omni-stack/togetherai
```

## Provider Instance

You can import the default provider instance `togetherai` from `@omni-stack/togetherai`:

```ts
import { togetherai } from '@omni-stack/togetherai';
```

## Example

```ts
import { togetherai } from '@omni-stack/togetherai';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: togetherai('meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'),
  prompt: 'Write a Python function that sorts a list:',
});
```

## Documentation

Please check out the **[Together.ai provider](https://ai-sdk.dev/providers/ai-sdk-providers/togetherai)** for more information.
