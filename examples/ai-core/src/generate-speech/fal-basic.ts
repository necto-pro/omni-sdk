import { fal } from '@omni-stack/fal';
import { experimental_generateSpeech as generateSpeech } from '@omni-stack/core';
import 'dotenv/config';
import { saveAudioFile } from '../lib/save-audio';

async function main() {
  const result = await generateSpeech({
    model: fal.speech('fal-ai/minimax/speech-02-hd'),
    text: 'Hello from the AI SDK via fal speech!',
    outputFormat: 'hex',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
}

main().catch(console.error);
