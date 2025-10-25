# AI SDK - Gateway Provider

The Gateway provider for the [AI SDK](https://ai-sdk.dev/docs) allows the use of a wide variety of AI models and providers.

## Setup

The Gateway provider is available in the `@omni-stack/gateway` module. You can install it with

```bash
npm i @omni-stack/gateway
```

## Provider Instance

You can import the default provider instance `gateway` from `@omni-stack/gateway`:

```ts
import { gateway } from '@omni-stack/gateway';
```

## Example

```ts
import { gateway } from '@omni-stack/gateway';
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: gateway('xai/grok-3-beta'),
  prompt:
    'Tell me about the history of the San Francisco Mission-style burrito.',
});
```

## Documentation

Please check out the [AI SDK documentation](https://ai-sdk.dev/docs) for more information.
