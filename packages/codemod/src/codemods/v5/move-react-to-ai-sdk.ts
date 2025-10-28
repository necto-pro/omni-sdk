import { createTransformer } from '../lib/create-transformer';

/**
 * Migrates from ai/react to @open-stack/react:
 * - import { useChat } from 'ai/react' → import { useChat } from '@open-stack/react'
 */
export default createTransformer((fileInfo, api, options, context) => {
  const { j, root } = context;

  // Transform imports from 'ai/react' to '@open-stack/react'
  root
    .find(j.ImportDeclaration, {
      source: {
        value: 'ai/react',
      },
    })
    .forEach((path: any) => {
      path.node.source.value = '@open-stack/react';
      context.hasChanges = true;
    });
});
