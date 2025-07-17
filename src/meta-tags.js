const fs = require("fs-extra");
const path = require("path");
const {GoogleGenAI} = require('@google/genai');
const cheerio = require("cheerio");
const chalk = require("chalk");
const inquirer = require("inquirer");
const open = require("open");
const ora = require("ora");
const boxen = require("boxen");
const blessed = require("blessed");

// Project type detection patterns
const PROJECT_PATTERNS = {
  react: ["package.json", "src/", "public/index.html"],
  vue: ["package.json", "src/", "public/index.html", "vue.config.js"],
  angular: ["package.json", "src/", "angular.json"],
  nextjs: ["package.json", "next.config.js", "pages/", "app/"],
  nuxt: ["package.json", "nuxt.config.js", "pages/"],
  svelte: ["package.json", "svelte.config.js", "src/"],
  wordpress: ["wp-config.php", "wp-content/", "index.php"],
  html: ["index.html", "*.html"],
  gatsby: ["package.json", "gatsby-config.js", "src/"],
  astro: ["package.json", "astro.config.js", "src/"]
};

// Essential meta tags configuration
const META_TAGS_CONFIG = {
  title: {
    selector: "title",
    maxLength: 60,
    required: true
  },
  description: {
    selector: 'meta[name="description"]',
    attribute: "content",
    maxLength: 160,
    required: true
  },
  viewport: {
    selector: 'meta[name="viewport"]',
    attribute: "content",
    defaultValue: "width=device-width, initial-scale=1",
    required: true
  },
  canonical: {
    selector: 'link[rel="canonical"]',
    attribute: "href",
    required: false
  },
  openGraph: {
    "og:title": {
      selector: 'meta[property="og:title"]',
      attribute: "content",
      maxLength: 60
    },
    "og:description": {
      selector: 'meta[property="og:description"]',
      attribute: "content",
      maxLength: 160
    },
    "og:image": {
      selector: 'meta[property="og:image"]',
      attribute: "content"
    },
    "og:url": {
      selector: 'meta[property="og:url"]',
      attribute: "content"
    },
    "og:type": {
      selector: 'meta[property="og:type"]',
      attribute: "content",
      defaultValue: "website"
    }
  }
};

class MetaTagsAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenAI({apiKey: this.apiKey});
  }

  async analyzeProject(directory) {
    console.log(chalk.cyan("\n🔍 Analyzing project structure..."));
    
    // Detect project type
    const projectType = await this.detectProjectType(directory);
    console.log(chalk.green(`✅ Detected project type: ${projectType}`));

    // Analyze repository structure
    const repoAnalysis = await this.analyzeRepository(directory);
    
    // Find main HTML files
    const htmlFiles = await this.findHTMLFiles(directory, projectType);
    
    return {
      projectType,
      repoAnalysis,
      htmlFiles,
      directory
    };
  }

  async detectProjectType(directory) {
    const files = await fs.readdir(directory);
    
    // Check for specific project patterns
    for (const [type, patterns] of Object.entries(PROJECT_PATTERNS)) {
      let matches = 0;
      
      for (const pattern of patterns) {
        if (pattern.includes("/")) {
          // Directory pattern
          const dirPath = path.join(directory, pattern);
          if (await fs.pathExists(dirPath)) matches++;
        } else {
          // File pattern
          const filePath = path.join(directory, pattern);
          if (await fs.pathExists(filePath)) matches++;
        }
      }
      
      // If we match enough patterns, it's likely this project type
      if (matches >= 2) {
        return type;
      }
    }
    
    // Default to HTML if no specific patterns match
    return "html";
  }

  async analyzeRepository(directory) {
    const spinner = ora("Analyzing repository with Gemini 2.5 Flash...").start();
    
    try {
      // Get repository structure
      const structure = await this.getRepositoryStructure(directory);
      
      // Get key files content
      const keyFiles = await this.getKeyFilesContent(directory);
      
      // Use Gemini 2.5 Flash for analysis
      const model = "gemini-2.5-flash" ;
      
      const prompt = `
        Analyze this repository structure and content to understand the project:

        Repository Structure:
        ${structure}

        Key Files Content:
        ${keyFiles}

        Please provide a brief analysis of:
        1. What type of website/application this is
        2. The main purpose and target audience
        3. Key features and functionality
        4. Technology stack used
        5. Any existing SEO considerations

        Keep the response concise and focused on information that would be helpful for generating SEO meta tags.
      `;

      const result = await this.genAI.models.generateContent({
        model: model,
        contents: prompt,
      });
      const analysis = result.text;
      
      spinner.succeed("Repository analysis complete!");
      return analysis;
      
    } catch (error) {
      spinner.fail("Repository analysis failed!");
      console.error(chalk.red(`Error: ${error.message}`));
      return "Unable to analyze repository structure.";
    }
  }

  async getRepositoryStructure(directory) {
    const structure = [];
    
    async function traverse(dir, level = 0) {
      if (level > 3) return; // Limit depth
      
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        if (item.startsWith(".") || item === "node_modules") continue;
        
        const itemPath = path.join(dir, item);
        const stats = await fs.stat(itemPath);
        const indent = "  ".repeat(level);
        
        if (stats.isDirectory()) {
          structure.push(`${indent}📁 ${item}/`);
          await traverse(itemPath, level + 1);
        } else {
          structure.push(`${indent}📄 ${item}`);
        }
      }
    }
    
    await traverse(directory);
    return structure.join("\n");
  }

  async getKeyFilesContent(directory) {
    const keyFiles = ["package.json", "README.md", "index.html", "config.js"];
    const content = [];
    
    for (const file of keyFiles) {
      const filePath = path.join(directory, file);
      
      if (await fs.pathExists(filePath)) {
        try {
          const fileContent = await fs.readFile(filePath, "utf-8");
          content.push(`\n--- ${file} ---\n${fileContent.substring(0, 1000)}...`);
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
    
    return content.join("\n");
  }

  async findHTMLFiles(directory, projectType) {
    const htmlFiles = [];
    
    // Define search patterns based on project type
    const searchPatterns = {
      react: ["public/index.html", "build/index.html"],
      vue: ["public/index.html", "dist/index.html"],
      angular: ["src/index.html", "dist/index.html"],
      nextjs: ["pages/_document.js", "pages/_app.js", "app/layout.js"],
      nuxt: ["app.html", "layouts/default.vue"],
      wordpress: ["index.php", "header.php", "functions.php"],
      html: ["index.html", "*.html"],
      gatsby: ["src/html.js", "public/index.html"],
      astro: ["src/layouts/*.astro", "public/index.html"]
    };
    
    const patterns = searchPatterns[projectType] || ["index.html"];
    
    for (const pattern of patterns) {
      const filePath = path.join(directory, pattern);
      
      if (await fs.pathExists(filePath)) {
        htmlFiles.push({
          path: filePath,
          relativePath: pattern,
          type: path.extname(pattern) || "html"
        });
      }
    }
    
    return htmlFiles;
  }

  async generateMetaTags(projectAnalysis) {
    const spinner = ora("Generating meta tags with Gemini 2.5 Pro...").start();
    
    try {
      // Use Gemini 2.5 Pro for more advanced meta tag generation
      const model = "gemini-2.5-pro" ;
      
      const prompt = `
        You are an expert SEO specialist and web developer. Based on the following project analysis, generate optimized meta tags that will improve search engine rankings and click-through rates.

        Project Analysis:
        ${projectAnalysis.repoAnalysis}

        Project Type: ${projectAnalysis.projectType}

        Generate the following meta tags with SEO best practices:

        1. Title Tag (50-60 characters max)
        2. Meta Description (150-160 characters max)
        3. Open Graph Title (same as title or variation)
        4. Open Graph Description (same as meta description or variation)
        5. Keywords (5-10 relevant keywords)
        6. Canonical URL structure recommendation

        Requirements:
        - Use compelling, action-oriented language
        - Include relevant keywords naturally
        - Focus on user intent and value proposition
        - Ensure titles and descriptions are click-worthy
        - Consider human psychology and emotional triggers
        - Make them unique and specific to this project

        Provide the response in JSON format:
        {
          "title": "Your optimized title here",
          "description": "Your optimized description here",
          "ogTitle": "Open Graph title",
          "ogDescription": "Open Graph description",
          "keywords": ["keyword1", "keyword2", "keyword3"],
          "canonicalPattern": "https://yourdomain.com/page-path",
          "reasoning": "Brief explanation of the SEO strategy used"
        }
      `;

      const result = await this.genAI.models.generateContent({
        model: model,
        contents: prompt,
      });
      const response = result.text;
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const generatedTags = JSON.parse(jsonMatch[0]);
        spinner.succeed("Meta tags generated successfully!");
        return generatedTags;
      } else {
        throw new Error("Failed to parse AI response");
      }
      
    } catch (error) {
      spinner.fail("Meta tag generation failed!");
      console.error(chalk.red(`Error: ${error.message}`));
      
      // Fallback to basic meta tags
      return {
        title: "Your Website Title",
        description: "Your website description goes here",
        ogTitle: "Your Website Title",
        ogDescription: "Your website description goes here",
        keywords: ["website", "seo", "meta", "tags"],
        canonicalPattern: "https://yourdomain.com/",
        reasoning: "Fallback meta tags due to generation error"
      };
    }
  }

  async presentMetaTagsEditor(generatedTags) {
    console.log(chalk.cyan("\n📝 AI-Generated Meta Tags - Edit each field:"));

    const editedTags = {};
    
    // Field definitions with display names
    const fields = [
      { key: 'title', label: 'Title', maxLength: 60 },
      { key: 'description', label: 'Description', maxLength: 160 },
      { key: 'ogTitle', label: 'Open Graph Title', maxLength: 60 },
      { key: 'ogDescription', label: 'Open Graph Description', maxLength: 160 },
      { key: 'canonicalPattern', label: 'Canonical URL Pattern', maxLength: 200 }
    ];

    // Handle keywords array separately
    if (generatedTags.keywords) {
      const keywordsString = Array.isArray(generatedTags.keywords) 
        ? generatedTags.keywords.join(', ')
        : generatedTags.keywords;
      
      editedTags.keywords = await this.editFieldInTerminal('Keywords', keywordsString, 100);
      editedTags.keywords = editedTags.keywords.split(',').map(k => k.trim()).filter(k => k);
    }

    // Process each field one by one
    for (const field of fields) {
      if (generatedTags[field.key]) {
        editedTags[field.key] = await this.editFieldInTerminal(
          field.label, 
          generatedTags[field.key], 
          field.maxLength
        );
      }
    }

    // Keep reasoning as-is (non-editable)
    if (generatedTags.reasoning) {
      editedTags.reasoning = generatedTags.reasoning;
    }

    console.log(chalk.green("✅ Meta tags updated!"));
    return editedTags;
  }

  async editFieldInTerminal(label, initialValue, maxLength) {
    return new Promise((resolve) => {
      // Create a blessed screen
      const screen = blessed.screen({
        smartCSR: true,
        title: `Edit ${label}`,
        autoPadding: true,
        dockBorders: true
      });

      // Create the main container
      const container = blessed.box({
        parent: screen,
        top: 'center',
        left: 'center',
        width: '80%',
        height: '50%',
        border: {
          type: 'line'
        },
        style: {
          border: {
            fg: 'blue'
          }
        }
      });

      // Create header text
      const header = blessed.text({
        parent: container,
        top: 0,
        left: 'center',
        content: `${label} (${maxLength} chars max)`,
        style: {
          fg: 'cyan',
          bold: true
        }
      });

      // Create character counter
      const counter = blessed.text({
        parent: container,
        top: 1,
        right: 1,
        content: `${initialValue.length}/${maxLength}`,
        style: {
          fg: initialValue.length > maxLength ? 'red' : 'green'
        }
      });

      // Create the editable textbox
      const textbox = blessed.textarea({
        parent: container,
        top: 3,
        left: 1,
        right: 1,
        bottom: 3,
        keys: true,
        mouse: true,
        inputOnFocus: true,
        content: initialValue,
        style: {
          fg: 'white',
          bg: 'black',
          focus: {
            fg: 'white',
            bg: 'blue'
          }
        },
        border: {
          type: 'line'
        }
      });

      // Create instructions
      const instructions = blessed.text({
        parent: container,
        bottom: 0,
        left: 'center',
        content: 'Press Ctrl+S to save and continue, Ctrl+C to cancel',
        style: {
          fg: 'yellow'
        }
      });

      // Update character counter on input
      textbox.on('value', (value) => {
        counter.setContent(`${value.length}/${maxLength}`);
        counter.style.fg = value.length > maxLength ? 'red' : 'green';
        screen.render();
      });

      // Handle save (Ctrl+S)
      screen.key(['C-s'], () => {
        const value = textbox.getValue();
        screen.destroy();
        resolve(value);
      });

      // Handle cancel (Ctrl+C)
      screen.key(['C-c'], () => {
        screen.destroy();
        resolve(initialValue); // Return original value on cancel
      });

      // Handle escape
      screen.key(['escape'], () => {
        screen.destroy();
        resolve(initialValue);
      });

      // Focus the textbox and render
      textbox.focus();
      screen.render();
    });
  }

  async editMetaTags(tags) {
    const tagsString = Object.entries(tags)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const { editedTagsStr } = await inquirer.prompt([
      {
        type: "editor",
        name: "editedTagsStr",
        message: "Edit the meta tags. Save and close the editor when you are done.",
        default: tagsString,
        validate: (text) => {
            try {
                text.split('\n').forEach(line => {
                    if (line.trim() && !line.includes(':')) {
                        throw new Error(`Invalid format. Each line should be in 'key: value' format. Problem line: "${line}"`);
                    }
                });
                return true;
            } catch (e) {
                return e.message;
            }
        }
      },
    ]);

    // Parse the edited string back into an object
    const editedTags = {};
    editedTagsStr.split('\n').forEach(line => {
        if (line.trim()) {
            const parts = line.split(':');
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            if (key) { // Ensure key is not empty
              editedTags[key] = value;
            }
        }
    });

    return editedTags;
  }

  async applyMetaTags(projectAnalysis, metaTags) {
    const spinner = ora("Applying meta tags to project files...").start();
    
    try {
      const { htmlFiles, projectType } = projectAnalysis;
      
      if (htmlFiles.length === 0) {
        spinner.fail("No HTML files found to update!");
        return;
      }

      for (const file of htmlFiles) {
        await this.updateHTMLFile(file, metaTags, projectType);
      }
      
      spinner.succeed("Meta tags applied successfully!");
      
    } catch (error) {
      spinner.fail("Failed to apply meta tags!");
      console.error(chalk.red(`Error: ${error.message}`));
    }
  }

  async updateHTMLFile(file, metaTags, projectType) {
    const content = await fs.readFile(file.path, "utf-8");
    const $ = cheerio.load(content);
    
    // Update title
    if ($("title").length > 0) {
      $("title").text(metaTags.title);
    } else {
      $("head").append(`<title>${metaTags.title}</title>`);
    }
    
    // Update meta description
    if ($('meta[name="description"]').length > 0) {
      $('meta[name="description"]').attr("content", metaTags.description);
    } else {
      $("head").append(`<meta name="description" content="${metaTags.description}">`);
    }
    
    // Update viewport
    if ($('meta[name="viewport"]').length === 0) {
      $("head").append(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
    }
    
    // Update Open Graph tags
    this.updateOpenGraphTags($, metaTags);
    
    // Update canonical tag (if applicable)
    if (metaTags.canonicalPattern) {
      if ($('link[rel="canonical"]').length > 0) {
        $('link[rel="canonical"]').attr("href", metaTags.canonicalPattern);
      } else {
        $("head").append(`<link rel="canonical" href="${metaTags.canonicalPattern}">`);
      }
    }
    
    // Write back to file
    await fs.writeFile(file.path, $.html());
    
    console.log(chalk.green(`✅ Updated ${file.relativePath}`));
  }

  updateOpenGraphTags($, metaTags) {
    for (const [property, config] of Object.entries(META_TAGS_CONFIG.openGraph)) {
      const value = metaTags[property];
      if (value) {
        let tag = $(`meta[property="${property}"]`);
        if (tag.length) {
          tag.attr("content", value);
        } else {
          $("head").append(`\n  <meta property="${property}" content="${value}">`);
        }
      }
    }
  }

  async showMetaTagsPreview(metaTags, projectAnalysis) {
    console.log(chalk.cyan("\n🔗 Opening metatags.io for live preview..."));
    
    const previewUrl = `https://metatags.io/`;
    await open(previewUrl);
    console.log(chalk.green(`✅ Opened metatags.io in your browser.`));
    console.log(chalk.dim(`Paste your website's URL there to see a preview.`));
  }
}

module.exports = {
  MetaTagsAnalyzer
}; 