const fs = require("fs");
const path = require("path");

// Set up source and destination directories
// Copy from multiple source locations
const sourceDirs = [
  path.join(__dirname, "src/app/db/assets/"),
  path.join(__dirname, "src/app/db/public/"),
  path.join(__dirname, "src/app/db/"), // Root db directory for images
];
const destDir = path.join(__dirname, "public/db-assets/");
const dbRoot = path.join(__dirname, "src/app/db/");
const dbAssetsRoot = path.join(dbRoot, "assets");
const dbPublicRoot = path.join(dbRoot, "public");

// `sourceDirs` copies `db/assets/` and `db/public/` first (flat / preserved layout).
// When we later walk `db/`, skipping these dirs avoids duplicating every file under
// `public/db-assets/assets/…` and `public/db-assets/public/…`.
const skipDuplicateRootDirs = new Set();
if (fs.existsSync(dbAssetsRoot)) skipDuplicateRootDirs.add("assets");
if (fs.existsSync(dbPublicRoot)) skipDuplicateRootDirs.add("public");

// These extensions will be copied; all others will be skipped
const allowedExtensions = [
  ".ico",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp", // Include all common image formats
  ".mp4",
  ".webm",
  ".mov", // Include video formats
];

// Size limits (override on Vercel / CI via env)
function mbToBytes(mb) {
  const n = Number(mb);
  return Number.isFinite(n) && n > 0 ? Math.floor(n * 1024 * 1024) : null;
}

// Images / non-video media (large PNG/JPEG scans, GIFs)
const MAX_IMAGE_BYTES =
  mbToBytes(process.env.MOVE_ASSETS_MAX_IMAGE_MB) ?? 25 * 1024 * 1024;
// Video
const MAX_VIDEO_BYTES =
  mbToBytes(process.env.MOVE_ASSETS_MAX_VIDEO_MB) ?? 50 * 1024 * 1024;

// Set to true to normalize filenames (removes spaces, special chars)
// NOTE: If enabled, you'll need to update markdown references to use normalized names
// OR implement a runtime lookup using the mapping file
const NORMALIZE_FILENAMES = process.env.NORMALIZE_ASSETS === "true" || false;

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Filter out source directories that don't exist
const existingSourceDirs = sourceDirs.filter((dir) => fs.existsSync(dir));
if (existingSourceDirs.length === 0) {
  console.warn(
    `No source directories found. Creating empty destination directory.`
  );
  process.exit(0); // Exit successfully to not break the build
}

// Statistics
let totalFilesProcessed = 0;
let totalFilesCopied = 0;
let totalFilesSkipped = 0;
let totalBytesCopied = 0;

// Mapping of original filenames to normalized filenames
// This can be used to update markdown references if needed
const filenameMapping = {};

// Function to normalize filenames to URL-safe versions
// Converts: "CleanShot 2026-01-20 at 15.23.54.mp4" -> "cleanshot-2026-01-20-at-15-23-54.mp4"
function normalizeFilename(filename) {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  
  // Convert to lowercase, replace spaces and special chars with hyphens
  // Remove multiple consecutive hyphens, trim hyphens from start/end
  const normalized = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
  
  return normalized + ext;
}

// Check if a file should be copied
// A list of essential media files we want to include even if they are in subdirectories
const ESSENTIAL_FILES = [
  "favicon.ico",
  "logo.png",
  "icon.png",
  "site-icon.png",
  "IFTTT_Maker_Platform_Screenshot.png", // Key screenshot for project
];

// Directories to completely skip
const SKIP_DIRECTORIES = [
  "large-media",
  "videos",
  "backgrounds",
  // Allow media directory
];

function shouldCopyFile(filePath) {
  try {
    // Check if file is in a directory we want to skip entirely
    for (const skipDir of SKIP_DIRECTORIES) {
      if (filePath.includes(`/${skipDir}/`)) {
        console.log(
          `Skipping file in excluded directory ${skipDir}: ${filePath}`
        );
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

    // Check file size - use larger limit for video files
    const stats = fs.statSync(filePath);
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
    const isVideo = videoExtensions.includes(ext);
    const maxSize = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    
    if (stats.size > maxSize) {
      console.log(
        `Skipping file larger than ${maxSize / (1024 * 1024)}MB: ${filePath}`
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Error checking file ${filePath}:`, err.message);
    return false;
  }
}

function copyFiles(src, dest, isRootDbDir = false) {
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
          // For root db directory, recurse into subdirectories to find media files
          // but skip markdown/content directories that don't contain media
          // For assets/ and public/ directories, recurse normally
          if (!isRootDbDir) {
            copyFiles(srcFile, destFile, false);
          } else {
            // For root db dir, recurse into subdirectories to find media files
            const dirName = path.basename(srcFile);
            const skipContentDirs = [
              "node_modules",
              ".git",
              ".github",
              ".nova",
            ];
            if (skipDuplicateRootDirs.has(dirName)) {
              console.log(
                `Skipping ${dirName}/ (already copied from dedicated src/app/db/${dirName}/ pass)`
              );
              totalFilesSkipped++;
            } else if (!skipContentDirs.includes(dirName)) {
              // Preserve journals/, 3-artifacts/, projects/, etc. under db-assets
              copyFiles(srcFile, path.join(dest, dirName), false);
            } else {
              console.log(`Skipping content directory: ${srcFile}`);
              totalFilesSkipped++;
            }
          }
        } else {
          if (shouldCopyFile(srcFile)) {
            const originalFilename = path.basename(srcFile);
            let finalFilename = originalFilename;
            
            // Normalize filename if enabled
            if (NORMALIZE_FILENAMES) {
              finalFilename = normalizeFilename(originalFilename);
              
              // Store mapping if filename changed
              if (originalFilename !== finalFilename) {
                const relativePath = path.relative(path.join(__dirname, "src/app/db"), srcFile);
                filenameMapping[originalFilename] = finalFilename;
                filenameMapping[relativePath] = finalFilename;
              }
            }
            
            // Root db: only loose files in db/ go directly under db-assets/; subtrees use destFile layout
            // assets/ and public/: preserve directory structure
            let finalDestFile;
            if (isRootDbDir) {
              finalDestFile = path.join(dest, finalFilename);
            } else {
              const dir = path.dirname(destFile);
              finalDestFile = path.join(dir, finalFilename);
            }
            
            fs.copyFileSync(srcFile, finalDestFile);
            const fileSize = fs.statSync(srcFile).size;
            totalBytesCopied += fileSize;
            totalFilesCopied++;
            
            if (NORMALIZE_FILENAMES && originalFilename !== finalFilename) {
              console.log(
                `Copied and normalized: ${originalFilename} -> ${finalFilename} (${(fileSize / 1024).toFixed(2)} KB)`
              );
            } else {
              console.log(
                `Copied ${srcFile} to ${finalDestFile} (${(fileSize / 1024).toFixed(2)} KB)`
              );
            }
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

console.log(
  `Starting asset copy from ${existingSourceDirs.length} source directory(ies) to ${destDir}...`
);
console.log(`Source directories: ${existingSourceDirs.join(", ")}`);
console.log(
  `Only copying files with these extensions: ${allowedExtensions.join(", ")}`
);
console.log(
  `Max image/other media: ${MAX_IMAGE_BYTES / (1024 * 1024)} MB (set MOVE_ASSETS_MAX_IMAGE_MB); max video: ${MAX_VIDEO_BYTES / (1024 * 1024)} MB (MOVE_ASSETS_MAX_VIDEO_MB)`
);

/** Old root-db pass mirrored all of `db/assets/` → `public/db-assets/assets/`. That duplicated the flat layout from the dedicated `db/assets/` pass. Remove only those top-level dirs so stale copies do not linger. */
function removeLegacyDuplicateTopLevelDirs() {
  if (skipDuplicateRootDirs.has("assets")) {
    const legacy = path.join(destDir, "assets");
    if (fs.existsSync(legacy)) {
      fs.rmSync(legacy, { recursive: true, force: true });
      console.log(
        "Removed stale public/db-assets/assets/ (legacy mirror of db/assets/)"
      );
    }
  }
  if (skipDuplicateRootDirs.has("public")) {
    const legacy = path.join(destDir, "public");
    if (fs.existsSync(legacy)) {
      fs.rmSync(legacy, { recursive: true, force: true });
      console.log(
        "Removed stale public/db-assets/public/ (legacy mirror of db/public/)"
      );
    }
  }
}

removeLegacyDuplicateTopLevelDirs();

const startTime = Date.now();
// Copy from each source directory
existingSourceDirs.forEach((sourceDir) => {
  console.log(`\nCopying from: ${sourceDir}`);
  // Check if this is the root db directory (not assets/ or public/)
  const isRootDbDir = sourceDir === dbRoot;
  copyFiles(sourceDir, destDir, isRootDbDir);
});
const endTime = Date.now();

console.log("==== Asset copy complete ====");
console.log(`Files processed: ${totalFilesProcessed}`);
console.log(`Files copied: ${totalFilesCopied}`);
console.log(`Files skipped: ${totalFilesSkipped}`);
console.log(
  `Total bytes copied: ${totalBytesCopied} (${(
    totalBytesCopied /
    (1024 * 1024)
  ).toFixed(2)} MB)`
);
console.log(`Time taken: ${((endTime - startTime) / 1000).toFixed(2)} seconds`);

// Save filename mapping to a JSON file for reference (only if normalization is enabled)
// This can be used to update markdown references or implement runtime lookup
if (NORMALIZE_FILENAMES && Object.keys(filenameMapping).length > 0) {
  const mappingFile = path.join(__dirname, "public/db-assets", ".filename-mapping.json");
  fs.writeFileSync(mappingFile, JSON.stringify(filenameMapping, null, 2));
  console.log(`\nFilename mapping saved to: ${mappingFile}`);
  console.log(`Total files normalized: ${Object.keys(filenameMapping).length}`);
  console.log(`\n⚠️  NOTE: Markdown files still reference original filenames.`);
  console.log(`   You'll need to either:`);
  console.log(`   1. Update markdown references to use normalized names, or`);
  console.log(`   2. Implement runtime lookup using the mapping file`);
}
