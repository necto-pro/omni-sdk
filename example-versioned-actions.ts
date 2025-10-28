// Example: Versioned Action Specifications
import { execute } from '@omni-stack/core';
import { BaseActionProvider, ActionCapability } from '@omni-stack/provider';

// Example: OpenAI Provider with multiple action versions
class OpenAIProvider extends BaseActionProvider {
  constructor() {
    super('openai', 'OpenAI', '1.0.0', 'OpenAI provider with versioned actions');
  }

  async initialize(): Promise<void> {
    // Register v1 image generation (basic)
    await this.registerImageGenerationV1();
    
    // Register v2 image generation (enhanced)
    await this.registerImageGenerationV2();
    
    // Register v3 image generation (latest with new features)
    await this.registerImageGenerationV3();
  }

  async getSupportedModels(): Promise<string[]> {
    return ['dall-e-2', 'dall-e-3'];
  }

  private async registerImageGenerationV1(): Promise<void> {
    const capability: ActionCapability = {
      actionType: 'openai.image.generate',
      specificationVersion: 'v1',
      name: 'Image Generation v1',
      description: 'Basic image generation with DALL-E',
      inputModalities: [
        {
          type: 'text',
          description: 'Text prompt',
          required: true,
          constraints: { maxSize: '1000 characters' }
        }
      ],
      outputModalities: [
        {
          type: 'image',
          description: 'Generated image',
          constraints: { formats: ['png'] }
        }
      ],
      parameters: [
        {
          name: 'n',
          type: 'number',
          description: 'Number of images',
          required: false,
          default: 1,
          constraints: { min: 1, max: 1 }
        }
      ],
      examples: [],
      versionInfo: {
        introduced: '2024-01-01',
        newFeatures: ['Basic text-to-image generation']
      }
    };

    this.registerAction(capability, {
      async execute(input: any, parameters: any) {
        return { images: [{ url: 'https://v1-generated-image.png' }] };
      }
    });
  }

  private async registerImageGenerationV2(): Promise<void> {
    const capability: ActionCapability = {
      actionType: 'openai.image.generate',
      specificationVersion: 'v2',
      name: 'Image Generation v2',
      description: 'Enhanced image generation with style options',
      inputModalities: [
        {
          type: 'text',
          description: 'Text prompt',
          required: true,
          constraints: { maxSize: '2000 characters' }
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
          constraints: { min: 1, max: 2 }
        },
        {
          name: 'style',
          type: 'string',
          description: 'Image style',
          required: false,
          default: 'natural',
          constraints: { enum: ['natural', 'vivid'] }
        }
      ],
      examples: [],
      versionInfo: {
        introduced: '2024-06-01',
        breakingChanges: ['Increased max input size', 'Added style parameter'],
        newFeatures: ['Style options', 'Multiple image generation', 'JPG support']
      }
    };

    this.registerAction(capability, {
      async execute(input: any, parameters: any) {
        return { images: [{ url: 'https://v2-generated-image.jpg' }] };
      }
    });
  }

  private async registerImageGenerationV3(): Promise<void> {
    const capability: ActionCapability = {
      actionType: 'openai.image.generate',
      specificationVersion: 'v3',
      name: 'Image Generation v3',
      description: 'Latest image generation with multi-modal input',
      inputModalities: [
        {
          type: 'text',
          description: 'Text prompt',
          required: true,
          constraints: { maxSize: '4000 characters' }
        },
        {
          type: 'image',
          description: 'Reference image',
          required: false,
          constraints: { formats: ['png', 'jpg', 'webp'] }
        }
      ],
      outputModalities: [
        {
          type: 'image',
          description: 'Generated image',
          constraints: { formats: ['png', 'jpg', 'webp'] }
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
        },
        {
          name: 'size',
          type: 'string',
          description: 'Image size',
          required: false,
          default: '1024x1024',
          constraints: { enum: ['1024x1024', '1024x1792', '1792x1024'] }
        },
        {
          name: 'quality',
          type: 'string',
          description: 'Image quality',
          required: false,
          default: 'standard',
          constraints: { enum: ['standard', 'hd'] }
        }
      ],
      examples: [],
      versionInfo: {
        introduced: '2024-12-01',
        breakingChanges: ['Changed default size', 'Added quality parameter'],
        newFeatures: ['Multi-modal input', 'HD quality', 'WebP support', 'Multiple sizes']
      }
    };

    this.registerAction(capability, {
      async execute(input: any, parameters: any) {
        return { images: [{ url: 'https://v3-generated-image.webp' }] };
      }
    });
  }
}

// Example usage
async function exampleVersionedActions() {
  const provider = new OpenAIProvider();
  await provider.initialize();

  // Execute with latest version (v3)
  const latestResult = await execute({
    type: 'openai.image.generate',
    model: { modelId: 'dall-e-3' } as any,
    input: 'A beautiful sunset',
    parameters: { quality: 'hd' }
  });

  // Execute with specific version (v1)
  const v1Result = await execute({
    type: 'openai.image.generate',
    model: { modelId: 'dall-e-2' } as any,
    input: 'A beautiful sunset',
    specificationVersion: 'v1'
  });

  // Execute with specific version (v2)
  const v2Result = await execute({
    type: 'openai.image.generate',
    model: { modelId: 'dall-e-3' } as any,
    input: 'A beautiful sunset',
    specificationVersion: 'v2',
    parameters: { style: 'vivid' }
  });

  console.log('Latest (v3):', latestResult);
  console.log('V1:', v1Result);
  console.log('V2:', v2Result);

  // Discover available versions
  const versions = await provider.getActionVersions('openai.image.generate');
  console.log('Available versions:', versions); // ['v1', 'v2', 'v3']

  const latestVersion = await provider.getLatestActionVersion('openai.image.generate');
  console.log('Latest version:', latestVersion); // 'v3'
}

// Run the example
exampleVersionedActions().catch(console.error);
