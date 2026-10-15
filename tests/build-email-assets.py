"""Build small email-only assets. The original website logo is never modified."""
from pathlib import Path
from random import Random
from PIL import Image, ImageDraw, ImageOps

root = Path(__file__).resolve().parents[1]
folder = root / 'public' / 'redesign'
original = Image.open(folder / 'studio-logo-white.png').convert('RGBA')
bounds = original.getchannel('A').getbbox()
if bounds is None:
    raise ValueError('Studio logo has no visible pixels')
# Trim transparent canvas only; preserve all of the actual artwork and its aspect ratio.
mark = ImageOps.contain(original.crop(bounds), (152, 152), Image.Resampling.LANCZOS)
logo = Image.new('RGBA', (176, 176))
logo.alpha_composite(mark, ((176 - mark.width) // 2, (176 - mark.height) // 2))
logo.save(folder / 'email-studio-logo.png', optimize=True)

random = Random(114721)
size = 96
grain = Image.new('RGBA', (size, size))
pixels = grain.load()
for y in range(size):
    for x in range(size):
        colour = 255 if random.random() > 0.5 else 0
        pixels[x, y] = (colour, colour, colour, random.randrange(2, 13))
draw = ImageDraw.Draw(grain)
for _ in range(100):
    x, y = random.randrange(size), random.randrange(size)
    colour = 255 if random.random() > 0.5 else 0
    draw.line((x, y, x + random.randrange(2, 9), y + random.randrange(-1, 2)), fill=(colour, colour, colour, 7))
grain.save(folder / 'email-grain.png', optimize=True)
for name in ['email-studio-logo.png', 'email-grain.png']:
    file = folder / name
    print(f'{name}: {file.stat().st_size} bytes')
