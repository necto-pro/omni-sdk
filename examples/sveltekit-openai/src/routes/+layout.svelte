<script lang="ts">
  import { createAIContext } from '@omni-stack/svelte';
  import '../app.css';
  let { children } = $props();

  createAIContext();
</script>

{@render children()}
