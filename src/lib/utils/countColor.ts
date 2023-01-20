export const countColor = (imgElement: HTMLImageElement) => {
  const src = cv.imread(imgElement)

  return (vectL: number[], vectH: number[]) => {
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

    return count
  }
}
