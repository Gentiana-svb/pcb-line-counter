<script lang="ts">
  import '../app.css'

  let imgSrc = ''
  let imgElement: HTMLImageElement
  let inputElement: HTMLInputElement | null
  let processing = false
  let redCount = 0
  let blueCount = 0

  const fileLoad = (files: FileList | undefined | null) => {
    if (files?.length) {
      processing = true
      imgSrc = URL.createObjectURL(files[0])
    }
  }

  const clearSelectedFile = () => {
    if (inputElement) inputElement.value = ''
  }

  const countColor = (vectL: number[], vectH: number[]) => {
    const src = cv.imread(imgElement)

    const thL = new cv.Mat(src.rows, src.cols, src.type(), vectL)
    const thH = new cv.Mat(src.rows, src.cols, src.type(), vectH)
    const mask = new cv.Mat()
    cv.inRange(src, thL, thH, mask)
    const temp = new cv.Mat()
    cv.findContours(
      mask,
      new cv.MatVector(),
      temp,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE,
      new cv.Point()
    )

    const count = temp.cols

    thL.delete()
    thH.delete()
    mask.delete()
    temp.delete()
    src.delete()

    return count
  }

  const imgLoad = () => {
    redCount = countColor([200, 0, 0, 0], [255, 0, 0, 255])
    blueCount = countColor([0, 0, 200, 0], [0, 0, 255, 255])
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
      <div class="grid grid-auto-2 text-3xl font-bold gap-2 m-4">
        <div>Red</div>
        <div>{redCount}</div>
        <div>Blue</div>
        <div>{blueCount}</div>
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
    <img src={imgSrc} class="w-96 m-2" alt="Preview" />
  {/if}
  <img class="hidden" src={imgSrc} bind:this={imgElement} on:load={imgLoad} alt="" />
</main>
