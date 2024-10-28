<script lang="ts">
  import BlockSitesTable from "$lib/components/BlockSitesTable.svelte"
  import Footer from "$lib/components/Footer.svelte"
  import Header from "$lib/components/Header.svelte"
  import { Separator } from "$lib/components/ui/separator"
  import { settingsStore } from "$lib/settings"

  $: websiteGroups = $settingsStore.websiteBlockList
</script>

<div class="container h-full p-0">
  <div class="container flex flex-col space-y-10 p-4">
    <Header hasBack />
    <div>
      <h2 class="text-xl font-bold">Preferences</h2>
      <Separator class="my-4" />
      <BlockSitesTable data={websiteGroups} />
      <Separator class="my-4" />
    </div>
  </div>
  <Footer />
</div>
