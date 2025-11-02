<div align="center">
<img src="https://raw.githubusercontent.com/aryankeluskar/seothing/refs/heads/master/assets/SEOthing.webp" alt="SEOthing Banner" />
</div>

<h2 align="center">CLI tool to skyrocket your SEO score by converting images to WebP format, generating meta tags, and optimizing for better performance.</h2>

<p align="center">
<a href="https://www.npmjs.com/package/seothing">
<img alt="npm version" src="https://img.shields.io/npm/v/seothing.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/seothing">
<img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/seothing.svg?style=flat-square"></a>
<a href="https://x.com/intent/follow?screen_name=soydotrun">
<img alt="Follow Aryan on X" src="https://img.shields.io/badge/%40soydotrun-9f9f9f?style=flat-square&logo=x&labelColor=555"></a>
<a href="https://deepwiki.com/aryankeluskar/seothing"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

## Installation

```bash
npm install -g seothing
```

## Usage

<div align="center">
<img src="https://raw.githubusercontent.com/aryankeluskar/seothing/refs/heads/master/assets/image.webp" alt="Before vs After" />
</div>

### Basic Usage

```bash
npx seothing [directory] [options]
```


### Example Output

```
aryank@Aryans-MacBook-Air aryankeluskar.com % npx seothing

Welcome to SEOthing!
This tool optimizes images, generates meta tags, and boosts your SEO to skyrocket your Lighthouse Score.

? Let's get started with optimizing your images. Do you want to proceed? Yes

📸 Processing Images...
Welcome to SEOthing! This is a CLI tool to convert images to WebP format and auto-update references for better web performance.

🔍 Finding images in: /Users/aryank/Developer/aryankeluskar.com

📸 Found 11 convertible image file(s):

┌──────────────────────────┬────────┬────────────┬────────────┬────────────┐
│ File                     │ Type   │ Original   │ WebP       │ Savings    │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/some pfp.jpg      │ JPG    │ 8.34 KB    │ 2.95 KB    │ 65%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/professional.jpg  │ JPG    │ 168.74 KB  │ 57.17 KB   │ 66%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/pfp.jpg           │ JPG    │ 74.28 KB   │ 25.57 KB   │ 66%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/buildspace.jpg    │ JPG    │ 12.53 KB   │ 4.01 KB    │ 68%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/hometowns/dadar.… │ JPG    │ 6.13 KB    │ 2.35 KB    │ 62%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/rcv.jpeg          │ JPEG   │ 10.98 KB   │ 3.79 KB    │ 65%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/healthgc.jpeg     │ JPEG   │ 6.51 KB    │ 2.34 KB    │ 64%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/mag.png           │ PNG    │ 275.56 KB  │ 15.25 KB   │ 94%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/good pfp blur.png │ PNG    │ 3.62 MB    │ 185.14 KB  │ 95%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/cropped-asu-icon… │ PNG    │ 27.34 KB   │ 1.58 KB    │ 94%        │
├──────────────────────────┼────────┼────────────┼────────────┼────────────┤
│ public/banner.png        │ PNG    │ 203.85 KB  │ 14.06 KB   │ 93%        │
└──────────────────────────┴────────┴────────────┴────────────┴────────────┘

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

🏷️ Processing Meta Tags...
? Enter your Google Gemini API Key (Get it for Free at 
https://aistudio.google.com/app/apikey): ***************************************

🔍 Analyzing project structure...
✅ Detected project type: react
✔ Repository analysis complete!
✔ Meta tags generated successfully!

📝 AI-Generated Meta Tags - Edit each field:
Saving field: keywords, value: Aryan Keluskar, Software Engineer, Web Developer, Next.js Developer, React Developer, Portfolio, TypeScript, Resume, Full Stack Developer, FURI
Moving to next field: 1
Saving field: title, value: Aryan Keluskar | Software Engineer & Web Developer
Moving to next field: 2
Saving field: description, value: Explore the portfolio of Aryan Keluskar, a software engineer specializing in Next.js & React. Discover innovative projects, research, and technical articles.
Moving to next field: 3
Saving field: ogTitle, value: Aryan Keluskar | Software Engineer & Web Developer Portfolio
Moving to next field: 4
Saving field: ogDescription, value: Dive into the work of Aryan Keluskar. I build dynamic web apps with Next.js & React and conduct academic research. Check out my projects, resume, and blog.
Moving to next field: 5
Saving field: canonicalPattern, value: https://aryankeluskar.com/
All fields completed, final tags: {
  keywords: [
    'Aryan Keluskar',
    'Software Engineer',
    'Web Developer',
    'Next.js Developer',
    'React Developer',
    'Portfolio',
    'TypeScript',
    'Resume',
    'Full Stack Developer',
    'FURI'
  ],
  title: 'Aryan Keluskar | Software Engineer & Web Developer',
  description: 'Explore the portfolio of Aryan Keluskar, a software engineer specializing in Next.js & React. Discover innovative projects, research, and technical articles.',
  ogTitle: 'Aryan Keluskar | Software Engineer & Web Developer Portfolio',
  ogDescription: 'Dive into the work of Aryan Keluskar. I build dynamic web apps with Next.js & React and conduct academic research. Check out my projects, resume, and blog.',
  canonicalPattern: 'https://aryankeluskar.com/',
  reasoning: "The strategy focuses on establishing 'Aryan Keluskar' as the primary brand keyword, immediately followed by high-value professional titles like 'Software Engineer' to attract recruiters. The description uses action-oriented verbs ('Explore', 'Discover') to entice clicks and highlights the core tech stack (Next.js, React) and key value propositions (projects, research). The Open Graph tags are slightly more conversational for social media sharing while maintaining professional context. The canonical pattern ensures that each page (e.g., /resume, /blog/post-name) is indexed as a unique entity, preventing duplicate content issues and consolidating link equity to the preferred URL."
}

 📝 AI-Generated Meta Tags - Edit each field (6/6)


  Canonical URL Pattern (26 characters)

  ╭────────────────────────────────────────────────────────────────────────╮
  │                                                                        │
  │ https://aryankeluskar.com/                                             │
  │                                                                        │
  │                                                                        │
  │                                                                        │
  ╰────────────────────────────────────────────────────────────────────────╯

  Type to edit • Press Enter to save and continue • Escape to cancel


 Progress: [██████]

✅ Meta tags updated!

🔗 You can now preview your meta tags in metatags.io
✅ To see your meta tags in action, open https://metatags.io in your browser.
Publish your website, and then paste your website's URL there to see a preview.

```

### Image Optimization Only

```bash
npx seothing --images                    # Preview image conversion in current directory
npx seothing --images --write            # Convert all images to WebP
npx seothing ./assets --images --write   # Convert images only from the assets folder
npx seothing --images --write --replace  # Convert and remove original files
```

### Meta Tags Generation Only

```bash
npx seothing --meta                      # Generate meta tags (requires API key)
npx seothing --meta --write              # Generate and apply meta tags
npx seothing --meta --api-key YOUR_KEY   # Provide Google Gemini API key directly
```

### Complete SEO Optimization

```bash
npx seothing
```
<!-- 
## Features

- **Image Optimization**: Convert images to WebP format with automatic reference updates
- **AI-Powered Meta Tags**: Generate SEO-optimized meta tags using Google Gemini 2.5 Flash/Pro
- **Project Analysis**: Automatic detection of project type (React, Vue, Angular, WordPress, etc.)
- **Mobile Optimization**: Automatic viewport meta tag injection
- **Social Media Ready**: Open Graph tags for better social sharing
- **SEO Best Practices**: Follows Google Lighthouse SEO recommendations
- **Meta Tags Preview**: Preview your meta tags with metatags.io integration
- **Interactive CLI**: User-friendly interface with editing capabilities -->

## Command Line Options

| Flag | Description |
|------|-------------|
| `-w, --write` | Apply changes (default: preview mode) |
| `-r, --replace` | Replace original image files (default: keep originals) |
| `-i, --images` | Process images only |
| `-m, --meta` | Generate meta tags only |
| `-a, --all` | Process both images and meta tags |
| `--api-key <key>` | Google Gemini API key for meta tag generation |

## Project Structure

```
seothing/
├── src/
│   └── cli.js          # CLI entry point
│   └── meta-tags.js    # Meta tags analysis and generation
├── index.js            # Image optimization functionality
├── package.json
└── README.MD
```

## Supported Project Types

**React**, **Vue**, **Angular**, **Next.js**, **WordPress**, **Static HTML**, **Gatsby**, **Astro**

## Requirements

- Node.js >= 14.0.0
- Google Gemini API key (for meta tag generation)

## Contributing

Contributions are welcome! Please feel free to submit Issues or Pull Requests.

## License

MIT License - see LICENSE file for details.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/aryankeluskar">Aryan Keluskar</a>
</div>
