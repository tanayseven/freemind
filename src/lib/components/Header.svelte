<script lang="ts">
  import {Button} from "$lib/components/ui/button/index.js";
  import {ArrowBigLeft, Moon, Sun} from "lucide-svelte";
  import {toggleMode} from "mode-watcher";

  export let hasBack: boolean = false;
</script>
<div class="grid grid-cols-[0rem_1fr_0rem]">
    {#if hasBack}
        <Button variant="outline" class="flex content-center scale-100" size="icon" on:click={()=>window.history.back()}>
                <ArrowBigLeft class="h-6 w-6" />
                <span class="sr-only">Go back</span>
        </Button>
    {:else}
      <span></span>
    {/if}
        <h1 class="grid self-center text-4xl font-extrabold tracking-tight lg:text-5xl justify-center">Free Mind</h1>
        <Button class="flex place-self-end content-center" on:click={toggleMode} variant="outline" size="icon">
                <Sun
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
        </Button>
</div>