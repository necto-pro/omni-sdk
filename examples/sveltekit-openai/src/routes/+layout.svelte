<script lang="ts">
  import { createAIContext } from '@open-stack/svelte';
  import '../app.css';
  let { children } = $props();

  createAIContext();
</script>

{@render children()}
