import { cohere } from '@omni-stack/cohere';
import { convertToModelMessages, streamText, UIMessage } from '@omni-stack/core';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const prompt = convertToModelMessages(messages);

  const result = streamText({
    model: cohere('command-r-plus'),
    prompt,
  });

  return result.toUIMessageStreamResponse();
}
