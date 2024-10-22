<script lang="ts">
  import { Separator } from "$lib/components/ui/separator"
  import { settingsStore } from "$lib/settings"
  import Header from "$lib/components/Header.svelte"
  import BlockGroups from "$lib/components/BlockGroups.svelte"
  import BlockSites from "$lib/components/BlockSites.svelte"
  import Footer from "$lib/components/Footer.svelte"

  let selectedWebsiteGroup = ""

  $: websiteGroups = $settingsStore.websiteBlockList
</script>

<div class="container h-full p-0">
  <div class="container flex flex-col space-y-10 p-4">
    <Header hasBack />
    <div>
      <h2 class="text-xl font-bold">Preferences</h2>
      <Separator class="my-4" />
      <div class="grid grid-cols-[0.47fr_0.06fr_0.47fr]">
        <BlockGroups bind:selectedWebsiteGroup bind:websiteGroups />
        <span class="flex"></span>
        <BlockSites bind:selectedWebsiteGroup bind:websiteGroups />
      </div>
    </div>
  </div>
  <Footer />
</div>
