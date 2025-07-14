<div align="center">
<img src="https://github.com/aryankeluskar/SEOthing/blob/master/SEOthing/assets/SEOthing.png?raw=true" alt="SEOthing Banner" />
</div>

<h2 align="center">CLI tool that converts images to WebP format and auto-updates all references for better web performance.</h2>

<p align="center">
<a href="https://www.npmjs.com/package/SEOthing">
<img alt="npm version" src="https://img.shields.io/npm/v/SEOthing.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/SEOthing">
<img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/SEOthing.svg?style=flat-square"></a>
<a href="https://x.com/intent/follow?screen_name=aryankeluscar">
<img alt="Follow Aryan on X" src="https://img.shields.io/badge/%40aryankeluscar-9f9f9f?style=flat-square&logo=x&labelColor=555"></a>
</p>

## Installation

```bash
npm install -g SEOthing
```

## Usage

```bash
npx SEOthing [directory] [options]
```

Converts images to WebP format and automatically updates file references in your codebase.

| Flag | Description |
|------|-------------|
| `-w, --write` | Directly perform the conversion (default: preview mode) |
| `-r, --replace` | Replace original files instead of keeping them (default: keep original files) |

### Examples

```bash
npx SEOthing                    # Preview conversion in current directory
npx SEOthing --write            # Convert all images in current directory  
npx SEOthing ./assets --write   # Convert images only from the assets folder
npx SEOthing --write --replace  # Convert and remove original files
```

### Full Execution Output

```bash
aryank@mac aryankeluskar.com % npx SEOthing

🔍 Finding images in: /Users/aryank/Developer/aryankeluskar.com

📸 Found 11 convertible image file(s):

┌────────────────────────────┬────────┬────────────┬────────────┬────────────┐
│ File                       │ Type   │ Original   │ WebP       │ Savings    │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/some pfp.jpg        │ JPG    │ 8.34 KB    │ 2.95 KB    │ 65%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/professional.jpg    │ JPG    │ 168.74 KB  │ 57.17 KB   │ 66%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/pfp.jpg             │ JPG    │ 74.28 KB   │ 25.57 KB   │ 66%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/buildspace.jpg      │ JPG    │ 12.53 KB   │ 4.01 KB    │ 68%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/hometowns/dadar.jpg │ JPG    │ 6.13 KB    │ 2.35 KB    │ 62%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/rcv.jpeg            │ JPEG   │ 10.98 KB   │ 3.79 KB    │ 65%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/healthgc.jpeg       │ JPEG   │ 6.51 KB    │ 2.34 KB    │ 64%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/mag.png             │ PNG    │ 275.56 KB  │ 15.25 KB   │ 94%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/good pfp blur.png   │ PNG    │ 3.62 MB    │ 185.14 KB  │ 95%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/cropped-asu-icon.p… │ PNG    │ 27.34 KB   │ 1.58 KB    │ 94%        │
├────────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/banner.png          │ PNG    │ 203.85 KB  │ 14.06 KB   │ 93%        │
└────────────────────────────┴────────┴────────────┴────────────┴────────────┘

📝 Summary:
   Total original size: 4.39 MB
   Total WebP size: 314.21 KB (predicted)
   Total space saved: 4.08 MB (93%)


? Do you want to proceed with converting these files? Yes

Starting conversion...

📸 Converting images...

   ✅ public/some pfp.jpg → public/some pfp.webp (-7% smaller)
   ✅ public/professional.jpg → public/professional.webp (60% smaller)
   ✅ public/pfp.jpg → public/pfp.webp (-6% smaller)
   ✅ public/buildspace.jpg → public/buildspace.webp (57% smaller)
   ✅ public/hometowns/dadar.jpg → public/hometowns/dadar.webp (38% smaller)
   ✅ public/rcv.jpeg → public/rcv.webp (66% smaller)
   ✅ public/healthgc.jpeg → public/healthgc.webp (72% smaller)
   ✅ public/mag.png → public/mag.webp (89% smaller)
   ✅ public/good pfp blur.png → public/good pfp blur.webp (94% smaller)
   ✅ public/cropped-asu-icon.png → public/cropped-asu-icon.webp (59% smaller)
   ✅ public/banner.png → public/banner.webp (73% smaller)

Updating image references in code files...
📋 Found 48 code files to check for references
   ✅ Updated 1 reference(s) in src/app/gcsp/index.html
   ✅ Updated 2 reference(s) in src/app/gcsp/furi.html
   ✅ Updated 1 reference(s) in src/app/gcsp/fse150.html
   ✅ Updated 4 reference(s) in src/data/resume.tsx
   ✅ Updated 1 reference(s) in src/components/hometown-section.tsx
   ✅ Updated 2 reference(s) in src/app/layout.tsx

Total references updated: 11

✅ Processing complete!
```