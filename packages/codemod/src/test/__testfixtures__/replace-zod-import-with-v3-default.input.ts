// @ts-nocheck
import z from 'zod';
import { generateText } from '@omni-stack/core';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

export { schema };
