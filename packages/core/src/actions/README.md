# Action-Centric Architecture

This directory contains the new action-centric architecture for the AI SDK. This approach provides a unified, extensible way to interact with AI models while maintaining full backward compatibility.

## Key Concepts

### Actions
Actions are specific operations that can be performed by AI models, such as:
- `image.generate` - Generate images from text prompts
- `text.generate` - Generate text content
- `audio.transcribe` - Transcribe audio to text
- `video.generate` - Generate videos from prompts

### ActionV1 Specification
The `ActionV1` interface provides a unified way for providers to implement different actions:

```typescript
interface ActionV1<REQUEST, RESPONSE> {
  readonly specificationVersion: 'v1';
  readonly provider: string;
  doAction(options: { action: REQUEST; /* ... */ }): PromiseLike<RESPONSE>;
}
```

## Usage

### Using the New Action-Centric API

```typescript
import { execute } from '@omni-stack/core';
import { ActionV1 } from '@omni-stack/provider';

// With a new ActionV1-compatible model
const result = await execute(model, {
  type: 'image.generate',
  model: 'dall-e-3',
  prompt: 'A beautiful sunset over mountains',
  n: 1,
  size: '1024x1024'
});
```

### Backward Compatibility

The existing `generateImage` function continues to work exactly as before:

```typescript
import { generateImage } from '@omni-stack/core';

// This still works with both v3 and ActionV1 models
const result = await generateImage({
  model: imageModel,
  prompt: 'A beautiful sunset over mountains',
  n: 1,
  size: '1024x1024'
});
```

## Benefits

1. **Unified Interface**: All actions go through the same `doAction` method
2. **Extensibility**: Easy to add new actions without changing core interfaces
3. **Type Safety**: Strong typing for each action's request and response
4. **Backward Compatibility**: Existing code continues to work unchanged
5. **Future-Proof**: Aligned with modern AI API design patterns

## Migration Path

1. **Phase 1** (Current): ActionV1 specification is available alongside v3
2. **Phase 2**: New providers implement ActionV1 with v3 compatibility layer
3. **Phase 3**: New `execute()` function provides action-centric API
4. **Phase 4**: Gradual migration of existing functions to use actions internally
5. **Phase 5**: Deprecation of v3 interfaces (far future)

