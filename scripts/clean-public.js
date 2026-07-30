const fs = require('node:fs');
const path = require('node:path');

fs.rmSync(path.resolve(__dirname, '..', 'public'), {
  recursive: true,
  force: true,
});
