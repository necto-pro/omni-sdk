---
'@omni-stack/openai': patch
---

feat(provider/openai): `OpenAIChatLanguageModelOptions` type

```ts
import { openai, type OpenAIChatLanguageModelOptions } from '@omni-stack/openai';
import { generateText } from '@omni-stack/core';

await generateText({
  model: openai.chat('gpt-4o'),
  prompt: 'Invent a new holiday and describe its traditions.',
  providerOptions: {
    openai: {
      user: 'user-123',
    } satisfies OpenAIChatLanguageModelOptions,
  },
});
```
