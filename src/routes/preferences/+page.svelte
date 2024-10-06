<script lang="ts">
import {Button} from "$lib/components/ui/button";
import {Separator} from "$lib/components/ui/separator";
import {ScrollArea} from "$lib/components/ui/scroll-area";
import {loadSettings, saveSettings, type WebsiteBlockList} from "../../settings";
import {Checkbox} from "$lib/components/ui/checkbox";
import Header from "$lib/components/Header.svelte";
import WebsiteListItem from "$lib/components/WebsiteListItem.svelte";

let selectedWebsiteGroup = "";
let websiteGroups: Record<string, WebsiteBlockList>

const loadWebsiteGroups = async () => {
        console.log("loading website groups")
        const settings = await loadSettings()
        console.log(`website groups: ${JSON.stringify(settings.websiteBlockList)}`)
        websiteGroups = settings.websiteBlockList
        await saveSettings(settings)
}

</script>
<div class="container h-full p-0">
        {#await loadWebsiteGroups()}
        {:then _}
        <div class="container p-4 flex flex-col space-y-10">
                <Header hasBack />
                <div>
                        <h2 class="text-xl font-bold">Preferences</h2>
                        <Separator class="my-4" />
                        <div class="grid grid-cols-[0.5fr_0.5fr]">
                                <div class="flex flex-col">
                                        <label for="timer" class="text-lg">Block Group</label>
                                        <ScrollArea  class="h-72 w-full rounded-md border">
                                                <div class="p-4">
                                                        {#each Object.keys(websiteGroups) as websiteGroup}
                                                                <div class="text-sm flex flex-row items-center justify-center">
                                                                        {#if selectedWebsiteGroup === websiteGroup}
                                                                                <Button variant="link" class="w-4/5 flex" size="sm" disabled>
                                                                                        <span class:line-through={!websiteGroups[websiteGroup].enabled} class:text-secondary={!websiteGroups[websiteGroup].enabled}>
                                                                                        {websiteGroup}
                                                                                        </span>
                                                                                </Button>
                                                                                <Checkbox id="" class="flex" aria-labelledby="" bind:checked={websiteGroups[websiteGroup].enabled} />
                                                                        {:else}
                                                                                <Button variant="link" class="w-4/5 flex" size="sm" on:click={() => selectedWebsiteGroup = websiteGroup}>
                                                                                        <span class:line-through={!websiteGroups[websiteGroup].enabled} class:text-secondary={!websiteGroups[websiteGroup].enabled}>
                                                                                        {websiteGroup}
                                                                                        </span>
                                                                                </Button>
                                                                                <Checkbox id="" class="flex" aria-labelledby="" bind:checked={websiteGroups[websiteGroup].enabled} />
                                                                        {/if}
                                                                </div>
                                                                <Separator class="my-2" />
                                                        {/each}
                                                </div>
                                        </ScrollArea>
                                </div>
                                <div class="flex flex-col">
                                        <label for="timer" class="text-lg">Block Sites {#if selectedWebsiteGroup !== ''} in group: {selectedWebsiteGroup}{/if}</label>
                                        {#if selectedWebsiteGroup !== ''}
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
                        </div>
                </div>
        </div>
        {:catch error}
        <h3>Error loading website groups: {error}</h3>
        {/await}
</div>