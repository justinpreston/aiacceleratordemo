"""Generate placeholder icons for the Contoso Equipment Deck Cowork plugin.

Creates:
  color.png   192x192 full-color app icon
  outline.png 32x32 single-color outline icon

Run: python cowork-plugin/generate_icons.py
Requires: pillow
"""

import os

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
BRAND = (0, 75, 141)  # Contoso blue
WHITE = (255, 255, 255)


def _font(size):
    for name in ("segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def _centered(draw, text, font, box):
    left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
    w, h = right - left, bottom - top
    return ((box - w) / 2 - left, (box - h) / 2 - top)


def make_color():
    size = 192
    img = Image.new("RGB", (size, size), BRAND)
    draw = ImageDraw.Draw(img)
    font = _font(96)
    text = "CE"
    draw.text(_centered(draw, text, font, size), text, font=font, fill=WHITE)
    img.save(os.path.join(HERE, "color.png"))


def make_outline():
    size = 32
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([3, 3, size - 4, size - 4], outline=(255, 255, 255, 255), width=2)
    draw.line([9, 12, 23, 12], fill=(255, 255, 255, 255), width=2)
    draw.line([9, 18, 23, 18], fill=(255, 255, 255, 255), width=2)
    draw.line([9, 24, 18, 24], fill=(255, 255, 255, 255), width=2)
    img.save(os.path.join(HERE, "outline.png"))


if __name__ == "__main__":
    make_color()
    make_outline()
    print("Wrote color.png (192x192) and outline.png (32x32) to", HERE)
