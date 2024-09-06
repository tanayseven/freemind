<script lang="ts">

  import { invoke } from '@tauri-apps/api/tauri';

  const hostsFile = '/etc/hosts';
  const distractingSites = ['facebook.com', 'twitter.com', 'instagram.com', 'reddit.com'];
  const start = '#-freemind-blacklist-start-#';
  const end = '#-freemind-blacklist-end-#';
  const redirectUrl = '127.0.0.1';

  const startFocusTime = async () => {
    console.log("Starting focus time")
    try {
      const hostContents = await invoke('read_file_contents', { filePath: hostsFile });
      console.log("Host contents: ", hostContents)
    } catch (error) {
      console.error('Error reading hosts file:', error);
    }
  }
  const stopFocusTime = () => {
    console.log("Stopping focus time")
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
