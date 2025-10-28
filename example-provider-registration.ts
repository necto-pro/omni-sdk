// Example of how a provider would register its actions
import { registerAction, ActionTransformer } from '@omni-stack/core';

// Example: OpenAI Provider registering image generation
const openaiImageGenerationTransformer: ActionTransformer = {
  transformInput(input: any) {
    // Transform user input to ActionV1Request format
    if (typeof input === 'string') {
      return {
        input: input,
        parameters: {}
      };
    } else if (Array.isArray(input)) {
      return {
        input: input,
        parameters: {}
      };
    }
    throw new Error('Invalid input format');
  },

  transformOutput(response: any) {
    // Transform ActionV1Response to user-friendly format
    return {
      images: response.images || [],
      usage: response.usage || {},
      warnings: response.warnings || []
    };
  },

  validateInput(input: any): boolean {
    // Provider-specific validation
    return typeof input === 'string' || Array.isArray(input);
  },

  validateOutput(output: any): boolean {
    // Provider-specific validation
    return output && typeof output === 'object';
  }
};

// Example: Anthropic Provider registering text generation
const anthropicTextGenerationTransformer: ActionTransformer = {
  transformInput(input: any) {
    return {
      input: input,
      parameters: {}
    };
  },

  transformOutput(response: any) {
    return {
      text: response.text || '',
      usage: response.usage || {},
      finishReason: response.finishReason || 'stop'
    };
  },

  validateInput(input: any): boolean {
    return typeof input === 'string';
  },

  validateOutput(output: any): boolean {
    return output && typeof output.text === 'string';
  }
};

// Register the actions
registerAction('openai.image.generate', openaiImageGenerationTransformer);
registerAction('anthropic.text.generate', anthropicTextGenerationTransformer);

// Now the execute function can handle these actions dynamically
// without the core package knowing about specific action types
