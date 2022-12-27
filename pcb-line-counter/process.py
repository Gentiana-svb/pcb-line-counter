import cv2
from tkinter import filedialog
import os
import numpy as np

# 画像選択ダイアログを表示
homepath = os.environ['HOMEPATH']
typ = [('PNGファイル', '*.png')]
dir = f'C:\\{homepath}\\Desktop'
pathes = filedialog.askopenfilenames(filetypes=typ, initialdir=dir)

# 画像選択されなければ終了
if not len(pathes):
    exit()

# 画像読み込み
path = pathes[0]
img = cv2.imread(path)

# 色の閾値
# BGR FF0000 (青、裏配線)
# BGR 0000FF (赤、表ジャンパ)
# のみ検出
blue = np.array([255, 0, 0])
red = np.array([0, 0, 255])

# 画像の2値化
mask_blue = cv2.inRange(img, blue, blue)
mask_red = cv2.inRange(img, red, red)

# 2つのマスクを結合
mask = cv2.bitwise_or(mask_blue, mask_red)

# 輪郭抽出
contours, hierarchy = cv2.findContours(
    mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# 輪郭の個数を表示
print(len(contours))
