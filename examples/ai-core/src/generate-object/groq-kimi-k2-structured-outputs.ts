import { groq } from '@omni-stack/groq';
import { generateObject } from '@omni-stack/core';
import { z } from 'zod';
import 'dotenv/config';

async function main() {
  const result = await generateObject({
    model: groq('moonshotai/kimi-k2-instruct'),
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(z.string()),
        instructions: z.array(z.string()),
      }),
    }),
    prompt: 'Generate a simple pasta recipe.',
  });

  console.log(JSON.stringify(result.object, null, 2));
}

main().catch(console.error);
