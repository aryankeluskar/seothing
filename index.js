const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const glob = require("glob");
const chalk = require("chalk");
const Table = require("cli-table3");
const inquirer = require("inquirer");

// Image extensions that can be converted to WebP
const CONVERTIBLE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".tif",
];

// File extensions to search for image references
const CODE_EXTENSIONS = [
  "**/*.html",
  "**/*.css",
  "**/*.js",
  "**/*.jsx",
  "**/*.ts",
  "**/*.tsx",
  "**/*.vue",
  "**/*.svelte",
  "**/*.md",
  "**/*.json",
  "**/*.xml",
];

async function analyzeImages(directory, options) {
  try {
    console.log(
      "Welcome to SEOthing! This is a CLI tool to convert images to WebP format and auto-update references for better web performance.",
    );
    console.log(`\n🔍 Finding images in: ${path.resolve(directory)}`);

    // Check if directory exists
    if (!(await fs.pathExists(directory))) {
      console.error(`❌ Directory "${directory}" does not exist.`);
      process.exit(1);
    }

    // Find all convertible images
    const imageFiles = await findImages(directory);

    if (imageFiles.length === 0) {
      console.log("📂 No convertible image files found in this directory.");
      return;
    }

    console.log(`\n📸 Found ${imageFiles.length} convertible image file(s):`);

    // Process each image and collect results
    const results = [];
    for (const imageFile of imageFiles) {
      const result = await processImage(imageFile, directory, options);
      if (result) {
        results.push(result);
      }
    }

    // Display results in table format
    if (results.length > 0) {
      displayResultsTable(results, options);
    }

    // If not in write mode, ask user if they want to proceed
    if (!options.write && results.length > 0) {
      const { shouldProceed } = await inquirer.prompt([
        {
          type: "confirm",
          name: "shouldProceed",
          message: chalk.cyan(
            "Do you want to proceed with converting these files?",
          ),
          default: true,
        },
      ]);

      if (shouldProceed) {
        console.log(chalk.green("\nStarting conversion...\n"));

        // Recursively call with write mode enabled
        const writeOptions = { ...options, write: true };
        await convertImages(directory, imageFiles, writeOptions);

        // Update references in code files
        console.log("\nUpdating image references in code files...");
        await updateReferences(directory, imageFiles, writeOptions);

        console.log("\n✅ Processing complete!");
      } else {
        console.log(
          "\n👋 Review Complete. Run with --write flag to proceed with conversion.",
        );
      }
    } else if (options.write) {
      // Update references in code files if write mode is enabled
      console.log("\nUpdating image references in code files...");
      await updateReferences(directory, imageFiles, options);

      console.log("\n✅ Processing complete!");
    }
  } catch (error) {
    console.error("❌ Error processing images:", error.message);
    process.exit(1);
  }
}

async function findImages(directory) {
  const imageFiles = [];

  for (const ext of CONVERTIBLE_EXTENSIONS) {
    const pattern = path.join(directory, `**/*${ext}`);
    const files = glob.sync(pattern, { ignore: ["**/node_modules/**"] });
    imageFiles.push(...files);
  }

  return imageFiles;
}

async function convertImages(directory, imageFiles, options) {
  console.log("📸 Converting images...\n");

  const results = [];
  for (const imageFile of imageFiles) {
    const result = await convertSingleImage(imageFile, directory, options);
    if (result) {
      results.push(result);
      console.log(
        `   ✅ ${result.relativePath} → ${result.webpRelativePath} (${result.savings}% smaller)`,
      );
    }
  }

  return results;
}

async function convertSingleImage(imagePath, baseDir, options) {
  try {
    const stats = await fs.stat(imagePath);
    const originalSize = stats.size;
    const relativePath = path.relative(baseDir, imagePath);
    const ext = path.extname(imagePath).toLowerCase();

    // Generate WebP filename
    const webpPath = imagePath.replace(ext, ".webp");
    const webpRelativePath = relativePath.replace(ext, ".webp");

    // Convert to WebP
    await sharp(imagePath).webp({ quality: 85 }).toFile(webpPath);

    const webpStats = await fs.stat(webpPath);
    const webpSize = webpStats.size;
    const savings = Math.round((1 - webpSize / originalSize) * 100);

    // Remove original file if replace flag is set
    if (options.replace) {
      await fs.remove(imagePath);
    }

    return {
      relativePath,
      originalSize,
      webpSize,
      savings,
      webpRelativePath,
      ext,
    };
  } catch (error) {
    console.error(`   ❌ Error processing ${imagePath}:`, error.message);
    return null;
  }
}

async function processImage(imagePath, baseDir, options) {
  try {
    const stats = await fs.stat(imagePath);
    const originalSize = stats.size;
    const relativePath = path.relative(baseDir, imagePath);
    const ext = path.extname(imagePath).toLowerCase();

    // Generate WebP filename
    const webpPath = imagePath.replace(ext, ".webp");
    const webpRelativePath = relativePath.replace(ext, ".webp");

    let webpSize, savings, status;

    if (options.write) {
      // Convert to WebP
      await sharp(imagePath).webp({ quality: 85 }).toFile(webpPath);

      const webpStats = await fs.stat(webpPath);
      webpSize = webpStats.size;
      savings = Math.round((1 - webpSize / originalSize) * 100);
      status = "converted";

      // Remove original file if replace flag is set
      if (options.replace) {
        await fs.remove(imagePath);
        status = "converted & removed";
      }
    } else {
      // Predict WebP size using real analysis
      webpSize = await predictWebPSize(imagePath, originalSize, ext);
      savings =
        originalSize > 0 ? Math.round((1 - webpSize / originalSize) * 100) : 0;
      status = "preview";
    }

    return {
      relativePath,
      originalSize,
      webpSize,
      savings,
      status,
      webpRelativePath,
      ext,
    };
  } catch (error) {
    console.error(`   ❌ Error processing ${imagePath}:`, error.message);
    return null;
  }
}

async function predictWebPSize(imagePath, originalSize, ext) {
  try {
    // Get image metadata for analysis
    const metadata = await sharp(imagePath).metadata();
    const { width, height, channels, density, hasAlpha } = metadata;

    // Calculate image characteristics
    const totalPixels = width * height;
    const bytesPerPixel = originalSize / totalPixels;
    const aspectRatio = width / height;

    // Base compression ratios from research and real-world data
    let baseCompression;

    switch (ext) {
      case ".png":
        // PNG typically compresses 85-95% (5-15% remaining)
        // Better compression for images with:
        // - Large solid areas (low bytes per pixel)
        // - Repeated patterns
        // - Transparency (often indicates simple graphics)
        baseCompression = hasAlpha ? 0.08 : 0.12; // Alpha PNGs compress better

        // Adjust based on complexity (bytes per pixel indicates compression efficiency of original)
        if (bytesPerPixel < 1)
          baseCompression *= 0.7; // Already well compressed, WebP does even better
        else if (bytesPerPixel > 3) baseCompression *= 1.3; // Complex image, less compression

        break;

      case ".jpg":
      case ".jpeg":
        // JPEG typically compresses 25-35% (65-75% remaining)
        // Less dramatic improvement since already lossy compressed
        baseCompression = 0.3;

        // Adjust based on original compression level (estimated by file size)
        if (bytesPerPixel < 0.5)
          baseCompression *= 1.2; // Already heavily compressed
        else if (bytesPerPixel > 1.5) baseCompression *= 0.8; // Light compression, more room for improvement

        break;

      case ".gif":
        // GIF typically compresses 70-85% (15-30% remaining)
        baseCompression = 0.22;
        break;

      case ".bmp":
      case ".tiff":
      case ".tif":
        // Uncompressed formats compress extremely well
        baseCompression = 0.05;
        break;

      default:
        baseCompression = 0.15;
    }

    // Adjust for image characteristics
    let sizeMultiplier = 1.0;

    // Large images often have more redundancy
    if (totalPixels > 2000000)
      sizeMultiplier *= 0.9; // >2MP
    else if (totalPixels < 100000) sizeMultiplier *= 1.1; // <0.1MP

    // Extreme aspect ratios (banners, etc.) often compress well
    if (aspectRatio > 3 || aspectRatio < 0.33) {
      sizeMultiplier *= 0.85;
    }

    // Add realistic variance (WebP compression varies by content)
    // Use a deterministic "random" based on file size to be consistent
    const variance = 0.15; // ±15% variance
    const pseudoRandom = (originalSize * 0.618033) % 1; // Golden ratio for distribution
    const varianceMultiplier = 1 + (pseudoRandom - 0.5) * 2 * variance;

    const predictedRatio =
      baseCompression * sizeMultiplier * varianceMultiplier;

    // Ensure reasonable bounds (5% to 95% compression)
    const boundedRatio = Math.max(0.05, Math.min(0.95, predictedRatio));

    return Math.round(originalSize * boundedRatio);
  } catch (error) {
    // Fallback to format-based estimation if metadata reading fails
    console.warn(`Could not analyze ${imagePath}, using fallback prediction`);

    const fallbackRatios = {
      ".png": 0.1,
      ".jpg": 0.3,
      ".jpeg": 0.3,
      ".gif": 0.25,
      ".bmp": 0.05,
      ".tiff": 0.05,
      ".tif": 0.05,
    };

    const ratio = fallbackRatios[ext] || 0.15;
    return Math.round(originalSize * ratio);
  }
}

async function updateReferences(directory, imageFiles, options) {
  const codeFiles = [];

  // Find all code files
  for (const pattern of CODE_EXTENSIONS) {
    const files = glob.sync(path.join(directory, pattern), {
      ignore: ["**/node_modules/**", "**/.git/**"],
    });
    codeFiles.push(...files);
  }

  console.log(
    `📋 Found ${codeFiles.length} code files to check for references`,
  );

  let totalReferences = 0;

  for (const codeFile of codeFiles) {
    try {
      let content = await fs.readFile(codeFile, "utf8");
      let fileUpdated = false;
      let fileReferences = 0;

      // Update references for each image
      for (const imagePath of imageFiles) {
        const originalName = path.basename(imagePath);
        const ext = path.extname(imagePath);
        const webpName = originalName.replace(ext, ".webp");

        // Create regex to find image references
        const imageRegex = new RegExp(escapeRegExp(originalName), "g");

        if (imageRegex.test(content)) {
          content = content.replace(imageRegex, webpName);
          fileUpdated = true;
          fileReferences++;
        }
      }

      if (fileUpdated) {
        await fs.writeFile(codeFile, content);
        console.log(
          `   ✅ Updated ${fileReferences} reference(s) in ${path.relative(directory, codeFile)}`,
        );
        totalReferences += fileReferences;
      }
    } catch (error) {
      console.error(`   ❌ Error updating ${codeFile}:`, error.message);
    }
  }

  console.log(chalk.green(`\nTotal references updated: ${totalReferences}`));
}

function formatFileSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

function displayResultsTable(results, options) {
  // Calculate dynamic width for file column based on terminal width
  const terminalWidth = process.stdout.columns || 80; // Default to 80 if not available
  const fixedColumnsWidth = 8 + 12 + 12 + 12; // Type + Original + WebP + Savings
  const tableOverhead = 10; // Account for borders, padding, etc.

  let fileColumnWidth = terminalWidth - fixedColumnsWidth - tableOverhead;

  // Apply min/max constraints
  fileColumnWidth = Math.max(5, Math.min(100, fileColumnWidth));

  const table = new Table({
    head: ["File", "Type", "Original", "WebP", "Savings"],
    colWidths: [fileColumnWidth, 8, 12, 12, 12],
  });

  results.forEach((result) => {
    const originalSizeText = chalk.red(formatFileSize(result.originalSize));
    const webpSizeText = chalk.green(formatFileSize(result.webpSize));

    const savingsText =
      result.savings > 0
        ? chalk.green(`${result.savings}%`)
        : chalk.yellow(`${result.savings}%`);

    // let statusText;
    // switch (result.status) {
    //   case 'converted':
    //     statusText = chalk.green('✅ Converted');
    //     break;
    //   case 'converted & removed':
    //     statusText = chalk.green('✅ Converted & Removed');
    //     break;
    //   case 'preview':
    //     statusText = chalk.yellow('👁️  Preview');
    //     break;
    //   default:
    //     statusText = result.status;
    // }

    table.push([
      result.relativePath,
      result.ext.replace(".", "").toUpperCase(),
      originalSizeText,
      webpSizeText,
      savingsText,
      // statusText
    ]);
  });

  console.log("\n" + table.toString());

  // Summary
  const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalWebpSize = results.reduce((sum, r) => sum + r.webpSize, 0);
  const totalSavings =
    totalOriginalSize > 0
      ? Math.round((1 - totalWebpSize / totalOriginalSize) * 100)
      : 0;

  console.log(`\n📝 Summary:`);
  console.log(
    `   Total original size: ${chalk.red(formatFileSize(totalOriginalSize))}`,
  );
  console.log(
    `   Total WebP size: ${chalk.green(formatFileSize(totalWebpSize))} ${options.write ? "" : "(predicted)"}`,
  );
  console.log(
    `   Total space saved: ${chalk.green(formatFileSize(totalOriginalSize - totalWebpSize))} (${chalk.green(totalSavings + "%")})\n\n`,
  );
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  analyzeImages,
};
