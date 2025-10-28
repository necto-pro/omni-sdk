# AI SDK - Hume Provider

The **[Hume provider](https://ai-sdk.dev/providers/ai-sdk-providers/hume)** for the [AI SDK](https://ai-sdk.dev/docs)
contains support for the Hume API.

## Setup

The Hume provider is available in the `@omni-stack/hume` module. You can install it with

```bash
npm i @omni-stack/hume
```

## Provider Instance

You can import the default provider instance `hume` from `@omni-stack/hume`:

```ts
import { hume } from '@omni-stack/hume';
```

## Example

```ts
import { hume } from '@omni-stack/hume';
import { experimental_generateSpeech as generateSpeech } from '@omni-stack/core';

const result = await generateSpeech({
  model: hume.speech('aurora'),
  text: 'Hello, world!',
});
```

## Documentation

Please check out the **[Hume provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/hume)** for more information.
