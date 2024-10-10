<script lang="ts">

  import {invoke} from '@tauri-apps/api/tauri';
  import {Button} from "$lib/components/ui/button";
  import {Label} from "$lib/components/ui/label";
  import {Switch} from "$lib/components/ui/switch";
  import {Input} from "$lib/components/ui/input";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import {Badge} from "$lib/components/ui/badge";
  import {settingsStore} from "$lib/settings";
  import {goto} from "$app/navigation";
  import Header from "$lib/components/Header.svelte";
  import {Settings as SettingsIcon} from "lucide-svelte";
  import {areSitesBlocked, isFocusEnabled, startFocus, stopFocus} from "$lib/focus";

  let focusMode = false;
  const secondsInMinute = 60;
  let timerValue = 30;
  let isTimerRunning = false;
  let timeRemainingInSeconds = 0;


  type TimeRemaining = {
    minutes: number;
    seconds: number;
  }

  const timeRemaining: TimeRemaining = {
    minutes: 0,
    seconds: 0
  }

  const startTimer = async () => {
    isTimerRunning = true;
    timeRemainingInSeconds = timerValue * secondsInMinute;
    await startFocus();
    focusMode = await areSitesBlocked()
    const interval = setInterval(async () => {
      timeRemainingInSeconds -= 1;
      timeRemaining.minutes = Math.floor(timeRemainingInSeconds / secondsInMinute);
      timeRemaining.seconds = timeRemainingInSeconds % secondsInMinute;
      if (timeRemainingInSeconds <= 0) {
        clearInterval(interval);
        await stopFocus();
        isTimerRunning = false;
      }
    }, 1000);
  }

  const toggleFocus = async () => {
    console.log("Toggling focus time")
    try {
      if (await isFocusEnabled()) {
        await stopFocus();
      } else {
        await startFocus();
      }
    } catch (error) {
      console.error('Error reading hosts file:', error);
    }
  }

  const isRoot = async () => {
    try {
      console.log("Checking if root...")
      const isElevated = await invoke('is_elevated');
      console.log("Is elevated: ", isElevated)
      return isElevated as boolean;
    } catch (error) {
      console.error('Error checking elevated privileges:', error);
      return false;
    }
  };

</script>

<div class="container h-full p-0">
  <div class="container p-4 flex flex-col space-y-10">
    <Header />
    {#await isRoot()}
      <div class="flex justify-center">
        <h3 class="text-yellow-700">Checking root privileges...</h3>
      </div>
    {:then isRoot}
      {#if !isRoot}
        <div class="flex justify-center text-red-700">
          <h3>Root privileges are not enabled, this app will not work, please restart as root!</h3>
        </div>
      {/if}
      <div class="flex items-center justify-center space-x-2">
        <Switch id="focus-mode" on:click={toggleFocus} disabled={!isRoot} bind:checked={focusMode} />
        <Label class="justify-center text-xl" for="focus-mode">Focus Mode</Label>
      </div>
    {:catch error}
      <h3>Error checking elevated privileges: {error}</h3>
    {/await}
    <div class="flex items-center justify-center">
      <Label for="till-date" class="text-xl mr-4">Focus for:</Label>
      <Input id="till-date" type="number" bind:value={$settingsStore.timerValue} class="w-20 py-6 text-xl" disabled={isTimerRunning} />
      <Label for="till-date" class="text-xl ml-2 mr-4">minutes</Label>
    </div>
    <div class="flex items-center justify-center">
      <Button class="text-xl" variant="outline" on:click={startTimer} disabled={isTimerRunning}>Start Timer</Button>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <Button variant="outline" class="text-xl" on:click={()=>goto('/preferences')}>
        <SettingsIcon class="mr-2 h-6 w-6" />
        Preferences
      </Button>
    </div>
  </div>
  <div class="absolute bottom-0 flex w-full px-2 py-2">
    <div class="flex items-center flex-initial">
      <Label for="time-remaining" class="text-m ml-2 mr-4">Time remaining:</Label>
      <span id="time-remaining" class="text-muted-foreground text-m w-5 text-center">{timeRemaining.minutes}</span>
      <Label for="time-remaining" class="text-m ml-2 mr-4">minutes</Label>
      <span id="time-remaining" class="text-muted-foreground text-m w-5 text-center">{timeRemaining.seconds}</span>
      <Label for="time-remaining" class="text-m ml-2 mr-4">seconds</Label>
    </div>
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
</div>

<style>

</style>
