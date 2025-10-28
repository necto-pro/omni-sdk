import 'dotenv/config';
import { openai } from '@omni-stack/openai';
import { streamText } from '@omni-stack/core';

async function main() {
  const result = streamText({
    model: openai('gpt-5-nano'),
    prompt: 'What color is the sky in one word?',
    providerOptions: {
      openai: {
        serviceTier: 'flex',
      },
    },
  });

  await result.consumeStream();
  const providerMetadata = await result.providerMetadata;

  console.log('Provider metadata:', providerMetadata);
  // Provider metadata: {
  //   openai: {
  //     responseId: '...',
  //     serviceTier: 'flex'
  //   }
  // }
}

main().catch(console.error);
