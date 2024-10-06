<script lang="ts">
        import {Separator} from "$lib/components/ui/separator";
import {ScrollArea} from "$lib/components/ui/scroll-area";
import {loadSettings, saveSettings, type WebsiteBlockList} from "../../settings";
        import Header from "$lib/components/Header.svelte";
import WebsiteListItem from "$lib/components/WebsiteListItem.svelte";
import WebsiteGroupItem from "$lib/components/WebsiteGroupItem.svelte";
import {Input} from "$lib/components/ui/input";
        import {Search} from "lucide-svelte";
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
                        <div class="grid grid-cols-[0.5fr_0.5fr]">
                                <BlockGroups
                                  bind:selectedWebsiteGroup={selectedWebsiteGroup}
                                  bind:websiteGroups={websiteGroups}
                                />
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
