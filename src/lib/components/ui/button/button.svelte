<script lang="ts">
  import { Button as ButtonPrimitive } from "bits-ui"  // eslint-disable-line

  import { cn } from "$lib/utils.js"

  import { type Events, type Props, buttonVariants } from "./index.js"

  type $$Props = Props
  type $$Events = Events

  let className: $$Props["class"] = undefined

  export let builders: $$Props["builders"] = []
  export { className as class }
  export let size: $$Props["size"] = "default"
  export let variant: $$Props["variant"] = "default"
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ className, size, variant }))}
  type="button"
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</ButtonPrimitive.Root>
