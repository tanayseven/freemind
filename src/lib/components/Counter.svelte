<script lang="ts">
  export let initialCount: number = 0
  let count = initialCount

  function increment(): void {
    count += 1
  }

  function decrement(): void {
    count -= 1
  }
</script>

<div>
  <button data-testid="decrement" on:click={decrement}>-</button>
  <span data-testid="count">{count}</span>
  <button data-testid="increment" on:click={increment}>+</button>
</div>
