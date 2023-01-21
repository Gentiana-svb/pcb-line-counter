export const maskImage = (src: any, vectL: number[], vectH: number[]) => {
  const thL = new cv.Mat(src.rows, src.cols, src.type(), vectL)
  const thH = new cv.Mat(src.rows, src.cols, src.type(), vectH)
  const mask = new cv.Mat()

  cv.inRange(src, thL, thH, mask)

  return mask
}
