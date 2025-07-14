# SEOthing Test Projects

This directory contains 3 test projects designed to thoroughly test the SEOthing CLI tool across different project types and scenarios.

## Test Projects

### 1. Simple HTML Project (`simple-html-project/`)
- **Purpose**: Test basic HTML file processing and meta tag injection
- **Structure**: 
  - `index.html` - Main HTML file with existing meta tags
  - `assets/` - Contains sample images (JPG, PNG, JPEG)
- **Testing scenarios**:
  - Image conversion to WebP
  - Meta tag generation and injection
  - Reference updates in HTML files

### 2. React Project (`react-project/`)
- **Purpose**: Test React SPA processing with different image import methods
- **Structure**:
  - `public/index.html` - React template file
  - `src/App.js` - Main component with image imports
  - `src/assets/` - ES6 module imported images
  - `public/assets/` - Public static images
- **Testing scenarios**:
  - Meta tag injection in React template
  - ES6 import reference updates
  - Public asset reference updates
  - Project type detection for React

### 3. Next.js Project (`nextjs-project/`)
- **Purpose**: Test Next.js application with SSR meta tags
- **Structure**:
  - `pages/index.js` - Next.js page with Head component
  - `public/images/` - Static images
  - `next.config.js` - Next.js configuration
- **Testing scenarios**:
  - Next.js Head component meta tag updates
  - Static asset optimization
  - Project type detection for Next.js
  - Multiple image formats (JPG, PNG, JPEG, GIF)

## Running Tests

To test SEOthing on these projects:

1. **Install SEOthing globally** (if not already):
   ```bash
   npm install -g seothing
   ```

2. **Test each project**:
   ```bash
   # Test HTML project
   cd simple-html-project
   npx seothing --all
   
   # Test React project
   cd ../react-project
   npx seothing --all
   
   # Test Next.js project
   cd ../nextjs-project
   npx seothing --all
   ```

3. **Test specific features**:
   ```bash
   # Images only
   npx seothing --images
   
   # Meta tags only
   npx seothing --meta
   
   # With write mode
   npx seothing --all --write
   ```

## Expected Behaviors

### Image Processing
- Should detect and convert all image files to WebP
- Should update references in HTML, JS, and config files
- Should show accurate file size predictions

### Meta Tag Generation
- Should detect project type correctly
- Should generate relevant meta tags based on project content
- Should inject meta tags in appropriate files:
  - HTML: `<head>` section of index.html
  - React: `public/index.html`
  - Next.js: Individual page files or _app.js

### Project Type Detection
- **HTML**: Detects basic HTML structure
- **React**: Detects package.json + src/ + public/index.html
- **Next.js**: Detects package.json + next.config.js

## Troubleshooting

If you encounter issues:
1. Check that all dependencies are installed correctly
2. Verify API keys are properly configured
3. Ensure file permissions allow reading/writing
4. Check console output for specific error messages

## Adding New Test Cases

To add new test scenarios:
1. Create new files in existing projects OR
2. Create new project directory with appropriate structure
3. Update this README with new test cases
4. Test thoroughly before committing changes 