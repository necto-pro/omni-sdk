import { openai } from '@omni-stack/openai';
import { generateObject } from '@omni-stack/core';
import 'dotenv/config';
import { z } from 'zod';

async function main() {
  const {
    object: { events },
  } = await generateObject({
    model: openai('gpt-4-turbo'),
    schema: z.object({
      events: z.array(
        z.object({
          date: z
            .string()
            .date()
            .transform(value => new Date(value)),
          event: z.string(),
        }),
      ),
    }),
    prompt: 'List 5 important events from the year 2000.',
  });

  console.log(events);
}

main().catch(console.error);
