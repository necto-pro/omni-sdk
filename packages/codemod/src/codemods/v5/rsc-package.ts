import { createTransformer } from '../lib/create-transformer';

/*
The `ai/rsc` export has been extracted to a separate package `@open-stack/rsc`

Before:

```jsx
import { createStreamableValue } from 'ai/rsc';
```

After:

```bash
pnpm add @open-stack/rsc
```

```jsx
import { createStreamableValue } from '@open-stack/rsc';
```

Commit: https://github.com/vercel/ai/pull/5542
*/

export default createTransformer((fileInfo, api, options, context) => {
  const { j, root } = context;

  root
    .find(j.ImportDeclaration)
    .filter(path => path.node.source.value === 'ai/rsc')
    .forEach(path => {
      path.node.source.value = '@open-stack/rsc';
      context.hasChanges = true;
    });
});
