// Example usage of the new execute interface
import { execute, executeStream } from '@omni-stack/core';
import { ActionV1 } from '@omni-stack/provider';

// Mock model for demonstration
const mockModel: ActionV1 = {
  specificationVersion: 'v1',
  provider: 'mock',
  modelId: 'gpt-image-1',
  async doAction({ request }) {
    return {
      id: 'mock-response-id',
      object: 'response' as const,
      created_at: Date.now(),
      status: 'completed' as const,
      error: null,
      incomplete_details: null,
      output: [{
        images: [{
          url: 'https://example.com/generated-image.jpg'
        }],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 0,
          total_tokens: 10
        }
      }],
      usage: {
        input_tokens: 10,
        output_tokens: 0,
        total_tokens: 10
      },
      parallel_tool_calls: false,
      previous_response_id: null,
      store: false,
      temperature: 0.7,
      tool_choice: 'auto',
      tools: [],
      top_p: 1,
      truncation: null,
      user: null,
      metadata: {},
      model: 'gpt-image-1',
      instructions: null,
      max_output_tokens: null,
      reasoning: null,
      text: {
        format: { type: 'text' as const }
      }
    };
  }
};

// Example 1: Simple string input
async function example1() {
  const result = await execute({
    type: 'image.generate',
    model: mockModel,
    input: 'Create a beautiful image of a cat',
    parameters: {
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    }
  });
  
  console.log('Example 1 result:', result);
}

// Example 2: Multi-modal input with InputItem array
async function example2() {
  const result = await execute({
    type: 'image.generate',
    model: mockModel,
    input: [{
      type: 'text',
      text: 'Create a beautiful image of a cat',
    }, {
      type: 'image',
      image_url: {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/WW2_Spanish_official_passport.jpg/1498px-WW2_Spanish_official_passport.jpg'
      }
    }],
    parameters: {
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    }
  });
  
  console.log('Example 2 result:', result);
}

// Example 3: Streaming
async function example3() {
  console.log('Streaming example:');
  for await (const chunk of executeStream({
    type: 'image.generate',
    model: mockModel,
    input: 'Create a beautiful image of a cat',
    parameters: {
      n: 1,
      size: '1024x1024',
    }
  })) {
    console.log('Stream chunk:', chunk);
  }
}

// Run examples
example1().then(() => example2()).then(() => example3());
