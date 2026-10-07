import os
from PIL import Image, ImageDraw

img = Image.open('public/CollectorEvents Brand Experience Board.png').convert('RGBA')

# 1. The Full Hero Banner (at top)
# Exactly matching the rounded frame bounds
# Let's crop x: 10 to 1526, y: 15 to 588
banner = img.crop((10, 15, 1526, 588))
banner.save('public/brand/banner.png')
banner.save('public/banner.png')

# 2. Logo Horizontal on Dark
# Inner logo bounds:
# x: 70 to 455, y: 882 to 962
logo_dark = img.crop((70, 882, 455, 962))
logo_dark.save('public/brand/logo-dark.png')

# 3. Logo Mark isolated from middle-center or middle-left
# In the middle center card: C mark is large and high-res!
# x: 650 to 765, y: 635 to 735
# Let's check coordinates of the large C mark in middle card:
logo_mark_dark = img.crop((650, 630, 765, 735))
logo_mark_dark.save('public/brand/logo_mark_card.png')

# In middle left card:
logo_mark_light = img.crop((175, 630, 290, 735))
logo_mark_light.save('public/brand/logo_mark_light.png')

# In the header of the top banner:
header_logo = img.crop((74, 34, 356, 82))
header_logo.save('public/brand/header_logo.png')

print("Saved logos and banner.")
