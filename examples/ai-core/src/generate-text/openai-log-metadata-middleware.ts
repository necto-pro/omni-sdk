import { openai } from '@open-stack/openai';
import { LanguageModelV3Middleware } from '@open-stack/provider';
import { generateText, wrapLanguageModel } from 'ai';
import 'dotenv/config';

const logProviderMetadataMiddleware: LanguageModelV3Middleware = {
  transformParams: async ({ params }) => {
    console.log(
      'providerOptions: ' + JSON.stringify(params.providerOptions, null, 2),
    );
    return params;
  },
};

async function main() {
  const { text } = await generateText({
    model: wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: logProviderMetadataMiddleware,
    }),
    providerOptions: {
      myMiddleware: {
        example: 'value',
      },
    },
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  console.log(text);
}

main().catch(console.error);
