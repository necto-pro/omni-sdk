# AI SDK - ElevenLabs Provider

The **[ElevenLabs provider](https://ai-sdk.dev/providers/ai-sdk-providers/elevenlabs)** for the [AI SDK](https://ai-sdk.dev/docs)
contains language model support for the ElevenLabs chat and completion APIs and embedding model support for the ElevenLabs embeddings API.

## Setup

The ElevenLabs provider is available in the `@omni-stack/elevenlabs` module. You can install it with

```bash
npm i @omni-stack/elevenlabs
```

## Provider Instance

You can import the default provider instance `elevenlabs` from `@omni-stack/elevenlabs`:

```ts
import { elevenlabs } from '@omni-stack/elevenlabs';
```

## Example

```ts
import { elevenlabs } from '@omni-stack/elevenlabs';
import { experimental_transcribe as transcribe } from '@omni-stack/core';

const { text } = await transcribe({
  model: elevenlabs.transcription('scribe_v1'),
  audio: new URL(
    'https://github.com/vercel/ai/raw/refs/heads/main/examples/ai-core/data/galileo.mp3',
  ),
});
```

## Documentation

Please check out the **[ElevenLabs provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/elevenlabs)** for more information.
