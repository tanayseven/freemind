<script lang="ts">

  import {invoke} from '@tauri-apps/api/tauri';
  import {Button} from "$lib/components/ui/button";
  import {toggleMode} from "mode-watcher";
  import {Moon, Settings, Sun} from "lucide-svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import { z } from "zod";
  import {DateTime} from 'luxon';
  import {Label} from "$lib/components/ui/label";
  import {Switch} from "$lib/components/ui/switch";
  import {Input} from "$lib/components/ui/input";

  const hostsFile = '/etc/hosts';
  const possibleSubdomains = ["www", "news", "blog", "web"]
  const distractingSites = ['facebook.com', 'twitter.com', 'instagram.com', 'reddit.com', 'x.com', 'linkedin.com', 'youtube.com', 'whatsapp.com'];
  const start = '#-freemind-blacklist-start-#';
  const end = '#-freemind-blacklist-end-#';
  const redirectUrl = '127.0.0.1';

  type TimerMode = "focus-till" | "focus-for";
  let timerMode: TimerMode = "focus-till";

  const timerModeSchema = z.enum(["focus-till", "focus-for"]);

  const areSitesBlocked = (hostsFileContents: string) => {
    return hostsFileContents.includes(start) && hostsFileContents.includes(end);
  }

  const addBlockedSites = (hostsFileContents: string) => {
    if (areSitesBlocked(hostsFileContents)) return hostsFileContents;
    const lines = hostsFileContents.split('\n');
    let newLines = [start];
    for (let distractingSite of distractingSites) {
      const line = `${redirectUrl} ${distractingSite}`;
      newLines.push(line);
      for (let subdomain of possibleSubdomains) {
        const line = `${redirectUrl} ${([subdomain, distractingSite].join('.'))}`;
        newLines.push(line);
      }
    }
    newLines.push(end);
    newLines.push('');
    return lines.concat(newLines).join('\n');
  }

  const removeBlockedSites = (hostsFileContents: string) => {
    if (!areSitesBlocked(hostsFileContents)) return hostsFileContents;
    const lines = hostsFileContents.split('\n');
    let newLines = [];
    let isInsideBlockedSitesSection = false;
    for (let line of lines) {
      if (line.includes(start)) {
        isInsideBlockedSitesSection = true;
        continue;
      }
      if (line.includes(end)) {
        isInsideBlockedSitesSection = false;
        continue;
      }
      if (!isInsideBlockedSitesSection) {
        newLines.push(line);
      }
    }
    if (newLines[newLines.length - 1] === '') newLines.pop();
    return newLines.join('\n');
  }

  const startFocusTime = async () => {
    console.log("Starting focus time")
    try {
      const hostContents: string = await invoke('read_file_contents', { filePath: hostsFile });
      const modifiedHostContents = addBlockedSites(hostContents)
      await invoke('write_file_contents', { filePath: hostsFile, contents: modifiedHostContents });
      await invoke('restart_network');
    } catch (error) {
      console.error('Error reading hosts file:', error);
    }
  }

  const stopFocusTime = async () => {
    console.log("Stopping focus time")
    try {
      const hostContents: string = await invoke('read_file_contents', { filePath: hostsFile });
      const modifiedHostContents = removeBlockedSites(hostContents)
      await invoke('write_file_contents', { filePath: hostsFile, contents: modifiedHostContents });
      await invoke('restart_network');
    } catch (error) {
      console.error('Error reading hosts file:', error);
    }
  }

  const isFocusTime = async () => {
    console.log("Checking focus time")
    try {
      const hostContents: string = await invoke('read_file_contents', { filePath: hostsFile });
      return areSitesBlocked(hostContents);
    } catch (error) {
      console.error('Error reading hosts file:', error);
      return false;
    }
  }

  let focusMode = false;
  let currentTime = DateTime.now();

  setInterval(() => {
    currentTime = DateTime.now();
    console.log(currentTime.toISO());
  }, 1000);

  const toggleFocusTime = async () => {
    console.log("Toggling focus time")
    try {
      if (await isFocusTime()) {
        await stopFocusTime();
      } else {
        await startFocusTime();
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

  const onLoad = async () => {
    focusMode = await isFocusTime();
  }

</script>

<div class="container h-full p-0" use:onLoad>
  <div class="container p-4 flex flex-col space-y-10">
    <div class="grid grid-cols-[1fr_0rem]">
      <h1 class="grid self-center text-4xl font-extrabold tracking-tight lg:text-5xl justify-center">Free Mind</h1>
      <Button class="flex place-self-end content-center" on:click={toggleMode} variant="outline" size="icon">
        <Sun
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>

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
        <Switch id="focus-mode" on:click={toggleFocusTime} disabled={!isRoot} bind:checked={focusMode} />
        <Label class="justify-center text-xl" for="focus-mode">Focus Mode</Label>
      </div>
    {:catch error}
      <h3>Error checking elevated privileges: {error}</h3>
    {/await}
    <div class="flex items-center justify-center">
      <Label for="time-remaining" class="text-xl ml-2 mr-4">Time remaining:</Label>
      <span id="time-remaining" class="text-muted-foreground text-xl w-5 text-center">0</span>
      <Label for="time-remaining" class="text-xl ml-2 mr-4">days</Label>
      <span id="time-remaining" class="text-muted-foreground text-xl w-5 text-center">0</span>
      <Label for="time-remaining" class="text-xl ml-2 mr-4">hours</Label>
      <span id="time-remaining" class="text-muted-foreground text-xl w-5 text-center">0</span>
      <Label for="time-remaining" class="text-xl ml-2 mr-4">minutes</Label>
      <span id="time-remaining" class="text-muted-foreground text-xl w-5 text-center">0</span>
      <Label for="time-remaining" class="text-xl ml-2 mr-4">seconds</Label>
    </div>
    <RadioGroup.Root value="comfortable">
      <div class="flex items-center justify-center">
        <RadioGroup.Item value="focus-till" id="focus-till-radio" class="mr-4" on:click={()=>timerMode="focus-till"} />
        <Label for="till-time" class="text-xl mr-4">Focus till:</Label>
        <Input id="till-time" type="time" class="w-max py-6 text-xl mr-4" />
        <Input id="till-time" type="date" class="w-max py-6 text-xl" />
      </div>
      <div class="flex items-center justify-center">
        <RadioGroup.Item value="focus-for" id="focus-for-radio" class="mr-4" on:click={()=>timerMode="focus-till"} />
        <Label for="till-date" class="text-xl mr-4">Focus for:</Label>
        <Input id="till-date" type="number" value="0" class="w-20 py-6 text-xl" />
        <Label for="till-date" class="text-xl ml-2 mr-4">days</Label>
        <Input id="till-date" type="number" value="0" class="w-20 py-6 text-xl" />
        <Label for="till-date" class="text-xl ml-2 mr-4">hours</Label>
        <Input id="till-date" type="number" value="0" class="w-20 py-6 text-xl" />
        <Label for="till-date" class="text-xl ml-2 mr-4">minutes</Label>
      </div>
    </RadioGroup.Root>
    <div class="flex items-center justify-end space-x-2">
      <Button variant="outline" class="text-xl">
        <Settings class="mr-2 h-6 w-6" />
        Preferences
      </Button>
    </div>

  </div>
</div>

<style>

</style>
