const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'src', 'static');
const publicDir = path.join(root, 'public');

if (!fs.existsSync(sourceDir)) {
  process.exit(0);
}

fs.mkdirSync(publicDir, { recursive: true });

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
  if (!entry.isFile()) {
    continue;
  }

  copyFile(path.join(sourceDir, entry.name), path.join(publicDir, entry.name));
}

for (const fileName of ['eax-rig.webp', 'eax-logo.png', 'eax-logo.webp']) {
  const source = path.join(root, 'src', 'assets', fileName);
  if (fs.existsSync(source)) {
    copyFile(source, path.join(publicDir, 'assets', fileName));
  }
}
