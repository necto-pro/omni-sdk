import { google } from '@omni-stack/google';
import { streamText, convertToModelMessages } from '@omni-stack/core';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-exp'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
