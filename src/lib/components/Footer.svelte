<script lang="ts">
  import type {TimeRemaining} from "$lib/focus";
  import {Label} from "$lib/components/ui/label";
  import * as Tooltip from "$lib/components/ui/tooltip"; // no-qa
  import {Badge} from "$lib/components/ui/badge";

  export let timeRemaining: TimeRemaining | null = null;
</script>
<div class="absolute bottom-0 flex w-full px-2 py-2 border-t-2 border-accent-foreground">
  {#if timeRemaining}
    <div class="flex items-center flex-initial">
      <Label for="time-remaining" class="text-m ml-2 mr-4">Time remaining:</Label>
      <span id="time-remaining" class="text-muted-foreground text-m w-5 text-center">{timeRemaining.minutes}</span>
      <Label for="time-remaining" class="text-m ml-2 mr-4">minutes</Label>
      <span id="time-remaining" class="text-muted-foreground text-m w-5 text-center">{timeRemaining.seconds}</span>
      <Label for="time-remaining" class="text-m ml-2 mr-4">seconds</Label>
    </div>
  {/if}
    <div class="grow"></div>
    <div class="flex items-center justify-end">
      <span class="text-muted-foreground text-m">
        Made with
        <Tooltip.Root>
        <Tooltip.Trigger class="hover:cursor-help">
          <Badge variant="outline">❤️</Badge>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>love</p>
        </Tooltip.Content>
        </Tooltip.Root>
        and
        <Tooltip.Root>
        <Tooltip.Trigger class="hover:cursor-help">
          <Badge variant="outline">😓</Badge>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>sweat</p>
        </Tooltip.Content>
        </Tooltip.Root>
        by
        <a href="https://github.com/tanayseven/" target="_blank" class="text-blue-500">Tanay</a></span>
    </div>
  </div>