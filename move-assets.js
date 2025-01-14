const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "src/app/db/public/");
const destDir = path.join(__dirname, "public/assets/media/");

function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyFiles(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

copyFiles(sourceDir, destDir);
console.log("Assets moved to public directory.");
