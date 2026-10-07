from PIL import Image
import numpy as np

mark = Image.open('public/brand/logo-mark-purple.png').convert('RGBA')
mark.save('public/brand/logo-mark.png')

# Create white version
arr = np.array(mark)
alpha = arr[:, :, 3]
white_arr = np.zeros_like(arr)
white_arr[:, :, 0] = 255
white_arr[:, :, 1] = 255
white_arr[:, :, 2] = 255
white_arr[:, :, 3] = alpha

white_mark = Image.fromarray(white_arr)
white_mark.save('public/brand/logo-mark-white.png')

print("Logo mark transparent and white version saved.")
