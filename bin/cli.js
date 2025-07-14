#!/usr/bin/env node

const { Command } = require("commander");
const { analyzeImages } = require("../index");

const program = new Command();

program
  .name("SEOthing")
  .description(
    "A CLI tool to convert images to WebP format and update references for better web performance",
  )
  .version("1.0.0")
  .argument("[directory]", "Directory to process", ".")
  .option("-w, --write", "Write mode - actually perform the conversion")
  .option("-r, --replace", "Replace original files instead of keeping them")
  .action(async (directory, options) => {
    try {
      // Print the logo using oh-my-logo module
      const { renderFilled } = await import("oh-my-logo");
      const logo = await renderFilled("SEOthing", {
        palette: "grad-blue",
        fill: "gradient",
      });

      // Analyze images in the directory
      await analyzeImages(directory, options);
    } catch (error) {
      console.error("Error:", error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
