<script lang="ts">
  let imgSrc = ''
  let imgElement: HTMLImageElement
  let files: FileList
  const load = () => (imgSrc = URL.createObjectURL(files[0]))
</script>

<div>
  <div class="inputoutput">
    <img
      src={imgSrc}
      bind:this={imgElement}
      on:load={() => {
        const src = cv.imread(imgElement)
        const red_l = new cv.Mat(src.rows, src.cols, src.type(), [255, 0, 0, 0])
        const red_h = new cv.Mat(src.rows, src.cols, src.type(), [255, 0, 0, 255])
        const blue_l = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 255, 0])
        const blue_h = new cv.Mat(src.rows, src.cols, src.type(), [0, 0, 255, 255])
        const mask_blue = new cv.Mat()
        const mask_red = new cv.Mat()
        cv.inRange(src, red_l, red_h, mask_red)
        cv.inRange(src, blue_l, blue_h, mask_blue)
        let temp = new cv.MatVector()
        let temp2 = new cv.Mat()
        cv.findContours(
          mask_blue,
          temp,
          temp2,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE,
          new cv.Point()
        )
        console.log(temp)
        console.log(temp2)
        console.log('count', temp2.cols)
        cv.imshow('canvasOutput', mask_blue)
        // mask.delete()
        src.delete()
      }}
      alt=""
    />
    <div class="caption">
      imageSrc
      <input
        type="file"
        accept="image/*"
        bind:files
        on:change={() => (files.length ? load() : null)}
        name="file"
      />
    </div>
  </div>
  <div class="inputoutput">
    <canvas id="canvasOutput" />
    <div class="caption">canvasOutput</div>
  </div>
</div>
