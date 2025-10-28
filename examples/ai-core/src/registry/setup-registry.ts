import { anthropic } from '@open-stack/anthropic';
import { elevenlabs } from '@open-stack/elevenlabs';
import { fal } from '@open-stack/fal';
import { groq } from '@open-stack/groq';
import { luma } from '@open-stack/luma';
import { mistral } from '@open-stack/mistral';
import { openai } from '@open-stack/openai';
import { replicate } from '@open-stack/replicate';
import { xai } from '@open-stack/xai';
import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from 'ai';
import 'dotenv/config';

// custom provider with alias names:
const myAnthropic = customProvider({
  languageModels: {
    opus: anthropic('claude-3-opus-20240229'),
    sonnet: anthropic('claude-3-5-sonnet-20240620'),
    haiku: anthropic('claude-3-haiku-20240307'),
  },
  fallbackProvider: anthropic,
});

// custom provider with different model settings:
const myOpenAI = customProvider({
  languageModels: {
    // replacement model with custom provider options:
    'gpt-4': wrapLanguageModel({
      model: openai('gpt-4'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
    // alias model with custom provider options:
    'gpt-4o-high-reasoning': wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
  },
  fallbackProvider: openai,
});

export const registry = createProviderRegistry({
  mistral,
  anthropic: myAnthropic,
  openai: myOpenAI,
  xai,
  groq,
  elevenlabs,
});

registry.languageModel('anthropic:haiku');

const registryWithCustomSeparator = createProviderRegistry(
  {
    mistral,
    anthropic: myAnthropic,
    openai: myOpenAI,
    xai,
    groq,
    elevenlabs,
  },
  { separator: ' > ' },
);

registryWithCustomSeparator.languageModel('anthropic > haiku');

export const myImageModels = customProvider({
  imageModels: {
    recraft: fal.imageModel('recraft-v3'),
    photon: luma.imageModel('photon-flash-1'),
    flux: replicate.imageModel('black-forest-labs/flux-schnell'),
  },
});
