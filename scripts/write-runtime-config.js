const fs = require('node:fs');
const path = require('node:path');

const generatedDir = path.resolve(__dirname, '..', 'src', 'generated');
const runtimeConfigPath = path.join(generatedDir, 'runtime-config.js');

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const config = {
  FOUNDING_SUPPLIER_API_URL:
    clean(process.env.EAX_FOUNDING_SUPPLIER_API_URL) ||
    clean(process.env.FOUNDING_SUPPLIER_API_URL) ||
    clean(process.env.EARLY_ACCESS_API_URL),
};

const entries = Object.entries(config)
  .filter(([, value]) => value)
  .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`);

const source = `window.__EAX_RUNTIME_CONFIG__ = Object.freeze({\n${entries.join(',\n')}\n});\n`;

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(runtimeConfigPath, source, 'utf8');
