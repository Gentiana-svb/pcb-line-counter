<script lang="ts">
  let imgSrc = ''
  let imgElement: HTMLImageElement

  const fileLoad = (files: FileList | undefined | null) =>
    files?.length ? (imgSrc = URL.createObjectURL(files[0])) : null

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
  }

  let redCount = 0
  let blueCount = 0
</script>

<main
  on:dragover|preventDefault
  on:dragleave|preventDefault
  on:drop|preventDefault={e => fileLoad(e.dataTransfer?.files)}
>
  <div class="result">
    <span class="result-label">Red</span>
    <span class="result-label">{redCount}</span>
    <span class="result-label">Blue</span>
    <span class="result-label">{blueCount}</span>
  </div>
  <span class="control">
    <button>Paste image</button>
    <label>
      <input
        type="file"
        accept="image/*"
        on:change={e => fileLoad(e.currentTarget?.files)}
        style:display="none"
      />
      Select image
    </label>
    or drag and drop
  </span>
  {#if imgSrc}
    <img class="preview" src={imgSrc} width="200px" alt="Preview" />
  {/if}
  <img style:display="none" src={imgSrc} bind:this={imgElement} on:load={imgLoad} alt="" />
</main>

<style>
  .preview {
    margin: 1em 0;
  }
  .result {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
    margin: 1em 0;
  }
  .result-label {
    font-family: sans-serif;
    font-size: 1.5em;
    font-weight: bold;
  }
  .control {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5em 0;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  label {
    display: inline-block;
    padding: 0.5em 1em;
    color: #fff;
    background-color: rgb(58, 150, 171);
    border-radius: 4px;
    transition: 0.4s;
    cursor: pointer;
    font-family: sans-serif;
    font-size: 1em;
    user-select: none;
  }
  button {
    display: inline-block;
    padding: 0.5em 1em;
    color: #fff;
    background-color: rgb(58, 150, 171);
    border-radius: 4px;
    border: none;
    transition: 0.4s;
    font-size: 1em;
    cursor: pointer;
    font-family: sans-serif;
    user-select: none;
  }
</style>
