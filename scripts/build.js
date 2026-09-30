/**
 * Build Script
 *
 * What it does:
 *   - Creates a clean `dist/` output directory
 *   - Copies all static assets (HTML, CSS, JS, images) into dist/
 *
 * In a real project this is where you would:
 *   - Minify HTML/CSS/JS
 *   - Bundle JavaScript modules
 *   - Optimise images
 *   - Inject cache-busting hashes into filenames
 *
 * Run with: node scripts/build.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(SRC_DIR, 'dist');

// Files / folders to copy into dist/
const INCLUDE = ['index.html', 'styles.css', 'assets'];

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ✔ Copied: ${path.relative(SRC_DIR, src)}`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else copyFile(srcPath, destPath);
  }
}

function build() {
  console.log('🏗️  Build started...\n');

  // 1. Clean dist/
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
    console.log('🗑️  Cleaned old dist/\n');
  }

  // 2. Copy assets
  for (const item of INCLUDE) {
    const src = path.join(SRC_DIR, item);
    const dest = path.join(DIST_DIR, item);

    if (!fs.existsSync(src)) {
      console.log(`  ⏭  Skipped (not found): ${item}`);
      continue;
    }

    const stat = fs.statSync(src);
    if (stat.isDirectory()) copyDir(src, dest);
    else copyFile(src, dest);
  }

  console.log('\n✅ Build complete! Output: dist/');
}

build();
