<script lang="ts">
  import { type Variant, badgeVariants } from "./index.js"
  import { cn } from "$lib/utils.js"

  let className: string | undefined | null = undefined
  export let href: string | undefined = undefined
  export { className as class }
  export let variant: Variant = "default"
</script>

<svelte:element this={href ? "a" : "span"} {href} class={cn(badgeVariants({ className, variant }))} {...$$restProps}>
  <slot />
</svelte:element>
