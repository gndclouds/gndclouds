const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "src/app/db/assets/");
const destDir = path.join(__dirname, "public/db-assets/");

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.warn(`Source directory does not exist: ${sourceDir}`);
  console.log("Creating empty destination directory instead");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  process.exit(0); // Exit successfully to not break the build
}

function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  try {
    fs.readdirSync(src).forEach((file) => {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);

      try {
        if (fs.lstatSync(srcFile).isDirectory()) {
          copyFiles(srcFile, destFile);
        } else {
          fs.copyFileSync(srcFile, destFile);
          console.log(`Copied ${srcFile} to ${destFile}`);
        }
      } catch (err) {
        console.error(`Error processing file ${srcFile}:`, err.message);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${src}:`, err.message);
  }
}

copyFiles(sourceDir, destDir);
console.log("Assets moved to public directory.");
