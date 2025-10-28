---
'ai': patch
'@omni-stack/mcp': major
---

feat(ai): add OAuth for MCP clients + refactor to new package

This change replaces

```ts
import { experimental_createMCPClient } from '@omni-stack/core';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';
```

with

```ts
import { experimental_createMCPClient } from '@omni-stack/mcp';
import { Experimental_StdioMCPTransport } from '@omni-stack/mcp/mcp-stdio';
```
