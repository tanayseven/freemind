<script lang="ts">

  import {invoke} from '@tauri-apps/api/tauri';

  const hostsFile = '/etc/hosts';
  const possibleSubdomains = ["www", "news", "blog"]
  const distractingSites = ['facebook.com', 'twitter.com', 'instagram.com', 'reddit.com', 'x.com', 'linkedin.com'];
  const start = '#-freemind-blacklist-start-#';
  const end = '#-freemind-blacklist-end-#';
  const redirectUrl = '127.0.0.1';

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

<div class="container">

  <h1>Free Mind</h1>

  {#await isRoot()}
    <h3>Checking root privileges...</h3>
  {:then isRoot}
    {#if isRoot}
      <h3>Root privileges are enabled!</h3>
    {:else}
      <h3>Root privileges are not enabled, this app might not work, please restart as root!</h3>
    {/if}
    <div class="row">
      <button on:click={startFocusTime} disabled={!isRoot}>Start Focus Time</button>
    </div>

    <div class="row">
      <button on:click={stopFocusTime} disabled={!isRoot}>Stop Focus Time</button>
    </div>
  {:catch error}
    <h3>Error checking elevated privileges: {error}</h3>
  {/await}
</div>

<style>

</style>
