"""Create web derivatives only; preserve original artwork and published data.
Requires the installed Pillow, Node/tsx and FFmpeg runtimes.
Run from the project root: python scripts/optimize-web-assets.py
"""
import io
import json
from pathlib import Path
import subprocess
import tempfile
import urllib.request
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_155101_f2540600-6fe9-433e-8e48-b3f4b72f0727.mp4"
media = ROOT / "public/media"
thumbs = ROOT / "public/covers/optimized"
media.mkdir(parents=True, exist_ok=True)
thumbs.mkdir(parents=True, exist_ok=True)
logo = Image.open(ROOT / "src/assets/logo-speculum.png").convert("RGBA")
logo.thumbnail((256, 256), Image.Resampling.LANCZOS)
logo.save(ROOT / "src/assets/logo-speculum.webp", "WEBP", lossless=True)
favicon = Image.open(ROOT / "public/favicon.png").convert("RGBA")
favicon.thumbnail((48, 48), Image.Resampling.LANCZOS)
favicon.save(ROOT / "public/favicon-small.png", optimize=True)
carousel_dir = ROOT / "src/assets/covers/optimized"
carousel_dir.mkdir(parents=True, exist_ok=True)
for source in (ROOT / "src/assets/covers").glob("*.webp"):
    image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    image.thumbnail((660, 10000), Image.Resampling.LANCZOS)
    image.save(carousel_dir / source.name, "WEBP", quality=86, method=6)
source_video = Path(tempfile.gettempdir()) / "speculum-hero-source-20261008.mp4"
if not source_video.exists():
    urllib.request.urlretrieve(VIDEO_URL, source_video)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(source_video),
    "-an", "-vf", "scale=1280:-2", "-c:v", "libx264", "-preset", "slow",
    "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    str(media / "hero-background.mp4")], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(source_video),
    "-frames:v", "1", "-vf", "scale=1280:-2", "-c:v", "libwebp", "-quality", "86",
    str(media / "hero-poster.webp")], check=True)
query = 'import {fetchPublishedPostsSeo} from "./scripts/post-seo-data.ts"; console.log(JSON.stringify(await fetchPublishedPostsSeo()));'
posts = json.loads(subprocess.check_output(["node", "--import", "tsx", "-e", query], cwd=ROOT, text=True))
if not posts:
    raise RuntimeError("No published cover metadata; existing manifest was not changed.")
manifest = {}
source_bytes = optimized_bytes = 0
for post in posts:
    source = post.get("cover_image_url")
    if not source:
        continue
    local = ROOT / "public" / source.lstrip("/") if source.startswith("/") else None
    content = local.read_bytes() if local else urllib.request.urlopen(source, timeout=30).read()
    original = ImageOps.exif_transpose(Image.open(io.BytesIO(content))).convert("RGB")
    variants = {}
    for width in (480, 960):
        image = original.copy()
        image.thumbnail((width, 10000), Image.Resampling.LANCZOS)
        name = f'{post["slug"]}-{width}.webp'
        image.save(thumbs / name, "WEBP", quality=82, method=6)
        variants[str(width)] = f"/covers/optimized/{name}"
    manifest[post["slug"]] = {"source": source, "small": variants["480"], "large": variants["960"]}
    source_bytes += len(content)
    optimized_bytes += (thumbs / f'{post["slug"]}-960.webp').stat().st_size
(ROOT / "src/data/optimized-covers.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"covers": len(manifest), "sourceCoverBytes": source_bytes,
    "largeCoverBytes": optimized_bytes, "logoBytes": (ROOT / "src/assets/logo-speculum.webp").stat().st_size,
    "videoSourceBytes": source_video.stat().st_size, "videoBytes": (media / "hero-background.mp4").stat().st_size,
    "posterBytes": (media / "hero-poster.webp").stat().st_size}, indent=2))
