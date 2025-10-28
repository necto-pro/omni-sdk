# AI SDK - Anthropic Provider

The **[Anthropic provider](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic)** for the [AI SDK](https://ai-sdk.dev/docs) contains language model support for the [Anthropic Messages API](https://docs.anthropic.com/claude/reference/messages_post).

## Setup

The Anthropic provider is available in the `@omni-stack/anthropic` module. You can install it with

```bash
npm i @omni-stack/anthropic
```

## Provider Instance

You can import the default provider instance `anthropic` from `@omni-stack/anthropic`:

```ts
import { anthropic } from '@omni-stack/anthropic';
```

## Example

```ts
import { anthropic } from '@omni-stack/anthropic';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: anthropic('claude-3-haiku-20240307'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[Anthropic provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic)** for more information.
