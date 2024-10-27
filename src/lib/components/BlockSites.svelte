<script lang="ts">
  import { IconSearch } from "@tabler/icons-svelte"

  import { Input } from "$lib/components/ui/input/index.js"
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js"
  import { Separator } from "$lib/components/ui/separator/index.js"
  import WebsiteListItem from "$lib/components/WebsiteListItem.svelte"

  import type { WebsiteBlockList } from "../settings"

  export let selectedWebsiteGroup = ""
  export let websiteGroups: Record<string, WebsiteBlockList>
  let searchQuery = ""
  const searchMatches = (searchQuery: string, website: string) => {
    return website.toLowerCase().includes(searchQuery.toLowerCase())
  }
</script>

<div class="flex flex-col">
  <label for="timer" class="text-lg"
    >Block Sites {#if selectedWebsiteGroup !== ""}
      in group: {selectedWebsiteGroup}{/if}</label
  >
  {#if selectedWebsiteGroup !== ""}
    <div class="flex items-center gap-4">
      <IconSearch class="flex flex-initial" />
      <Input class="flex" bind:value={searchQuery} />
    </div>
    <ScrollArea class="h-72 w-full rounded-md border">
      <div class="p-4">
        {#each websiteGroups[selectedWebsiteGroup].websites as website}
          {#if searchMatches(searchQuery, website.name)}
            <WebsiteListItem bind:website bind:selectedWebsiteGroup />
            <Separator class="my-2" />
          {/if}
        {/each}
      </div>
    </ScrollArea>
  {/if}
</div>
