<script lang="ts">
import WebsiteListItem from "$lib/components/WebsiteListItem.svelte";
import {Separator} from "$lib/components/ui/separator/index.js";
import {Input} from "$lib/components/ui/input/index.js";
import {Search} from "lucide-svelte";
import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
import type {WebsiteBlockList} from "../../settings";

export let selectedWebsiteGroup = "";
export let websiteGroups: Record<string, WebsiteBlockList>;
</script>

<div class="flex flex-col">
  <label for="timer" class="text-lg">Block Sites {#if selectedWebsiteGroup !== ''} in group: {selectedWebsiteGroup}{/if}</label>
  {#if selectedWebsiteGroup !== ''}
    <div class="flex items-center gap-4">
      <Search class="flex flex-initial" />
      <Input class="flex" />
    </div>
    <ScrollArea  class="h-72 w-full rounded-md border">
      <div class="p-4">
        {#each websiteGroups[selectedWebsiteGroup].websites as website }
          <WebsiteListItem
            bind:website={website}
          />
          <Separator class="my-2" />
        {/each}
      </div>
    </ScrollArea>
  {/if}
</div>
