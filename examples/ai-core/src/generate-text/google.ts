import { google } from '@omni-stack/google';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const result = await generateText({
    model: google('gemini-1.5-flash-002'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  const googleMetadata = result.providerMetadata?.google;

  console.log(result.text);
  console.log();
  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
  console.log('Safety info:', {
    promptFeedback: googleMetadata?.promptFeedback,
    safetyRatings: googleMetadata?.safetyRatings,
  });
}

main().catch(console.error);
