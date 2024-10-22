<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { settingsStore } from "../settings"

  export let websiteGroup: string
  export let selectedWebsiteGroup: string

  $: websiteGroups = $settingsStore.websiteBlockList
</script>

<div class="flex flex-row items-center justify-center text-sm">
  {#if selectedWebsiteGroup === websiteGroup}
    <Button variant="outline" class="flex w-4/5" size="sm" disabled>
      <span
        class:line-through={!websiteGroups[websiteGroup].enabled}
        class:text-muted-foreground={!websiteGroups[websiteGroup].enabled}
      >
        {websiteGroup}
      </span>
    </Button>
    <Checkbox
      id=""
      class="flex"
      aria-labelledby=""
      bind:checked={websiteGroups[websiteGroup].enabled}
      on:click={() => ($settingsStore.websiteBlockList = websiteGroups)}
    />
  {:else}
    <Button variant="link" class="flex w-4/5" size="sm" on:click={() => (selectedWebsiteGroup = websiteGroup)}>
      <span
        class:line-through={!websiteGroups[websiteGroup].enabled}
        class:text-muted-foreground={!websiteGroups[websiteGroup].enabled}
      >
        {websiteGroup}
      </span>
    </Button>
    <Checkbox
      id=""
      class="flex"
      aria-labelledby=""
      bind:checked={websiteGroups[websiteGroup].enabled}
      on:click={() => ($settingsStore.websiteBlockList = websiteGroups)}
    />
  {/if}
</div>
