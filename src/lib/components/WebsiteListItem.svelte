<script lang="ts">
  import {Checkbox} from "$lib/components/ui/checkbox/index.js";
  import {settingsStore, type Website} from "../../settings";

  export let website: Website
  export let selectedWebsiteGroup: string
  const updateWebsite = (website: Website) => {
    const websiteName = website.name
    const index = $settingsStore.websiteBlockList[selectedWebsiteGroup].websites.findIndex((website) => website.name === websiteName)
    $settingsStore.websiteBlockList[selectedWebsiteGroup].websites[index] = website
  }
</script>

<div class="text-sm flex flex-row items-center justify-center">
  {#if (website.enabled)}
  <span class="w-4/5 flex  justify-center" contenteditable>{website.name}</span>
  {:else}
  <span class="w-4/5 flex line-through text-muted-foreground justify-center" contenteditable>{website.name}</span>
  {/if}
  <Checkbox
    id=""
    class="flex"
    aria-labelledby=""
    bind:checked={website.enabled}
    on:click={() => updateWebsite(website)}
  />
</div>
