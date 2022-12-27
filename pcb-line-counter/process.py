import cv2
from tkinter import filedialog
import os

homepath = os.environ['HOMEPATH']
typ = [('PNGファイル', '*.png')]
dir = f'C:\\{homepath}\\Desktop'
pathes = filedialog.askopenfilenames(filetypes=typ, initialdir=dir)

if not len(pathes):
    exit()

path = pathes[0]
img = cv2.imread(path)
cv2.imshow("Image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
# 青を抽出
bgr = [210, 150, 40]
thresh = 40

# 色の閾値
minBGR = np.array([bgr[0] - thresh, bgr[1] - thresh, bgr[2] - thresh])
maxBGR = np.array([bgr[0] + thresh, bgr[1] + thresh, bgr[2] + thresh])

# 画像の2値化
maskBGR = cv2.inRange(resized_img, minBGR, maxBGR)
# 画像のマスク（合成）
resultBGR = cv2.bitwise_and(resized_img, resized_img, mask=maskBGR)

cv2.imshow("Result BGR", resultBGR)
cv2.imshow("Result mask", maskBGR)

cv2.waitKey(0)
cv2.destroyAllWindows()
