<script lang="ts">
  import {Separator} from "$lib/components/ui/separator/index.js";
  import {Input} from "$lib/components/ui/input/index.js";
  import WebsiteGroupItem from "$lib/components/WebsiteGroupItem.svelte";
  import {Search} from "lucide-svelte";
  import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
  import type {WebsiteBlockList} from "../settings";

  export let selectedWebsiteGroup = "";
  export let websiteGroups: Record<string, WebsiteBlockList>;
  let searchQuery = ""
  const searchMatches = (searchQuery:string, websiteGroup: string) => {
    return websiteGroup.toLowerCase().includes(searchQuery.toLowerCase())
  }
</script>

<div class="flex flex-col">
  <label for="timer" class="text-lg">Block Group</label>
  <div class="flex items-center gap-4">
    <Search class="flex flex-initial" />
    <Input class="flex" bind:value={searchQuery} />
  </div>
  <ScrollArea  class="h-72 w-full rounded-md border">
    <div class="p-4">
      {#each Object.keys(websiteGroups) as websiteGroup}
        {#if searchMatches(searchQuery, websiteGroup)}
        <WebsiteGroupItem
          bind:websiteGroup={websiteGroup}
          bind:selectedWebsiteGroup={selectedWebsiteGroup}
        />
        <Separator class="my-2" />
        {/if}
      {/each}
    </div>
  </ScrollArea>
</div>
