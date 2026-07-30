const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'src', 'static');
const publicDir = path.join(root, 'public');

if (!fs.existsSync(sourceDir)) {
  process.exit(0);
}

fs.mkdirSync(publicDir, { recursive: true });

for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
  if (!entry.isFile()) {
    continue;
  }

  fs.copyFileSync(path.join(sourceDir, entry.name), path.join(publicDir, entry.name));
}
