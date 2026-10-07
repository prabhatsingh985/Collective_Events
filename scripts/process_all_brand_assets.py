import os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

img = Image.open('public/CollectorEvents Brand Experience Board.png').convert('RGBA')

os.makedirs('public/brand', exist_ok=True)

# 1. Full Banner
# The top banner card inside the board:
banner = img.crop((10, 15, 1526, 588))
banner.save('public/brand/banner.png')
banner.save('public/banner.png')
# Also save as webp
banner.save('public/brand/banner.webp', format='WEBP', quality=95)

# 2. Extract the high-res C emblem mark
# In middle dark card: x: 644 to 770, y: 620 to 740
c_mark_crop = img.crop((644, 620, 775, 740))
# Let's create transparent background for this mark:
# The dark background of this card is roughly rgb(15, 23, 42) or hex #0F172A
arr = np.array(c_mark_crop)
bg_color = np.array([15, 23, 42]) # dark card bg

# Calculate distance from background color
diff = np.sqrt(np.sum((arr[:, :, :3].astype(float) - bg_color)**2, axis=2))
# Pixels close to bg_color become transparent, pixels far become opaque, smooth edge in between
threshold_low = 18
threshold_high = 45
alpha = np.clip((diff - threshold_low) / (threshold_high - threshold_low) * 255, 0, 255).astype(np.uint8)

# Create transparent mark
arr[:, :, 3] = alpha
mark_transparent = Image.fromarray(arr)
# Crop bounding box of non-zero alpha
bbox = mark_transparent.getbbox()
if bbox:
    mark_transparent = mark_transparent.crop(bbox)
mark_transparent.save('public/brand/logo-mark.png')
mark_transparent.resize((128, 128), Image.Resampling.LANCZOS).save('public/brand/logo-mark-128.png')

# 3. Horizontal Logo Dark (Transparent background)
# Bounding box of the horizontal logo in bottom left:
raw_dark_logo = img.crop((65, 878, 455, 965))
arr_logo = np.array(raw_dark_logo)
bg_dark = np.array([12, 17, 30])
diff_logo = np.sqrt(np.sum((arr_logo[:, :, :3].astype(float) - bg_dark)**2, axis=2))
alpha_logo = np.clip((diff_logo - 18) / (45 - 18) * 255, 0, 255).astype(np.uint8)
arr_logo[:, :, 3] = alpha_logo
dark_logo_trans = Image.fromarray(arr_logo)
bbox_logo = dark_logo_trans.getbbox()
if bbox_logo:
    dark_logo_trans = dark_logo_trans.crop(bbox_logo)
dark_logo_trans.save('public/brand/logo-dark-transparent.png')
raw_dark_logo.save('public/brand/logo-dark.png')

# 4. Horizontal Logo Light
# In the light version, "Collector" is dark, "Events" is purple.
# Let's crop from the middle-left card (text is at bottom)
# In middle-left card: "CollectorEvents" text is at x: 60 to 420, y: 760 to 825
text_light = img.crop((60, 760, 420, 825))
text_light.save('public/brand/text_light_raw.png')

# Let's assemble a horizontal Light Logo:
# Logo mark on light + text on light
# In middle-left card, let's extract the light mark (x: 170 to 295, y: 620 to 740)
c_light_crop = img.crop((170, 620, 295, 740))
arr_light = np.array(c_light_crop)
bg_light = np.array([248, 250, 252])
diff_light = np.sqrt(np.sum((arr_light[:, :, :3].astype(float) - bg_light)**2, axis=2))
alpha_light = np.clip((diff_light - 10) / (35 - 10) * 255, 0, 255).astype(np.uint8)
arr_light[:, :, 3] = alpha_light
mark_light_trans = Image.fromarray(arr_light)
bbox_light = mark_light_trans.getbbox()
if bbox_light:
    mark_light_trans = mark_light_trans.crop(bbox_light)
mark_light_trans.save('public/brand/logo-mark-purple.png')

# Extract text on light with transparency
arr_text = np.array(text_light)
diff_text = np.sqrt(np.sum((arr_text[:, :, :3].astype(float) - bg_light)**2, axis=2))
alpha_text = np.clip((diff_text - 15) / (40 - 15) * 255, 0, 255).astype(np.uint8)
arr_text[:, :, 3] = alpha_text
text_light_trans = Image.fromarray(arr_text)
bbox_text = text_light_trans.getbbox()
if bbox_text:
    text_light_trans = text_light_trans.crop(bbox_text)

# Compose horizontal light logo (mark + text)
mark_h = int(text_light_trans.height * 1.35)
mark_w = int(mark_light_trans.width * (mark_h / mark_light_trans.height))
scaled_mark = mark_light_trans.resize((mark_w, mark_h), Image.Resampling.LANCZOS)

spacing = int(mark_h * 0.25)
total_w = scaled_mark.width + spacing + text_light_trans.width
total_h = max(scaled_mark.height, text_light_trans.height)

horiz_light = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
horiz_light.paste(scaled_mark, (0, (total_h - scaled_mark.height) // 2), scaled_mark)
horiz_light.paste(text_light_trans, (scaled_mark.width + spacing, (total_h - text_light_trans.height) // 2), text_light_trans)
horiz_light.save('public/brand/logo-light.png')
horiz_light.save('public/brand/logo.png')

# 5. App Icons
# 4 squircle variants:
# Icon 1: White on Blue (950, 630, 1070, 755)
# Icon 2: Gradient on Dark (1080, 630, 1205, 755)
# Icon 3: White on Purple (1220, 630, 1345, 755)
# Icon 4: Dark on Light (1360, 630, 1485, 755)
for idx, (x1, y1, x2, y2, name) in enumerate([
    (960, 630, 1075, 750, 'app-icon-blue.png'),
    (1095, 630, 1210, 750, 'app-icon-dark.png'),
    (1235, 630, 1350, 750, 'app-icon-purple.png'),
    (1375, 630, 1490, 750, 'app-icon-mono.png')
]):
    crop_icon = img.crop((x1, y1, x2, y2))
    crop_icon.save(f'public/brand/{name}')

print("All brand assets successfully generated!")
