import { createTransformer } from '../lib/create-transformer';

/*
The `ai/rsc` export has been extracted to a separate package `@omni-stack/rsc`

Before:

```jsx
import { createStreamableValue } from 'ai/rsc';
```

After:

```bash
pnpm add @omni-stack/rsc
```

```jsx
import { createStreamableValue } from '@omni-stack/rsc';
```

Commit: https://github.com/vercel/ai/pull/5542
*/

export default createTransformer((fileInfo, api, options, context) => {
  const { j, root } = context;

  root
    .find(j.ImportDeclaration)
    .filter(path => path.node.source.value === 'ai/rsc')
    .forEach(path => {
      path.node.source.value = '@omni-stack/rsc';
      context.hasChanges = true;
    });
});
