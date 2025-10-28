import { xai } from '@omni-stack/xai';
import { convertToModelMessages, streamText, UIMessage } from '@omni-stack/core';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const prompt = convertToModelMessages(messages);

  const result = streamText({
    model: xai('grok-beta'),
    prompt,
  });

  return result.toUIMessageStreamResponse();
}
