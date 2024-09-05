<script lang="ts">

  import { invoke } from '@tauri-apps/api/tauri';

  const startFocusTime = () => {
    console.log("Starting focus time")
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

  const sayHello = async (): Promise<string> => {
    return await invoke('hello_world');
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
