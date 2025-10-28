# AI SDK - Rev.ai Provider

The **[Rev.ai provider](https://ai-sdk.dev/providers/ai-sdk-providers/revai)** for the [AI SDK](https://ai-sdk.dev/docs)
contains language model support for the Rev.ai transcription API.

## Setup

The Rev.ai provider is available in the `@omni-stack/revai` module. You can install it with

```bash
npm i @omni-stack/revai
```

## Provider Instance

You can import the default provider instance `revai` from `@omni-stack/revai`:

```ts
import { revai } from '@omni-stack/revai';
```

## Example

```ts
import { revai } from '@omni-stack/revai';
import { experimental_transcribe as transcribe } from '@omni-stack/core';

const { text } = await transcribe({
  model: revai.transcription('machine'),
  audio: new URL(
    'https://github.com/vercel/ai/raw/refs/heads/main/examples/ai-core/data/galileo.mp3',
  ),
});
```

## Documentation

Please check out the **[Rev.ai provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/revai)** for more information.
