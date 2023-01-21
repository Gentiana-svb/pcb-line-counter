<script lang="ts">
  import CopyButton from '$lib/components/CopyButton.svelte'
  import { copyText } from '$lib/utils/copyText'
  import { countColor } from '$lib/utils/countColor'
  import { countShape } from '$lib/utils/countShape'
  import { loadImage } from '$lib/utils/loadImage'
  import '../app.css'

  let inputElement: HTMLInputElement | null
  let state: 'IDLE' | 'PROCESSING' | 'COMPLETED' = 'IDLE'

  const fileLoad = (files: FileList | undefined | null) => {
    if (files?.length) loadImg(files[0])
  }

  const clearSelectedFile = () => {
    if (inputElement) inputElement.value = ''
  }

  const loadImg = async (src: string | Blob) => {
    state = 'PROCESSING'
    const img = await loadImage(src)
    const maskBy = countColor(img)
    count.red = maskBy([200, 0, 0, 0], [255, 0, 0, 255])
    count.blue = maskBy([0, 0, 200, 0], [0, 0, 255, 255])
    count.shape = await countShape(img, 'OutputCanvas')
    state = 'COMPLETED'
  }

  const onDrop = (e: DragEvent) => {
    clearSelectedFile()
    fileLoad(e.dataTransfer?.files)
  }

  const onPaste = async () => {
    const data = await navigator.clipboard.read()
    const item = data[0]

    if (!item?.types.includes('image/png')) {
      alert('No available image in clipboard')
      return
    }

    clearSelectedFile()
    const b = await item.getType('image/png')
    const blob = new Blob([b], { type: 'image/png' })

    loadImg(blob)
  }

  const autoCopied = {
    red: false,
    blue: false
  }

  const count = {
    red: 0,
    blue: 0,
    shape: {
      L: 0,
      T: 0,
      X: 0
    }
  }

  $: allBlue = count.blue + count.shape.L + count.shape.T + count.shape.X * 2

  $: autoCopied.red = count.red !== 0
  $: autoCopied.blue = count.red === 0 && allBlue !== 0

  $: if (autoCopied.red) copyText(count.red.toString())
  $: if (autoCopied.blue) copyText(allBlue.toString())
</script>

<main
  on:dragover|preventDefault
  on:dragleave|preventDefault
  on:drop|preventDefault={onDrop}
  class="min-h-[100vh] min-w-[100vw] flex flex-col items-center justify-center"
>
  {#if state === 'PROCESSING'}
    <div class="text-3xl font-bold m-4">Loading...</div>
  {:else if state === 'COMPLETED'}
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
      <div>{allBlue}</div>
      <CopyButton text={allBlue.toString()} />
      <div class="text-green-500 text-base">
        {#if autoCopied.blue}
          Auto copied
        {/if}
      </div>
    </div>
    {#if allBlue}
      <span class="grid grid-auto-4 gap-3">
        <div>Line:{count.blue}</div>
        <div>L:{count.shape.L}</div>
        <div>T:{count.shape.T}</div>
        <div>X:{count.shape.X}</div>
      </span>
    {/if}
  {/if}
  <div class="grid grid-auto-3 items-center gap-3 m-3">
    Drag and drop or
    <button
      class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded px-3 py-2 select-none"
      on:click={onPaste}
    >
      Paste image
    </button>
    <label
      class="px-3 py-2 rounded select-none cursor-pointer border border-gray-800  hover:bg-gray-100 active:bg-gray-200"
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
  <canvas id="OutputCanvas" class="w-96 {state !== 'COMPLETED' ? 'hidden' : ''}" />
</main>
