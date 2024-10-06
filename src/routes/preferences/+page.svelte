<script lang="ts">
import {Separator} from "$lib/components/ui/separator";
import {loadSettings, saveSettings, type WebsiteBlockList} from "../../settings";
import Header from "$lib/components/Header.svelte";
import BlockGroups from "$lib/components/BlockGroups.svelte";
import BlockSites from "$lib/components/BlockSites.svelte";

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
                        <div class="grid grid-cols-[0.47fr_0.06fr_0.47fr]">
                                <BlockGroups
                                  bind:selectedWebsiteGroup={selectedWebsiteGroup}
                                  bind:websiteGroups={websiteGroups}
                                />
                                <span class="flex"></span>
                                <BlockSites
                                  bind:selectedWebsiteGroup={selectedWebsiteGroup}
                                  bind:websiteGroups={websiteGroups}
                                />
                        </div>
                </div>
        </div>
        {:catch error}
        <h3>Error loading website groups: {error}</h3>
        {/await}
</div>
