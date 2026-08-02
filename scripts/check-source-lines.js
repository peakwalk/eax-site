const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const maxFileLines = 420;
const maxTotalLines = 1800;
const includedRoots = ['src', 'scripts', '.github/workflows'];
const includedRootFiles = ['package.json', 'README.md'];
const sourceExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.yml', '.xml', '.txt']);
const ignoredSegments = new Set(['node_modules', 'public', '.parcel-cache', '.git', 'generated']);

function isIgnored(filePath) {
  return path.relative(root, filePath).split(path.sep).some((part) => ignoredSegments.has(part));
}

function collectFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (isIgnored(fullPath)) {
      continue;
    }
    if (entry.isDirectory()) {
      collectFiles(fullPath, files);
      continue;
    }
    if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = [
  ...includedRoots.flatMap((dir) => collectFiles(path.join(root, dir))),
  ...includedRootFiles.map((file) => path.join(root, file)).filter((file) => fs.existsSync(file)),
].sort();

let total = 0;
const failures = [];

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).length;
  total += lines;
  if (lines > maxFileLines) {
    failures.push(`${path.relative(root, file)} has ${lines} lines, max ${maxFileLines}`);
  }
}

if (total > maxTotalLines) {
  failures.push(`tracked source has ${total} lines, max ${maxTotalLines}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Source line limits passed: ${files.length} files, ${total} lines.`);
