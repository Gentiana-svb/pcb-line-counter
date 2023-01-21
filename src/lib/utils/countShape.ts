import cornerUrl from '$lib/assets/img/corner.png'
import { loadImage } from '$lib/utils/loadImage'
import { maskImage } from '$lib/utils/maskImage'

type R = {
  L: number
  T: number
  X: number
}

export const countShape = async (
  imgElement: HTMLImageElement,
  outputCanvasID: string
): Promise<R> => {
  const src = cv.imread(imgElement)

  const cornerImg = await loadImage(cornerUrl)
  const cornerSrc = cv.imread(cornerImg)

  const temp2 = new cv.Mat()
  const temp3 = new cv.Mat()
  const temp4 = new cv.Mat()

  cv.rotate(cornerSrc, temp2, cv.ROTATE_90_CLOCKWISE)
  cv.rotate(cornerSrc, temp3, cv.ROTATE_90_COUNTERCLOCKWISE)
  cv.rotate(cornerSrc, temp4, cv.ROTATE_180)

  const cornerList = [cornerSrc, temp2, temp3, temp4]

  const mask = maskImage(src, [0, 0, 200, 0], [0, 0, 255, 255])

  const matchLists = cornerList.flatMap(cornerImg => {
    const tmpl = maskImage(cornerImg, [255, 255, 255, 255], [255, 255, 255, 255])

    const res = new cv.Mat() as {
      data64F: Float64Array
      data32F: Float32Array
      cols: number
      rows: number
    }
    cv.matchTemplate(mask, tmpl, res, cv.TM_CCOEFF_NORMED)

    const matchRes: {
      pos: {
        col: number
        row: number
      }
      group: number
    }[] = []

    cv.imshow(outputCanvasID, res)

    res.data32F.forEach((n, index) => {
      if (n > 0.8)
        matchRes.push({
          pos: {
            col: index % res.cols,
            row: Math.floor(index / res.cols)
          },
          group: 0
        })
    })

    return matchRes
  })

  const hypot = (a: number, b: number) => Math.sqrt(a * a + b * b)
  const distance = (a: { col: number; row: number }, b: { col: number; row: number }) =>
    hypot(a.col - b.col, a.row - b.row)

  matchLists.forEach((x, index) => {
    if (x.group) return
    const groupNum = index + 1
    x.group = groupNum
    matchLists.forEach(r => {
      if (r.group) return
      if (distance(x.pos, r.pos) < 10) r.group = groupNum
    })
  })

  const groupCountList = matchLists.reduce((prev, curr) => {
    prev.set(curr.group, (prev.get(curr.group) ?? 0) + 1)
    return prev
  }, new Map<number, number>())

  ;[...groupCountList.keys()].forEach(groupNum => {
    const range = 5
    const item = matchLists.find(x => x.group === groupNum)
    if (!item) return
    const p1 = new cv.Point(item.pos.col - range, item.pos.row - range)
    const p2 = new cv.Point(item.pos.col + range, item.pos.row + range)
    const color = new cv.Scalar(255, 0, 0, 255)
    cv.rectangle(src, p1, p2, color)
  })

  cv.imshow(outputCanvasID, src)

  const result = [...groupCountList].reduce(
    (prev, [, count]) => {
      switch (count) {
        case 1:
          prev.L++
          break
        case 2:
          prev.T++
          break
        case 4:
          prev.X++
          break
      }
      return prev
    },
    {
      L: 0,
      T: 0,
      X: 0
    }
  )

  return result
}
