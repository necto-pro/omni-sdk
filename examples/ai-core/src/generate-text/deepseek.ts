import { deepseek } from '@omni-stack/deepseek';
import { generateText } from '@omni-stack/core';
import 'dotenv/config';

async function main() {
  const result = await generateText({
    model: deepseek('deepseek-chat'),
    prompt: 'Invent a new holiday and describe its traditions.',
  });

  console.log('Text:');
  console.log(result.text);
  console.log();

  console.log('Token usage:', result.usage);
  console.log('Finish reason:', result.finishReason);
}

main().catch(console.error);
