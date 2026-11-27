"""Generate Google Play store graphics into store/google-play/.

Usage (from repo root, after `npm install`):
    python scripts/generate-store-assets.py

Outputs:
    store/google-play/icon-512.png              512x512 PNG (Play Console app icon)
    store/google-play/feature-graphic-en.png    1024x500 PNG, no alpha
    store/google-play/feature-graphic-fr.png    1024x500 PNG, no alpha
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "store", "google-play")
FONTS = os.path.join(ROOT, "node_modules", "@expo-google-fonts")
TITLE_FONT = os.path.join(FONTS, "space-grotesk", "700Bold", "SpaceGrotesk_700Bold.ttf")
BODY_FONT = os.path.join(FONTS, "space-grotesk", "500Medium", "SpaceGrotesk_500Medium.ttf")
MONO_FONT = os.path.join(FONTS, "jetbrains-mono", "700Bold", "JetBrainsMono_700Bold.ttf")

BG = (14, 16, 34)
TEXT = (242, 243, 255)
MUTED = (163, 168, 214)
ACCENT = (139, 124, 255)
MINT = (61, 224, 160)
PINK = (255, 107, 138)

TAGLINES = {
    "en": ("Does it run", "or does it crash?", "Python · JavaScript"),
    "fr": ("Ça marche", "ou ça plante ?", "Python · JavaScript"),
}

S = 2  # supersample factor


def feature_graphic(lang: str) -> Image.Image:
    w, h = 1024 * S, 500 * S
    img = Image.new("RGB", (w, h), BG)

    # soft accent glows
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse([-200 * S, -150 * S, 500 * S, 550 * S], fill=ACCENT + (70,))
    g.ellipse([750 * S, 250 * S, 1200 * S, 700 * S], fill=MINT + (35,))
    img.paste(glow.filter(ImageFilter.GaussianBlur(120 * S)), (0, 0), glow.filter(ImageFilter.GaussianBlur(120 * S)))

    # app icon on the left
    icon = Image.open(os.path.join(ROOT, "assets", "icon.png")).convert("RGBA")
    size = 340 * S
    icon = icon.resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size, size], int(size * 0.22), fill=255)
    img.paste(icon, (80 * S, (h - size) // 2), mask)

    d = ImageDraw.Draw(img)
    x = 470 * S
    title = ImageFont.truetype(TITLE_FONT, 72 * S)
    body = ImageFont.truetype(BODY_FONT, 40 * S)
    mono = ImageFont.truetype(MONO_FONT, 26 * S)

    line1, line2, langs = TAGLINES[lang]
    d.text((x, 105 * S), "Code Swipe", font=title, fill=TEXT)
    d.text((x, 215 * S), line1, font=body, fill=MINT)
    d.text((x, 265 * S), line2, font=body, fill=PINK)

    # language pill
    tb = d.textbbox((0, 0), langs, font=mono)
    pw, ph = tb[2] - tb[0] + 44 * S, 54 * S
    py = 350 * S
    d.rounded_rectangle([x, py, x + pw, py + ph], ph // 2, outline=ACCENT, width=3 * S)
    d.text((x + 22 * S, py + (ph - (tb[3] - tb[1])) // 2 - tb[1]), langs, font=mono, fill=ACCENT)

    return img.resize((1024, 500), Image.LANCZOS)


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    icon = Image.open(os.path.join(ROOT, "assets", "icon.png")).convert("RGB")
    icon.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT, "icon-512.png"), optimize=True)
    for lang in TAGLINES:
        feature_graphic(lang).save(os.path.join(OUT, f"feature-graphic-{lang}.png"), optimize=True)
    print("Wrote assets to", OUT)


if __name__ == "__main__":
    main()
