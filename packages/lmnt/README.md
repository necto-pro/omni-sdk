# AI SDK - LMNT Provider

The **[LMNT provider](https://ai-sdk.dev/providers/ai-sdk-providers/lmnt)** for the [AI SDK](https://ai-sdk.dev/docs)
contains language model support for the LMNT API.

## Setup

The LMNT provider is available in the `@omni-stack/lmnt` module. You can install it with

```bash
npm i @omni-stack/lmnt
```

## Provider Instance

You can import the default provider instance `lmnt` from `@omni-stack/lmnt`:

```ts
import { lmnt } from '@omni-stack/lmnt';
```

## Example

```ts
import { lmnt } from '@omni-stack/lmnt';
import { experimental_generateSpeech as generateSpeech } from '@omni-stack/core';

const result = await generateSpeech({
  model: lmnt.speech('aurora'),
  text: 'Hello, world!',
});
```

## Documentation

Please check out the **[LMNT provider documentation](https://ai-sdk.dev/providers/ai-sdk-providers/lmnt)** for more information.
