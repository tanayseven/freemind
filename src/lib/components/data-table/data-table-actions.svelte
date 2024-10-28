<script lang="ts">
  import {
    IconClipboardText,
    IconDots,
    IconPencil,
    IconToggleLeft,
    IconToggleRightFilled,
    IconTrashX,
  } from "@tabler/icons-svelte"
  import { toast } from "svelte-sonner"

  import { Button } from "../ui/button"
  import * as DropdownMenu from "../ui/dropdown-menu/index.js"

  export let website: string
  export let currentStatus: "Active" | "Inactive"
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
      <span class="sr-only">Open menu</span>
      <IconDots class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item
        on:click={() => {
          navigator.clipboard.writeText(website)
          toast(`Copied ${website} to clipboard`)
        }}
      >
        <IconClipboardText class="mr-2 h-4 w-4" />
        Copy website
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      {#if currentStatus === "Active"}
        <IconToggleRightFilled class="mr-2 h-4 w-4" />
        Deactivate
      {:else}
        <IconToggleLeft class="mr-2 h-4 w-4" />
        Activate
      {/if}
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      <IconTrashX class="mr-2 h-4 w-4" />
      Delete
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <IconPencil class="mr-2 h-4 w-4" />
      Edit
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
