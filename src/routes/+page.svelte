<script lang="ts">
  import '../app.css'

  let imgSrc = ''
  let imgElement: HTMLImageElement
  let precessing = false

  const fileLoad = (files: FileList | undefined | null) => {
    if (files?.length) {
      precessing = true
      imgSrc = URL.createObjectURL(files[0])
    }
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
    precessing = false
  }

  let redCount = 0
  let blueCount = 0
</script>

<main
  on:dragover|preventDefault
  on:dragleave|preventDefault
  on:drop|preventDefault={e => fileLoad(e.dataTransfer?.files)}
  class="h-screen w-screen flex flex-col items-center justify-center"
>
  {#if imgSrc}
    {#if precessing}
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
    <button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded px-3 py-2">
      Paste image
    </button>
    <label
      class="px-3 py-2 rounded cursor-pointer bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
    >
      <input
        type="file"
        accept="image/*"
        on:change={e => fileLoad(e.currentTarget?.files)}
        class="hidden"
      />
      Select image
    </label>
    or drag and drop
  </div>
  {#if imgSrc}
    <img src={imgSrc} class="w-96 m-2" alt="Preview" />
  {/if}
  <img class="hidden" src={imgSrc} bind:this={imgElement} on:load={imgLoad} alt="" />
</main>
