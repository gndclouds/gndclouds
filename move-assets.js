const fs = require("fs");
const path = require("path");

// Set up source and destination directories
const sourceDir = path.join(__dirname, "src/app/db/assets/");
const destDir = path.join(__dirname, "public/db-assets/");

// These extensions will be copied; all others will be skipped
const allowedExtensions = [
  '.ico', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp' // Include all common image formats
];

// Maximum size in bytes for files to copy (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.warn(`Source directory does not exist: ${sourceDir}`);
  console.log("Creating empty destination directory instead");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  process.exit(0); // Exit successfully to not break the build
}

// Statistics
let totalFilesProcessed = 0;
let totalFilesCopied = 0;
let totalFilesSkipped = 0;
let totalBytesCopied = 0;

// Check if a file should be copied
// A list of essential media files we want to include even if they are in subdirectories
const ESSENTIAL_FILES = [
  'favicon.ico',
  'logo.png',
  'icon.png',
  'site-icon.png',
  'IFTTT_Maker_Platform_Screenshot.png' // Key screenshot for project
];

// Directories to completely skip
const SKIP_DIRECTORIES = [
  'large-media',
  'videos',
  'backgrounds'
  // Allow media directory
];

function shouldCopyFile(filePath) {
  try {
    // Check if file is in a directory we want to skip entirely
    for (const skipDir of SKIP_DIRECTORIES) {
      if (filePath.includes(`/${skipDir}/`)) {
        console.log(`Skipping file in excluded directory ${skipDir}: ${filePath}`);
        return false;
      }
    }
    
    // Always include essential files
    const fileName = path.basename(filePath);
    if (ESSENTIAL_FILES.includes(fileName)) {
      return true;
    }
    
    // Check extension
    const ext = path.extname(filePath).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      console.log(`Skipping file with disallowed extension: ${filePath}`);
      return false;
    }
    
    // Check file size
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      console.log(`Skipping file larger than ${MAX_FILE_SIZE} bytes: ${filePath}`);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error(`Error checking file ${filePath}:`, err.message);
    return false;
  }
}

function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  try {
    fs.readdirSync(src).forEach((file) => {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      totalFilesProcessed++;

      try {
        if (fs.lstatSync(srcFile).isDirectory()) {
          copyFiles(srcFile, destFile);
        } else {
          if (shouldCopyFile(srcFile)) {
            fs.copyFileSync(srcFile, destFile);
            const fileSize = fs.statSync(srcFile).size;
            totalBytesCopied += fileSize;
            totalFilesCopied++;
            console.log(`Copied ${srcFile} to ${destFile} (${(fileSize / 1024).toFixed(2)} KB)`);
          } else {
            totalFilesSkipped++;
          }
        }
      } catch (err) {
        console.error(`Error processing file ${srcFile}:`, err.message);
        totalFilesSkipped++;
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${src}:`, err.message);
  }
}

console.log(`Starting asset copy from ${sourceDir} to ${destDir}...`);
console.log(`Only copying files with these extensions: ${allowedExtensions.join(', ')}`);
console.log(`Maximum file size: ${MAX_FILE_SIZE / (1024 * 1024)} MB`);

const startTime = Date.now();
copyFiles(sourceDir, destDir);
const endTime = Date.now();

console.log("==== Asset copy complete ====");
console.log(`Files processed: ${totalFilesProcessed}`);
console.log(`Files copied: ${totalFilesCopied}`);
console.log(`Files skipped: ${totalFilesSkipped}`);
console.log(`Total bytes copied: ${totalBytesCopied} (${(totalBytesCopied / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`Time taken: ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
