<script lang="ts">
  import CopyButton from '$lib/components/CopyButton.svelte'
  import { copyText } from '$lib/utils/copyText'
  import { countColor } from '$lib/utils/countColor'
  import '../app.css'

  let imgSrc = ''
  let imgElement: HTMLImageElement
  let inputElement: HTMLInputElement | null
  let processing = false

  const fileLoad = (files: FileList | undefined | null) => {
    if (files?.length) {
      processing = true
      imgSrc = URL.createObjectURL(files[0])
    }
  }

  const clearSelectedFile = () => {
    if (inputElement) inputElement.value = ''
  }

  const imgLoad = () => {
    const maskBy = countColor(imgElement)
    count.red = maskBy([200, 0, 0, 0], [255, 0, 0, 255])
    count.blue = maskBy([0, 0, 200, 0], [0, 0, 255, 255])
    processing = false
  }

  const onDrop = (e: DragEvent) => {
    clearSelectedFile()
    fileLoad(e.dataTransfer?.files)
  }

  const onPaste = async () => {
    processing = true

    const data = await navigator.clipboard.read()
    const d = data[0]

    if (!d?.types.includes('image/png')) {
      alert('No available image in clipboard')
      processing = false
      return
    }

    clearSelectedFile()
    const b = await d.getType('image/png')
    const blob = new Blob([b], { type: 'image/png' })

    imgSrc = URL.createObjectURL(blob)
  }

  const autoCopied = {
    red: false,
    blue: false
  }

  const count = {
    red: 0,
    blue: 0
  }

  $: autoCopied.red = count.red !== 0
  $: autoCopied.blue = count.red === 0 && count.blue !== 0

  $: if (autoCopied.red) copyText(count.red.toString())
  $: if (autoCopied.blue) copyText(count.blue.toString())
</script>

<main
  on:dragover|preventDefault
  on:dragleave|preventDefault
  on:drop|preventDefault={onDrop}
  class="h-screen w-screen flex flex-col items-center justify-center"
>
  {#if imgSrc}
    {#if processing}
      <div class="text-3xl font-bold m-4">Loading...</div>
    {:else}
      <div class="grid grid-auto-4 items-center text-3xl font-bold gap-2 m-4">
        <div>Red</div>
        <div>{count.red}</div>
        <CopyButton text={count.red.toString()} />
        <div class="text-green-500 text-base">
          {#if autoCopied.red}
            Auto copied
          {/if}
        </div>
        <div>Blue</div>
        <div>{count.blue}</div>
        <CopyButton text={count.blue.toString()} />
        <div class="text-green-500 text-base">
          {#if autoCopied.blue}
            Auto copied
          {/if}
        </div>
      </div>
    {/if}
  {/if}
  <div class="grid grid-auto-3 items-center gap-3 m-3">
    Drag and drop or
    <button
      class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded px-3 py-2"
      on:click={onPaste}
    >
      Paste image
    </button>
    <label
      class="px-3 py-2 rounded cursor-pointer border border-gray-800  hover:bg-gray-100 active:bg-gray-200"
    >
      <input
        type="file"
        accept="image/*"
        on:change={e => fileLoad(e.currentTarget?.files)}
        class="hidden"
        bind:this={inputElement}
      />
      Select image
    </label>
  </div>
  {#if imgSrc}
    <img src={imgSrc} class="w-96 m-2 max-h-[70vh]" alt="Preview" />
  {/if}
  <img class="hidden" src={imgSrc} bind:this={imgElement} on:load={imgLoad} alt="" />
</main>
