const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting build optimization...');

// 1. Create a copy of the content that we'll use for the static site
const staticContentDir = path.join(__dirname, 'static-content');
if (fs.existsSync(staticContentDir)) {
  console.log('Cleaning up previous static content...');
  fs.rmSync(staticContentDir, { recursive: true, force: true });
}

// 2. Create directories for content
fs.mkdirSync(staticContentDir, { recursive: true });
fs.mkdirSync(path.join(staticContentDir, 'src', 'app', 'db', 'projects'), { recursive: true });
fs.mkdirSync(path.join(staticContentDir, 'src', 'app', 'db', 'notes'), { recursive: true });
fs.mkdirSync(path.join(staticContentDir, 'src', 'app', 'db', 'newsletters'), { recursive: true });

// 3. Copy only essential content
console.log('Copying only essential content...');

// Copy markdown files
['projects', 'notes', 'newsletters'].forEach(dir => {
  const sourceDir = path.join(__dirname, 'src', 'app', 'db', dir);
  const destDir = path.join(staticContentDir, 'src', 'app', 'db', dir);
  
  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      if (file.endsWith('.md')) {
        fs.copyFileSync(
          path.join(sourceDir, file),
          path.join(destDir, file)
        );
        console.log(`Copied ${file}`);
      }
    });
  }
});

// 4. Create a simplified next.config.js for static export
const nextConfig = `
module.exports = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
};
`;

fs.writeFileSync(
  path.join(staticContentDir, 'next.config.js'),
  nextConfig
);

console.log('Created optimized next.config.js for static export');

// 5. Create a script to build and deploy the static site
const buildScript = `
#!/bin/bash
# Copy the current source code to the static directory
cp -r src/components static-content/src/
cp -r src/queries static-content/src/
cp -r public static-content/

# Exclude large assets
rm -rf static-content/public/db-assets
rm -rf static-content/public/backgrounds
rm -rf static-content/public/me

# Enter the static content directory and build
cd static-content
npm ci --omit=dev
NEXT_PUBLIC_STATIC_EXPORT=true next build
next export -o ../out

# The static site is now in the 'out' directory
echo "Static site generated in 'out' directory"
`;

fs.writeFileSync(
  path.join(__dirname, 'build-static.sh'),
  buildScript
);
fs.chmodSync(path.join(__dirname, 'build-static.sh'), 0o755);

console.log('Created build-static.sh script');
console.log('Run ./build-static.sh to build a static version of your site');