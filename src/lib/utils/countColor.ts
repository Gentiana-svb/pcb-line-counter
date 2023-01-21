import { maskImage } from '$lib/utils/maskImage'

export const countColor = (imgElement: HTMLImageElement) => {
  const src = cv.imread(imgElement)

  return (vectL: number[], vectH: number[]): number => {
    const mask = maskImage(src, vectL, vectH)

    const temp = new cv.Mat()
    cv.findContours(
      mask,
      new cv.MatVector(),
      temp,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE,
      new cv.Point()
    )

    return temp.cols
  }
}
