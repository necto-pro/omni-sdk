'use server';

import { openai } from '@omni-stack/openai';
import { streamText } from '@omni-stack/core';
import { createStreamableValue } from '@omni-stack/rsc';

export async function generateCompletion(prompt: string) {
  const result = streamText({
    model: openai('gpt-4-turbo'),
    maxOutputTokens: 2000,
    prompt,
  });

  return createStreamableValue(result.textStream).value;
}
