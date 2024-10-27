<script lang="ts">
  import { cn } from "$lib/utils.js"

  import { badgeVariants, type Variant } from "./index.js"

  let className: string | undefined | null = undefined
  export let href: string | undefined = undefined
  export { className as class }
  export let variant: Variant = "default"
</script>

<svelte:element this={href ? "a" : "span"} {href} class={cn(badgeVariants({ className, variant }))} {...$$restProps}>
  <slot />
</svelte:element>
