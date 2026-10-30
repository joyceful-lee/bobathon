"""Render the SVG cup mark into browser and phone icon formats (Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
scale = 8
image = Image.new("RGBA", (64 * scale, 64 * scale))
draw = ImageDraw.Draw(image)
cream, coral = "#f5f1e5", "#d5784b"
draw.rounded_rectangle((0, 0, 64 * scale - 1, 64 * scale - 1), radius=14 * scale, fill="#2e453b")

def line(points, color, width, caps=False):
    draw.line([(x * scale, y * scale) for x, y in points], fill=color, width=round(width * scale), joint="curve")
    if caps:
        r = width * scale / 2
        for x, y in (points[0], points[-1]):
            x, y = x * scale, y * scale
            draw.ellipse((x - r, y - r, x + r, y + r), fill=color)

line([(20, 23), (23, 51), (26, 52.5), (29, 53.4), (32, 53.8), (35, 53.4), (38, 52.5), (41, 51), (44, 23)], cream, 3)
line([(39, 10), (33, 37)], coral, 4, caps=True)
line([(18, 23), (46, 23)], cream, 3, caps=True)
for x, y in [(28, 43), (36, 42), (29, 50), (37, 49)]:
    r = 2.3 * scale
    draw.ellipse((x * scale - r, y * scale - r, x * scale + r, y * scale + r), fill=cream)

image.save(root / "app" / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
image.resize((180, 180), Image.Resampling.LANCZOS).save(root / "app" / "apple-icon.png")
(root / "outputs").mkdir(exist_ok=True)
image.resize((256, 256), Image.Resampling.LANCZOS).save(root / "outputs" / "favicon-preview.png")
print("Created SVG companion icons: ICO (16/32/48/64px) and Apple touch icon (180px).")
