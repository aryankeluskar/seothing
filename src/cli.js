#!/usr/bin/env node

const { Command } = require("commander");
const { analyzeImages } = require("../index");
const { MetaTagsAnalyzer } = require("./meta-tags");
const chalk = require("chalk");
const inquirer = require("inquirer");

const program = new Command();

program
  .name("seothing")
  .description(
    "A comprehensive SEO CLI tool that converts images to WebP format, generates optimized meta tags, and improves your website's search engine performance"
  )
  .version("1.0.0")
  .argument("[directory]", "Directory to process", ".")
  .option("-w, --write", "Write mode - actually perform the conversion/updates")
  .option("-r, --replace", "Replace original files instead of keeping them")
  .option("-i, --images", "Process images only (convert to WebP)")
  .option("-m, --meta", "Generate and apply meta tags only")
  .option("-a, --all", "Process both images and meta tags")
  .option("--api-key <key>", "Google Gemini API key for meta tag generation")
  .action(async (directory, options) => {
    try {
      // Print the logo using oh-my-logo module
      const { renderFilled } = await import("oh-my-logo");
      await renderFilled("seothing", {
        palette: "grad-blue",
        fill: "gradient",
      });

      console.log() 
      console.log(chalk.cyan("🚀 SEOthing - The Complete Toolkit to Skyrocket your Lighthouse Score."));
      console.log(chalk.dim("Optimize images, generate meta tags, and boost your SEO!\n"));

      // Determine what to process
      const shouldProcessImages = options.images || options.all || (!options.meta && !options.images);
      const shouldProcessMeta = options.meta || options.all;

      if (shouldProcessImages) {
        console.log(chalk.yellow("📸 Processing Images..."));
        await analyzeImages(directory, options);
      }

      if (shouldProcessMeta) {
        console.log(chalk.yellow("🏷️ Processing Meta Tags..."));
        await processMetaTags(directory, options);
      }

      console.log(chalk.green("\n🎉 SEO optimization complete!"));
      console.log(chalk.dim("Your website is now optimized for better search engine performance."));

    } catch (error) {
      console.error(chalk.red("❌ Error:"), error.message);
      process.exit(1);
    }
  });

async function processMetaTags(directory, options) {
  let apiKey = options.apiKey;

  // If no API key provided, prompt for it
  if (!apiKey) {
    const { inputApiKey } = await inquirer.prompt([
      {
        type: "password",
        name: "inputApiKey",
        message: "Enter your Google Gemini API key:",
        mask: "*",
        validate: (input) => {
          if (!input.trim()) {
            return "API key is required for meta tag generation";
          }
          return true;
        }
      }
    ]);
    apiKey = inputApiKey;
  }

  try {
    const analyzer = new MetaTagsAnalyzer(apiKey);
    
    // Step 1: Analyze the project
    const projectAnalysis = await analyzer.analyzeProject(directory);
    
    // Step 2: Generate meta tags using AI
    const generatedTags = await analyzer.generateMetaTags(projectAnalysis);
    
    // Step 3: Present tags to user for editing
    const finalTags = await analyzer.presentMetaTagsEditor(generatedTags);
    
    // Step 4: Apply meta tags (regardless of write mode)
    await analyzer.applyMetaTags(projectAnalysis, finalTags);
    
    // Step 5: Show preview link
    await analyzer.showMetaTagsPreview(finalTags, projectAnalysis);
    
  } catch (error) {
    console.error(chalk.red("❌ Meta tag processing failed:"), error.message);
    
    if (error.message.includes("API key")) {
      console.log(chalk.yellow("💡 Make sure you have a valid Google Gemini API key"));
      console.log(chalk.dim("Get one at: https://makersuite.google.com/app/apikey"));
    }
  }
}

program.parse(process.argv);
