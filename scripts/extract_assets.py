from PIL import Image
import numpy as np
import os

img = Image.open('public/CollectorEvents Brand Experience Board.png').convert('RGBA')

# 1. Favicon:
# In bottom right, let's locate the black squircle
# The raw crop was (1330, 840, 1520, 980). Let's find the squircle inside that region:
# Let's crop from the original board:
# In the original board, x is around 1380 to 1475, y is around 880 to 975
fav_crop = img.crop((1380, 880, 1476, 976))
fav_crop.save('public/brand/favicon_squircle.png')

# Also in top-right app icons:
# The 4 icons: (950, 630, 1500, 780)
icons_strip = img.crop((950, 630, 1500, 780))
icons_strip.save('public/brand/icons_strip.png')

# Dark horizontal logo (bottom left)
# Card is around (10, 852, 482, 990).
# Inner logo (mark + text) is around (80, 885, 450, 960)
dark_logo_content = img.crop((75, 880, 450, 965))
dark_logo_content.save('public/brand/logo_dark_trimmed.png')

# Stacked logo light (middle left)
light_stacked = img.crop((50, 630, 430, 815))
light_stacked.save('public/brand/logo_light_stacked.png')

# Stacked logo dark (middle center)
dark_stacked = img.crop((510, 630, 895, 815))
dark_stacked.save('public/brand/logo_dark_stacked.png')

print("Refined crops saved. Checking sizes...")
