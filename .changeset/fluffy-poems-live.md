---
'ai': patch
'@open-stack/mcp': major
---

feat(ai): add OAuth for MCP clients + refactor to new package

This change replaces

```ts
import { experimental_createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';
```

with

```ts
import { experimental_createMCPClient } from '@open-stack/mcp';
import { Experimental_StdioMCPTransport } from '@open-stack/mcp/mcp-stdio';
```
