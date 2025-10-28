import { generateText } from '@omni-stack/core';
import { openai } from '@omni-stack/openai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: openai('gpt-4'),
    system: 'You are a helpful assistant.',
    prompt,
  });

  return Response.json({ text });
}
