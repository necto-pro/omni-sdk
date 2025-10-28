// Complete example showing the MCP-like provider architecture
import { execute, executeStream } from '@omni-stack/core';
import { globalProviderRegistry, BaseActionProvider, ActionCapability } from '@omni-stack/provider';

// Example: How to use the new architecture
async function exampleUsage() {
  // 1. Register providers (this would typically be done by provider packages)
  const openaiProvider = new OpenAIProvider();
  await globalProviderRegistry.registerProvider(openaiProvider);

  const anthropicProvider = new AnthropicProvider();
  await globalProviderRegistry.registerProvider(anthropicProvider);

  // 2. Discover available actions
  const allActions = await globalProviderRegistry.getAllAvailableActions();
  console.log('Available actions:', allActions.map(a => a.actionType));

  // 3. Check model compatibility
  const gpt4Actions = await globalProviderRegistry.getModelCompatibility('gpt-4o');
  console.log('GPT-4o supported actions:', gpt4Actions.map(c => c.supportedActions));

  // 4. Execute actions
  const imageResult = await execute({
    type: 'openai.image.generate',
    model: { modelId: 'dall-e-3', provider: 'openai' } as any,
    input: 'A beautiful sunset over mountains',
    parameters: { n: 1, size: '1024x1024' }
  });

  const textResult = await execute({
    type: 'anthropic.text.generate',
    model: { modelId: 'claude-3', provider: 'anthropic' } as any,
    input: 'Explain quantum computing',
    parameters: { max_tokens: 100 }
  });

  console.log('Image result:', imageResult);
  console.log('Text result:', textResult);

  // 5. Get provider status
  const status = await globalProviderRegistry.getOverallStatus();
  console.log('Provider status:', status);
}

// Example provider implementations
class OpenAIProvider extends BaseActionProvider {
  constructor() {
    super('openai', 'OpenAI', '1.0.0', 'OpenAI provider');
  }

  async initialize(): Promise<void> {
    // Register image generation
    const imageCapability: ActionCapability = {
      actionType: 'openai.image.generate',
      name: 'Image Generation',
      description: 'Generate images using DALL-E',
      inputModalities: [
        {
          type: 'text',
          description: 'Text prompt',
          required: true,
          constraints: { maxSize: '4000 characters' }
        }
      ],
      outputModalities: [
        {
          type: 'image',
          description: 'Generated image',
          constraints: { formats: ['png', 'jpg'] }
        }
      ],
      parameters: [
        {
          name: 'n',
          type: 'number',
          description: 'Number of images',
          required: false,
          default: 1,
          constraints: { min: 1, max: 4 }
        }
      ],
      examples: []
    };

    this.registerAction(imageCapability, {
      async execute(input: any, parameters: any) {
        return { images: [{ url: 'https://generated-image.jpg' }] };
      }
    });
  }

  async getSupportedModels(): Promise<string[]> {
    return ['dall-e-3', 'dall-e-2', 'gpt-4o'];
  }
}

class AnthropicProvider extends BaseActionProvider {
  constructor() {
    super('anthropic', 'Anthropic', '1.0.0', 'Anthropic provider');
  }

  async initialize(): Promise<void> {
    // Register text generation
    const textCapability: ActionCapability = {
      actionType: 'anthropic.text.generate',
      name: 'Text Generation',
      description: 'Generate text using Claude',
      inputModalities: [
        {
          type: 'text',
          description: 'Text prompt',
          required: true,
          constraints: { maxSize: '200k tokens' }
        }
      ],
      outputModalities: [
        {
          type: 'text',
          description: 'Generated text',
          constraints: { maxSize: '200k tokens' }
        }
      ],
      parameters: [
        {
          name: 'max_tokens',
          type: 'number',
          description: 'Maximum tokens',
          required: false,
          constraints: { min: 1, max: 4096 }
        }
      ],
      examples: []
    };

    this.registerAction(textCapability, {
      async execute(input: any, parameters: any) {
        return { text: 'Generated text response...' };
      }
    });
  }

  async getSupportedModels(): Promise<string[]> {
    return ['claude-3', 'claude-3-sonnet', 'claude-3-haiku'];
  }
}

// Run the example
exampleUsage().catch(console.error);
