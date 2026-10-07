import os
from PIL import Image, ImageDraw

img = Image.open('public/CollectorEvents Brand Experience Board.png').convert('RGBA')

os.makedirs('public/brand', exist_ok=True)

# 1. Precise Squircle Favicon
# The dark squircle in the bottom right:
# Let's find its exact box inside (1370, 870, 1490, 990)
raw_fav = img.crop((1380, 875, 1480, 975))

# Let's inspect pixel colors to find the dark squircle bounding box
# Background is off-white (#F8FAFC ~ [248, 250, 252])
# Squircle is dark (#0F172A ~ [15, 23, 42])
pixels = raw_fav.load()
w, h = raw_fav.size

min_x, min_y, max_x, max_y = w, h, 0, 0
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # Dark pixel of the squircle
        if r < 100 and g < 100 and b < 100:
            if x < min_x: min_x = x
            if y < min_y: min_y = y
            if x > max_x: max_x = x
            if y > max_y: max_y = y

print(f"Squircle bounds: x=({min_x}, {max_x}), y=({min_y}, {max_y}), size={max_x-min_x+1}x{max_y-min_y+1}")

# Crop exact squircle
squircle = raw_fav.crop((min_x, min_y, max_x + 1, max_y + 1))
sq_w, sq_h = squircle.size

# Let's apply a smooth rounded corner mask with alpha channel so the outside is transparent
mask = Image.new('L', (sq_w, sq_h), 0)
draw = ImageDraw.Draw(mask)
# corner radius is approx 22% of dimension
corner_radius = int(sq_w * 0.22)
draw.rounded_rectangle([(0, 0), (sq_w - 1, sq_h - 1)], radius=corner_radius, fill=255)

clean_favicon = squircle.copy()
clean_favicon.putalpha(mask)

# Save high-res favicons
clean_favicon.save('public/brand/favicon-raw.png')

# Generate standard web favicons: 512, 192, 180, 64, 32, 16
clean_favicon.resize((512, 512), Image.Resampling.LANCZOS).save('public/brand/icon-512.png')
clean_favicon.resize((192, 192), Image.Resampling.LANCZOS).save('public/brand/icon-192.png')
clean_favicon.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
clean_favicon.resize((192, 192), Image.Resampling.LANCZOS).save('public/icon.png')
clean_favicon.resize((64, 64), Image.Resampling.LANCZOS).save('public/favicon.png')

# Save multi-size favicon.ico
fav_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
fav_images = [clean_favicon.resize(s, Image.Resampling.LANCZOS) for s in fav_sizes]
fav_images[0].save(
    'public/favicon.ico',
    format='ICO',
    sizes=fav_sizes,
    append_images=fav_images[1:]
)
# Also copy to app/favicon.ico if Next.js serves from app/
fav_images[0].save(
    'app/favicon.ico',
    format='ICO',
    sizes=fav_sizes,
    append_images=fav_images[1:]
)

print("Favicons generated successfully!")
