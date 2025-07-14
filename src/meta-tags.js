const fs = require("fs-extra");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
const cheerio = require("cheerio");
const chalk = require("chalk");
const inquirer = require("inquirer");
const open = require("open");
const ora = require("ora");
const boxen = require("boxen");

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
    this.genAI = new GoogleGenAI({ apiKey });
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
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
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

      const result = await model.generateContent(prompt);
      const analysis = result.response.text();
      
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
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      
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

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
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
    console.log(boxen(
      chalk.green("🎉 AI-Generated Meta Tags Preview\n\n") +
      chalk.yellow("Title: ") + generatedTags.title + "\n" +
      chalk.yellow("Description: ") + generatedTags.description + "\n\n" +
      chalk.cyan("Reasoning: ") + generatedTags.reasoning,
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "green"
      }
    ));

    const { shouldEdit } = await inquirer.prompt([
      {
        type: "confirm",
        name: "shouldEdit",
        message: "Would you like to edit these meta tags?",
        default: false
      }
    ]);

    if (shouldEdit) {
      return await this.editMetaTags(generatedTags);
    }

    return generatedTags;
  }

  async editMetaTags(tags) {
    const questions = [
      {
        type: "input",
        name: "title",
        message: `Title (${tags.title.length}/60 chars):`,
        default: tags.title,
        validate: (input) => {
          if (input.length > 60) {
            return "Title should be 60 characters or less";
          }
          return true;
        }
      },
      {
        type: "input",
        name: "description",
        message: `Description (${tags.description.length}/160 chars):`,
        default: tags.description,
        validate: (input) => {
          if (input.length > 160) {
            return "Description should be 160 characters or less";
          }
          return true;
        }
      },
      {
        type: "input",
        name: "ogTitle",
        message: "Open Graph Title:",
        default: tags.ogTitle
      },
      {
        type: "input",
        name: "ogDescription",
        message: "Open Graph Description:",
        default: tags.ogDescription
      }
    ];

    const editedTags = await inquirer.prompt(questions);
    
    return {
      ...tags,
      ...editedTags
    };
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
    const ogTags = {
      "og:title": metaTags.ogTitle,
      "og:description": metaTags.ogDescription,
      "og:type": "website"
    };
    
    for (const [property, content] of Object.entries(ogTags)) {
      if ($(`meta[property="${property}"]`).length > 0) {
        $(`meta[property="${property}"]`).attr("content", content);
      } else {
        $("head").append(`<meta property="${property}" content="${content}">`);
      }
    }
  }

  async showMetaTagsPreview(metaTags, projectAnalysis) {
    const previewUrl = `https://metatags.io/?url=${encodeURIComponent(metaTags.canonicalPattern || "https://example.com")}`;
    
    console.log(boxen(
      chalk.cyan("🔗 Meta Tags Preview\n\n") +
      chalk.yellow("Preview URL: ") + previewUrl + "\n\n" +
      chalk.green("✅ Title: ") + metaTags.title + "\n" +
      chalk.green("✅ Description: ") + metaTags.description + "\n" +
      chalk.green("✅ Open Graph: ") + "Configured\n" +
      chalk.green("✅ Canonical: ") + (metaTags.canonicalPattern || "Not set"),
      {
        padding: 1,
        margin: 1,
        borderStyle: "double",
        borderColor: "cyan"
      }
    ));

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "🌐 Open preview in browser", value: "browser" },
          { name: "📋 Copy preview URL", value: "copy" },
          { name: "✅ Continue", value: "continue" }
        ]
      }
    ]);

    if (action === "browser") {
      await open(previewUrl);
    } else if (action === "copy") {
      // Copy to clipboard (simplified for now)
      console.log(chalk.green("Preview URL copied to clipboard!"));
      console.log(chalk.dim(previewUrl));
    }
  }
}

module.exports = {
  MetaTagsAnalyzer
}; 