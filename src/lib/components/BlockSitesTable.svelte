<script lang="ts">
  import { IconArrowsUpDown, IconChevronDown } from "@tabler/icons-svelte"
  import { readable } from "svelte/store"
  import { createRender, createTable, Render, Subscribe } from "svelte-headless-table"
  import {
    addHiddenColumns,
    addPagination,
    addSelectedRows,
    addSortBy,
    addTableFilter,
  } from "svelte-headless-table/plugins"

  import StatusBadge from "$lib/components/StatusBadge.svelte"
  import { Button } from "$lib/components/ui/button"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js"
  import { Input } from "$lib/components/ui/input"
  import * as Table from "$lib/components/ui/table"
  import type { WebsiteEntry } from "$lib/settings"
  import { cn } from "$lib/utils.js"

  import Actions from "./data-table/data-table-actions.svelte"
  import DataTableCheckbox from "./data-table/data-table-checkbox.svelte"

  export let data: WebsiteEntry[] = []

  const table = createTable(readable(data), {
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
    hide: addHiddenColumns(),
    page: addPagination(),
    select: addSelectedRows(),
    sort: addSortBy({ disableMultiSort: true }),
  })

  type Status = "Active" | "Inactive"

  function stringStatus(value: boolean): Status {
    return value ? "Active" : "Inactive"
  }

  const columns = table.createColumns([
    table.column({
      accessor: ({ website }) => `${website}_selected`,
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select
        const { isSelected } = getRowState(row)

        return createRender(DataTableCheckbox, {
          checked: isSelected,
        })
      },
      header: (_, { pluginStates }) => {
        const { allPageRowsSelected } = pluginStates.select
        return createRender(DataTableCheckbox, {
          checked: allPageRowsSelected,
        })
      },
      plugins: {
        filter: {
          exclude: true,
        },
        sort: {
          disable: true,
        },
      },
    }),
    table.column({
      accessor: (entry) => stringStatus(entry.enabled),
      cell: ({ value }) => {
        console.log(`entry ${JSON.stringify(value)}`)
        return createRender(StatusBadge, { status: value })
      },
      header: "Status",
      plugins: { filter: { exclude: true } },
    }),
    table.column({
      accessor: "website",
      cell: ({ value }) => value.toLowerCase(),
      header: "Website",
      plugins: {
        filter: {
          getFilterValue(value) {
            return value.toLowerCase()
          },
        },
      },
    }),
    table.column({
      accessor: "category",
      cell: ({ value }) => value,
      header: "Category",
      plugins: {
        filter: {
          getFilterValue(value) {
            return value.toLowerCase()
          },
        },
      },
    }),
    table.column({
      accessor: (entry) => entry,
      cell: ({ value }) => {
        return createRender(Actions, { currentStatus: stringStatus(value.enabled), website: value.website })
      },
      header: "",
    }),
  ])

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, flatColumns, pluginStates, rows } =
    table.createViewModel(columns)

  const { sortKeys } = pluginStates.sort

  const { hiddenColumnIds } = pluginStates.hide
  const ids = flatColumns.map((c) => c.id)
  let hideForId = Object.fromEntries(ids.map((id) => [id, true]))

  $: $hiddenColumnIds = Object.entries(hideForId)
    .filter(([, hide]) => !hide)
    .map(([id]) => id)

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page
  const { filterValue } = pluginStates.filter

  const { selectedDataIds } = pluginStates.select

  const hideableCols = ["status", "category", "website"]
</script>

<div class="w-full">
  <div class="flex items-center py-4">
    <Input class="max-w-sm" placeholder="Filter emails..." type="text" bind:value={$filterValue} />
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" class="ml-auto" builders={[builder]}>
          Columns <IconChevronDown class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {#each flatColumns as col}
          {#if hideableCols.includes(col.id)}
            <DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
              {col.header}
            </DropdownMenu.CheckboxItem>
          {/if}
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                  <Table.Head {...attrs} class={cn("[&:has([role=checkbox])]:pl-3")}>
                    {#if cell.id === "category"}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <IconArrowsUpDown
                          class={cn($sortKeys[0]?.id === cell.id && "text-foreground", "ml-2 h-4 w-4")}
                        />
                      </Button>
                    {:else if cell.id === "website"}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <IconArrowsUpDown
                          class={cn($sortKeys[0]?.id === cell.id && "text-foreground", "ml-2 h-4 w-4")}
                        />
                      </Button>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && "selected"}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
                    {#if cell.id === "amount"}
                      <div class="text-right font-medium">
                        <Render of={cell.render()} />
                      </div>
                    {:else if cell.id === "status"}
                      <div class="capitalize">
                        <Render of={cell.render()} />
                      </div>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="flex-1 text-sm text-muted-foreground">
      {Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
    </div>
    <Button variant="outline" size="sm" on:click={() => ($pageIndex = $pageIndex - 1)} disabled={!$hasPreviousPage}
      >Previous</Button
    >
    <Button variant="outline" size="sm" disabled={!$hasNextPage} on:click={() => ($pageIndex = $pageIndex + 1)}
      >Next</Button
    >
  </div>
</div>
