<script lang="ts">
  import Copy from '$lib/assets/icon/Copy.svelte'
  import { copyText } from '$lib/utils/copyText'

  export let text: string

  let visible = false
</script>

<button
  class="flex items-center text-base font-normal"
  on:click={() => {
    copyText(text).then(() => {
      visible = true
      setTimeout(() => (visible = false), 1000)
    })
  }}
>
  <Copy Class="w-5 m-2" />
  {#if visible}
    Copied!!
  {:else}
    Copy
  {/if}
</button>
