---
'@open-stack/openai': patch
---

feat(provider/openai): `OpenAIChatLanguageModelOptions` type

```ts
import { openai, type OpenAIChatLanguageModelOptions } from '@open-stack/openai';
import { generateText } from 'ai';

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
