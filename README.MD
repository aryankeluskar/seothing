<div align="center">
<img src="https://raw.githubusercontent.com/aryankeluskar/seothing/refs/heads/master/assets/SEOthing.png" alt="SEOthing Banner" />
</div>

<h2 align="center">Comprehensive SEO CLI tool that converts images to WebP format, generates AI-powered meta tags, and optimizes your website for better search engine performance.</h2>

<p align="center">
<a href="https://www.npmjs.com/package/seothing">
<img alt="npm version" src="https://img.shields.io/npm/v/seothing.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/seothing">
<img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/seothing.svg?style=flat-square"></a>
<a href="https://x.com/intent/follow?screen_name=aryankeluscar">
<img alt="Follow Aryan on X" src="https://img.shields.io/badge/%40aryankeluscar-9f9f9f?style=flat-square&logo=x&labelColor=555"></a>
</p>

## ✨ Features

- 🖼️ **Image Optimization**: Convert images to WebP format with automatic reference updates
- 🏷️ **AI-Powered Meta Tags**: Generate SEO-optimized meta tags using Google Gemini 2.5 Flash/Pro
- 🔍 **Project Analysis**: Automatic detection of project type (React, Vue, Angular, WordPress, etc.)
- 📱 **Mobile Optimization**: Automatic viewport meta tag injection
- 🔗 **Social Media Ready**: Open Graph tags for better social sharing
- 🎯 **SEO Best Practices**: Follows Google Lighthouse SEO recommendations
- 🌐 **Meta Tags Preview**: Preview your meta tags with metatags.io integration
- 💻 **Interactive CLI**: User-friendly interface with editing capabilities

## Installation

```bash
npm install -g seothing
```

## Usage

### Basic Usage

```bash
npx seothing [directory] [options]
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
npx seothing --meta --api-key YOUR_KEY  # Provide API key directly
```

### Complete SEO Optimization

```bash
npx seothing --all                       # Process both images and meta tags
npx seothing --all --write               # Apply all optimizations
```

## Command Line Options

| Flag | Description |
|------|-------------|
| `-w, --write` | Apply changes (default: preview mode) |
| `-r, --replace` | Replace original image files (default: keep originals) |
| `-i, --images` | Process images only |
| `-m, --meta` | Generate meta tags only |
| `-a, --all` | Process both images and meta tags |
| `--api-key <key>` | Google Gemini API key for meta tag generation |

## Meta Tags Features

### 🤖 AI-Powered Generation

SEOthing uses Google Gemini 2.5 Flash and Pro to:
- Analyze your project structure and content
- Generate compelling, SEO-optimized titles and descriptions
- Apply human psychology and marketing principles
- Create unique meta tags tailored to your project

### 🎯 SEO Best Practices

- **Title Tags**: 50-60 characters, keyword-optimized
- **Meta Descriptions**: 150-160 characters, click-worthy
- **Viewport Tags**: Mobile-friendly responsive design
- **Canonical Tags**: Prevent duplicate content issues
- **Open Graph Tags**: Optimized social media sharing

### 📱 Project Type Detection

Automatically detects and optimizes for:
- React, Vue, Angular applications
- Next.js, Nuxt.js, Gatsby sites
- WordPress installations
- Static HTML websites
- Astro, Svelte projects

## Getting Started with Meta Tags

1. **Get a Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a free API key

2. **Run SEOthing**
   ```bash
   npx seothing --meta
   ```

3. **Enter your API key when prompted**

4. **Review and edit the generated meta tags**

5. **Apply changes**
   ```bash
   npx seothing --meta --write
   ```

6. **Preview your meta tags**
   - Use the generated metatags.io preview URL
   - Open directly in browser or copy the link

## Example Output

```
🚀 SEOthing - Your Complete SEO Optimization Toolkit
Optimize images, generate meta tags, and boost your SEO!

🔍 Analyzing project structure...
✅ Detected project type: react

🏷️ Processing Meta Tags...
⠋ Analyzing repository with Gemini 2.5 Flash...
✅ Repository analysis complete!
⠋ Generating meta tags with Gemini 2.5 Pro...
✅ Meta tags generated successfully!

┌─────────────────────────────────────────────────────┐
│                                                     │
│  🎉 AI-Generated Meta Tags Preview                 │
│                                                     │
│  Title: SEOthing - AI-Powered SEO Optimization     │
│  Description: Boost your website's SEO with AI-    │
│  generated meta tags and WebP image optimization.  │
│                                                     │
│  Reasoning: Focused on value proposition and       │
│  compelling call-to-action for developers          │
│                                                     │
└─────────────────────────────────────────────────────┘

? Would you like to edit these meta tags? (y/N)
```

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

## API Reference

### MetaTagsAnalyzer Class

```javascript
const { MetaTagsAnalyzer } = require('seothing/lib/meta-tags');

const analyzer = new MetaTagsAnalyzer(apiKey);

// Analyze project
const analysis = await analyzer.analyzeProject('./my-project');

// Generate meta tags
const tags = await analyzer.generateMetaTags(analysis);

// Apply meta tags
await analyzer.applyMetaTags(analysis, tags);
```

## Supported Project Types

- **React**: `public/index.html`, `build/index.html`
- **Vue**: `public/index.html`, `dist/index.html`
- **Angular**: `src/index.html`, `dist/index.html`
- **Next.js**: `pages/_document.js`, `pages/_app.js`
- **WordPress**: `index.php`, `header.php`, `functions.php`
- **Static HTML**: `index.html`, `*.html`
- **Gatsby**: `src/html.js`, `public/index.html`
- **Astro**: `src/layouts/*.astro`

## Requirements

- Node.js >= 14.0.0
- Google Gemini API key (for meta tag generation)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

- 🐛 [Report Issues](https://github.com/aryankeluskar/seothing/issues)
- 💬 [Discussions](https://github.com/aryankeluskar/seothing/discussions)
- 📧 [Contact](mailto:aryan@keluskar.com)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/aryankeluskar">Aryan Keluskar</a>
</div>
