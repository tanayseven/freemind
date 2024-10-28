<script lang="ts">
  import { IconSettings } from "@tabler/icons-svelte"
  import { invoke } from "@tauri-apps/api/tauri"
  import { onMount } from "svelte"

  import { goto } from "$app/navigation"
  import Footer from "$lib/components/Footer.svelte"
  import Header from "$lib/components/Header.svelte"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { Label } from "$lib/components/ui/label"
  import { Progress } from "$lib/components/ui/progress"
  import { Switch } from "$lib/components/ui/switch"
  import { areSitesBlocked, isFocusEnabled, startFocus, stopFocus, type TimeRemaining } from "$lib/focus"
  import { settingsStore } from "$lib/settings"

  let focusMode = false
  const secondsInMinute = 60
  let timerValue = 30
  let isTimerRunning = false
  let timeRemainingInSeconds = 0

  onMount(() => {
    setInterval(() => {
      areSitesBlocked().then((enabled) => {
        focusMode = enabled
      })
    }, 100)
  })

  const timeRemaining: TimeRemaining = {
    minutes: 0,
    seconds: 0,
  }

  const startTimer = async () => {
    isTimerRunning = true
    timeRemainingInSeconds = timerValue * secondsInMinute
    await startFocus()
    focusMode = await areSitesBlocked()
    const interval = setInterval(async () => {
      timeRemainingInSeconds -= 1
      timeRemaining.minutes = Math.floor(timeRemainingInSeconds / secondsInMinute)
      timeRemaining.seconds = timeRemainingInSeconds % secondsInMinute
      if (timeRemainingInSeconds <= 0) {
        clearInterval(interval)
        await stopFocus()
        isTimerRunning = false
      }
    }, 1000)
  }

  const waitingTimeoutInSeconds = 15
  const millisecondsInSecond = 1000

  let showStoppingOverlay = false
  let showOverlayTimeRemaining: number = 0
  let stopFocusTimeout: NodeJS.Timeout = setTimeout(() => {}, 0)
  let stopFocusIntervalCounter: NodeJS.Timeout = setInterval(() => {}, 0)

  window.addEventListener("blur", async () => {
    if (focusMode) {
      showStoppingOverlay = false
      clearInterval(stopFocusTimeout)
      clearInterval(stopFocusIntervalCounter)
    }
  })

  const toggleFocus = async () => {
    try {
      if (await isFocusEnabled()) {
        showStoppingOverlay = true
        showOverlayTimeRemaining = waitingTimeoutInSeconds * millisecondsInSecond
        stopFocusIntervalCounter = setInterval(() => {
          showOverlayTimeRemaining -= 100
        }, 100)
        stopFocusTimeout = setTimeout(async () => {
          showStoppingOverlay = false
          await stopFocus()
          clearInterval(stopFocusTimeout)
          clearInterval(stopFocusIntervalCounter)
        }, waitingTimeoutInSeconds * millisecondsInSecond)
      } else {
        await startFocus()
      }
    } catch (error) {
      console.error("Error reading hosts file:", error)
    }
  }

  const isRoot = async (): Promise<boolean> => {
    try {
      return (await invoke("is_elevated")) as boolean
    } catch (error) {
      console.error("Error reading hosts file:", error)
      return false
    }
  }

  const continueFocus = async () => {
    showStoppingOverlay = false
    clearTimeout(stopFocusTimeout)
    clearInterval(stopFocusIntervalCounter)
    await startFocus()
  }
</script>

<div class="container h-full p-0">
  {#if showStoppingOverlay && focusMode}
    <div class="absolute flex h-full w-full flex-col gap-y-10 backdrop-blur-xl">
      <h2 class="mt-10 flex w-full justify-center text-center text-5xl">Ending Focus Mode?</h2>
      <h3 class="flex w-full justify-center text-center text-4xl">Take a few deep breaths and think</h3>
      <h3 class="flex w-full justify-center text-center text-4xl">Are you sure you want to stop focus time?</h3>
      <h3 class="flex w-full justify-center text-center text-4xl">
        <Progress value={Math.ceil(showOverlayTimeRemaining)} max={15000} class="w-[60%]" />
      </h3>
      <div class="flex w-full justify-center">
        <Button variant="outline" class="w-fit" on:click={continueFocus}>Continue Focus!</Button>
      </div>
    </div>
  {/if}
  <div class="container flex flex-col space-y-10 p-4">
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
        <Label class="justify-center text-xl hover:cursor-pointer" for="focus-mode">Focus Mode</Label>
      </div>
    {:catch error}
      <h3>Error checking elevated privileges: {error}</h3>
    {/await}
    <div class="flex items-center justify-center">
      <Label for="till-date" class="mr-4 text-xl">Focus for:</Label>
      <Input
        id="till-date"
        type="number"
        bind:value={$settingsStore.timerValue}
        class="w-20 py-6 text-xl"
        disabled={isTimerRunning}
      />
      <Label for="till-date" class="ml-2 mr-4 text-xl">minutes</Label>
    </div>
    <div class="flex items-center justify-center">
      <Button class="text-xl" variant="outline" on:click={startTimer} disabled={isTimerRunning}>Start Timer</Button>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <Button variant="outline" class="text-xl" on:click={() => goto("/preferences")}>
        <IconSettings class="mr-2 h-6 w-6" />
        Preferences
      </Button>
    </div>
  </div>
  <Footer {timeRemaining} />
</div>

<style>
</style>
