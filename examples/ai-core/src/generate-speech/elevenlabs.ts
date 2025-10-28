import { elevenlabs } from '@omni-stack/elevenlabs';
import { experimental_generateSpeech as generateSpeech } from '@omni-stack/core';
import 'dotenv/config';
import { saveAudioFile } from '../lib/save-audio';

async function main() {
  const result = await generateSpeech({
    model: elevenlabs.speech('eleven_multilingual_v2'),
    text: 'Hello from the AI SDK with ElevenLabs!',
    voice: process.env.ELEVENLABS_VOICE_ID || 'your-voice-id-here',
  });

  console.log('Audio:', result.audio);
  console.log('Warnings:', result.warnings);
  console.log('Responses:', result.responses);
  console.log('Provider Metadata:', result.providerMetadata);

  await saveAudioFile(result.audio);
}

main().catch(console.error);
