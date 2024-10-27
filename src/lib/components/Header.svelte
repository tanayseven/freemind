<script lang="ts">
  import { IconArrowLeft, IconMoon, IconSun } from "@tabler/icons-svelte"
  import { Button } from "$lib/components/ui/button/index.js"
  import { toggleMode } from "mode-watcher"

  export let hasBack: boolean = false
</script>

<div class="grid grid-cols-[0rem_1fr_0rem]">
  {#if hasBack}
    <Button variant="outline" class="flex scale-100 content-center" size="icon" on:click={() => window.history.back()}>
      <IconArrowLeft class="h-6 w-6" />
      <span class="sr-only">Go back</span>
    </Button>
  {:else}
    <span></span>
  {/if}
  <h1 class="grid justify-center self-center text-4xl font-extrabold tracking-tight lg:text-5xl">Free Mind</h1>
  <Button class="flex content-center place-self-end" on:click={toggleMode} variant="outline" size="icon">
    <IconSun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <IconMoon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</div>
