"""Build the 2500x500 multi-image collage banner for Bloc.

Composites real photos from public/bloc/* — no AI faces.
Five overlapping regions with polaroid borders, drop shadows, outer glow,
unified cool-teal grade, film grain, bottom gradient, vignette.
"""

import os
import random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

W, H = 2500, 500
NAVY = (10, 18, 38)
ROOT = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


def color_grade(img):
    img = ImageEnhance.Color(img).enhance(0.82)
    img = ImageEnhance.Contrast(img).enhance(1.06)
    if img.mode != "RGB":
        img = img.convert("RGB")
    teal = Image.new("RGB", img.size, (24, 96, 110))
    return Image.blend(img, teal, 0.07)


def crop_to_aspect(src, target_w, target_h, anchor_x=0.5, anchor_y=0.5):
    src_w, src_h = src.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h
    if src_ratio > target_ratio:
        crop_h = src_h
        crop_w = int(round(src_h * target_ratio))
        crop_x = int(round((src_w - crop_w) * anchor_x))
        crop_y = 0
    else:
        crop_w = src_w
        crop_h = int(round(src_w / target_ratio))
        crop_x = 0
        crop_y = int(round((src_h - crop_h) * anchor_y))
    return src.crop((crop_x, crop_y, crop_x + crop_w, crop_y + crop_h)).resize(
        (target_w, target_h), Image.LANCZOS
    )


def make_tile(src_path, tw, th, anchor_x=0.5, anchor_y=0.5, *,
              border=4, pad=42, angle=0.0, focal=False):
    src = Image.open(src_path).convert("RGB")
    cropped = crop_to_aspect(src, tw, th, anchor_x, anchor_y)
    graded = color_grade(cropped)

    bw, bh = tw + 2 * border, th + 2 * border
    bordered = Image.new("RGB", (bw, bh), (246, 248, 252))
    bordered.paste(graded, (border, border))
    bordered_rgba = bordered.convert("RGBA")

    cw, ch = bw + 2 * pad, bh + 2 * pad
    composed = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))

    # Drop shadow — gaussian-blurred dark rect, offset down/right
    shadow_alpha = 150 if focal else 110
    shadow_radius = 20 if focal else 14
    offset_x, offset_y = (6, 9) if focal else (3, 6)
    sh_mask = Image.new("L", (cw, ch), 0)
    sd = ImageDraw.Draw(sh_mask)
    sd.rectangle((pad, pad, pad + bw, pad + bh), fill=shadow_alpha)
    sh_mask = sh_mask.filter(ImageFilter.GaussianBlur(radius=shadow_radius))
    sh_mask = ImageChops.offset(sh_mask, offset_x, offset_y)
    shadow_layer = Image.composite(
        Image.new("RGBA", (cw, ch), (0, 0, 0, 255)),
        Image.new("RGBA", (cw, ch), (0, 0, 0, 0)),
        sh_mask,
    )
    composed = Image.alpha_composite(composed, shadow_layer)

    # Soft outer glow (subtle white)
    gl_mask = Image.new("L", (cw, ch), 0)
    gd = ImageDraw.Draw(gl_mask)
    gd.rectangle((pad - 3, pad - 3, pad + bw + 3, pad + bh + 3), fill=70)
    gl_mask = gl_mask.filter(ImageFilter.GaussianBlur(radius=7))
    glow_layer = Image.composite(
        Image.new("RGBA", (cw, ch), (255, 255, 255, 255)),
        Image.new("RGBA", (cw, ch), (0, 0, 0, 0)),
        gl_mask,
    )
    composed = Image.alpha_composite(composed, glow_layer)

    # Image with border on top
    composed.paste(bordered_rgba, (pad, pad))

    if angle != 0:
        composed = composed.rotate(angle, resample=Image.BICUBIC, expand=True)
    return composed


def paste_centered(canvas, tile, cx, cy):
    tw, th = tile.size
    canvas.alpha_composite(tile, (cx - tw // 2, cy - th // 2))


def main():
    canvas = Image.new("RGBA", (W, H), NAVY + (255,))

    p_whiteboard = os.path.join(ROOT, "public/bloc/1766762303813.jpg")
    p_trap = os.path.join(ROOT, "public/bloc/3_3e6cf6bd-664d-43a3-901f-2c7f11fd6cd5.webp")
    p_couch = os.path.join(ROOT, "public/bloc/1771965312991.jpg")
    p_pack = os.path.join(ROOT, "public/bloc/7_b9403864-7325-426d-a238-b86073c2923e.webp")

    t1 = make_tile(p_whiteboard, 480, 440, 0.55, 0.30, angle=-1.6)
    t2 = make_tile(p_trap,       500, 440, 0.5,  0.30, angle= 1.0)
    t3 = make_tile(p_couch,      580, 440, 0.55, 0.50, angle= 0.0, border=5, focal=True)
    t4 = make_tile(p_pack,       520, 440, 0.5,  0.5,  angle=-1.0)
    t5 = make_tile(p_trap,       560, 440, 0.7,  0.7,  angle= 1.5)

    # Draw back-to-front; R3 last for elevated z-index
    paste_centered(canvas, t1, 290,  250)
    paste_centered(canvas, t2, 760,  250)
    paste_centered(canvas, t4, 1700, 250)
    paste_centered(canvas, t5, 2210, 250)
    paste_centered(canvas, t3, 1225, 250)

    # Film grain — generated noise, 7% alpha
    random.seed(42)
    noise_l = Image.effect_noise((W, H), 64).convert("L")
    noise_rgb = Image.merge("RGB", (noise_l, noise_l, noise_l)).convert("RGBA")
    noise_rgb.putalpha(Image.new("L", (W, H), 18))
    canvas = Image.alpha_composite(canvas, noise_rgb)

    # Bottom 18% gradient (transparent -> deep navy)
    grad_h = int(H * 0.18)
    grad_strip = Image.new("RGBA", (1, grad_h), (0, 0, 0, 0))
    for y in range(grad_h):
        a = int(230 * (y / grad_h) ** 1.4)
        grad_strip.putpixel((0, y), (6, 12, 26, a))
    grad_strip = grad_strip.resize((W, grad_h))
    grad_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grad_layer.paste(grad_strip, (0, H - grad_h))
    canvas = Image.alpha_composite(canvas, grad_layer)

    # Vignette
    inner = Image.new("L", (W, H), 0)
    ind = ImageDraw.Draw(inner)
    ind.ellipse(
        (-int(W * 0.15), -int(H * 0.35), int(W * 1.15), int(H * 1.35)),
        fill=255,
    )
    inner = inner.filter(ImageFilter.GaussianBlur(radius=200))
    vig_alpha = ImageChops.invert(inner).point(lambda p: int(p * 0.48))
    vig_layer = Image.composite(
        Image.new("RGBA", (W, H), (2, 6, 14, 255)),
        Image.new("RGBA", (W, H), (0, 0, 0, 0)),
        vig_alpha,
    )
    canvas = Image.alpha_composite(canvas, vig_layer)

    out_path = os.path.join(ROOT, "public/bloc/bloc-collage-banner-2500x500.png")
    canvas.convert("RGB").save(out_path, "PNG", optimize=True)
    print(f"Saved: {out_path}")
    print(f"Size: {os.path.getsize(out_path)/1024:.1f} KB")
    with Image.open(out_path) as im:
        print(f"Dimensions: {im.size[0]} x {im.size[1]}")


if __name__ == "__main__":
    main()
