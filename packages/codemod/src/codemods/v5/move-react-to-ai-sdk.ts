import { createTransformer } from '../lib/create-transformer';

/**
 * Migrates from ai/react to @omni-stack/react:
 * - import { useChat } from 'ai/react' → import { useChat } from '@omni-stack/react'
 */
export default createTransformer((fileInfo, api, options, context) => {
  const { j, root } = context;

  // Transform imports from 'ai/react' to '@omni-stack/react'
  root
    .find(j.ImportDeclaration, {
      source: {
        value: 'ai/react',
      },
    })
    .forEach((path: any) => {
      path.node.source.value = '@omni-stack/react';
      context.hasChanges = true;
    });
});
