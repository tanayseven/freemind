<script lang="ts">
  import { type Website, settingsStore } from "../settings"
  import { Checkbox } from "$lib/components/ui/checkbox/index.js"

  export let website: Website
  export let selectedWebsiteGroup: string
  const updateWebsite = (website: Website) => {
    const websiteName = website.name
    const index = $settingsStore.websiteBlockList[selectedWebsiteGroup].websites.findIndex(
      (website) => website.name === websiteName,
    )
    $settingsStore.websiteBlockList[selectedWebsiteGroup].websites[index] = website
  }
</script>

<div class="flex flex-row items-center justify-center text-sm">
  {#if website.enabled}
    <span class="flex w-4/5 justify-center" contenteditable>{website.name}</span>
  {:else}
    <span class="flex w-4/5 justify-center text-muted-foreground line-through" contenteditable>{website.name}</span>
  {/if}
  <Checkbox
    id=""
    class="flex"
    aria-labelledby=""
    bind:checked={website.enabled}
    on:click={() => updateWebsite(website)}
  />
</div>
