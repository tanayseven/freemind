<script lang="ts">
import {Button} from "$lib/components/ui/button";
import {goto} from "$app/navigation";
import {ArrowBigLeft, Moon, Sun} from "lucide-svelte";
import {toggleMode} from "mode-watcher";
import {Separator} from "$lib/components/ui/separator";
import {ScrollArea} from "$lib/components/ui/scroll-area";
import {loadSettings, saveSettings, type Website} from "../../settings";
import {Checkbox} from "$lib/components/ui/checkbox";
import Header from "$lib/components/Header.svelte";

let selectedWebsiteGroup = "";
let websiteGroups: Record<string, Website[]>

const loadWebsiteGroups = async () => {
        console.log("loading website groups")
        const settings = await loadSettings()
        await saveSettings(settings)
        websiteGroups = settings.websiteBlockList
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
                                                                                <Button variant="ghost" class="w-4/5 flex" size="sm" disabled>
                                                                                        {websiteGroup}
                                                                                </Button>
                                                                                <Checkbox id="" class="flex" aria-labelledby="" />
                                                                        {:else}
                                                                                <Button variant="ghost" class="w-4/5 flex" size="sm" on:click={() => selectedWebsiteGroup = websiteGroup}>
                                                                                        {websiteGroup}
                                                                                </Button>
                                                                                <Checkbox id="" class="flex" aria-labelledby="" />
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
                                                        {#each websiteGroups[selectedWebsiteGroup] as website}
                                                                <div class="text-sm flex flex-row items-center justify-center">
                                                                        <Button variant="ghost" class="w-4/5 flex line-through text-accent" size="sm">{website.name}</Button>
                                                                        <Checkbox id="" class="flex" aria-labelledby="" bind:checked={website.enabled} />
                                                                </div>
                                                                <Separator class="my-2" />
                                                        {/each}
                                                </div>
                                        </ScrollArea>
                                        {/if}
                                </div>
                        </div>
                </div>
        </div>
        {/await}
</div>