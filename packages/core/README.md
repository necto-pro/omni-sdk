![hero illustration](./assets/hero.gif)

# Omni SDK Core

> **Note**: This is a fork of the [Vercel AI SDK](https://github.com/vercel/ai) with additional features and enhancements. We maintain full compatibility with the original API while extending it with new capabilities.

The Omni SDK is a TypeScript toolkit designed to help you build AI-powered applications and agents using popular frameworks like Next.js, React, Svelte, Vue and runtimes like Node.js.

To learn more about how to use the Omni SDK, check out our [API Reference](https://omni-sdk.dev/docs/reference) and [Documentation](https://omni-sdk.dev/docs).

## Installation

You will need Node.js 18+ and npm (or another package manager) installed on your local development machine.

```shell
npm install @omni-stack/core
```

## Unified Provider Architecture

The Omni SDK provides a unified API to interact with model providers like OpenAI, Anthropic, Google, and more.

```shell
npm install @omni-stack/openai @omni-stack/anthropic @omni-stack/google
```

Alternatively you can use the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway).

## Usage

### Generating Text

```ts
import { generateText } from '@omni-stack/core';

const { text } = await generateText({
  model: 'openai/gpt-5', // use Vercel AI Gateway
  prompt: 'What is an agent?',
});
```

```ts
import { generateText } from '@omni-stack/core';
import { openai } from '@omni-stack/openai';

const { text } = await generateText({
  model: openai('gpt-5'), // use OpenAI Responses API
  prompt: 'What is an agent?',
});
```

### Generating Structured Data

```ts
import { generateObject } from '@omni-stack/core';
import { z } from 'zod';

const { object } = await generateObject({
  model: 'openai/gpt-4.1',
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

### Agents

```ts
import { ToolLoopAgent } from '@omni-stack/core';

const sandboxAgent = new ToolLoopAgent({
  model: 'openai/gpt-5-codex',
  system: 'You are an agent with access to a shell environment.',
  tools: {
    local_shell: openai.tools.localShell({
      execute: async ({ action }) => {
        const [cmd, ...args] = action.command;
        const sandbox = await getSandbox(); // Vercel Sandbox
        const command = await sandbox.runCommand({ cmd, args });
        return { output: await command.stdout() };
      },
    }),
  },
});
```

### UI Integration

The Omni SDK UI module provides a set of hooks that help you build chatbots and generative user interfaces. These hooks are framework agnostic, so they can be used in Next.js, React, Svelte, and Vue.

You need to install the package for your framework, e.g.:

```shell
npm install @omni-stack/react
```

#### Agent @/agent/image-generation-agent.ts

```ts
import { openai } from '@omni-stack/openai';
import { ToolLoopAgent, InferAgentUIMessage } from '@omni-stack/core';

export const imageGenerationAgent = new ToolLoopAgent({
  model: openai('gpt-5'),
  tools: {
    image_generation: openai.tools.imageGeneration({
      partialImages: 3,
    }),
  },
});

export type ImageGenerationAgentMessage = InferAgentUIMessage<
  typeof imageGenerationAgent
>;
```

#### Route (Next.js App Router) @/app/api/chat/route.ts

```tsx
import { imageGenerationAgent } from '@/agent/image-generation-agent';
import { createAgentUIStreamResponse } from '@omni-stack/core';

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createAgentUIStreamResponse({
    agent: imageGenerationAgent,
    messages,
  });
}
```

#### UI Component for Tool @/component/image-generation-view.tsx

```tsx
import { openai } from '@omni-stack/openai';
import { UIToolInvocation } from '@omni-stack/core';

export default function ImageGenerationView({
  invocation,
}: {
  invocation: UIToolInvocation<ReturnType<typeof openai.tools.imageGeneration>>;
}) {
  switch (invocation.state) {
    case 'input-available':
      return <div>Generating image...</div>;
    case 'output-available':
      return <img src={`data:image/png;base64,${invocation.output.result}`} />;
  }
}
```

#### Page @/app/page.tsx

```tsx
'use client';

import { ImageGenerationAgentMessage } from '@/agent/image-generation-agent';
import ImageGenerationView from '@/component/image-generation-view';
import { useChat } from '@omni-stack/react';

export default function Page() {
  const { messages, status, sendMessage } =
    useChat<ImageGenerationAgentMessage>();

  const [input, setInput] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <div key={index}>{part.text}</div>;
              case 'tool-image_generation':
                return <ImageGenerationView key={index} invocation={part} />;
            }
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={status !== 'ready'}
        />
      </form>
    </div>
  );
}
```

## Templates

We've built templates that include Omni SDK integrations for different use cases, providers, and frameworks. You can use these templates to get started with your AI-powered application.

## Community

The Omni SDK community can be found on [GitHub Discussions](https://github.com/omni-stack/sdk/discussions) where you can ask questions, voice ideas, and share your projects with other people.

## Contributing

Contributions to the Omni SDK are welcome and highly appreciated. However, before you jump right into it, we would like you to review our [Contribution Guidelines](https://github.com/omni-stack/sdk/blob/main/CONTRIBUTING.md) to make sure you have smooth experience contributing to Omni SDK.

## Authors

This library is a fork of the [Vercel AI SDK](https://github.com/vercel/ai) created by [Vercel](https://vercel.com) and [Next.js](https://nextjs.org) team members, with contributions from the [Open Source Community](https://github.com/vercel/ai/graphs/contributors).

The Omni SDK extends the original AI SDK with additional features and is maintained by the Omni Stack team.
