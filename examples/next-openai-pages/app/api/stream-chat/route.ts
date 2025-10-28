import { ModelMessage, streamText } from '@omni-stack/core';
import { openai } from '@omni-stack/openai';

export async function POST(req: Request) {
  const { messages }: { messages: ModelMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toUIMessageStreamResponse();
}
