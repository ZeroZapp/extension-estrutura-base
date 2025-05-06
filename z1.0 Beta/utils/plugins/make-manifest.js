import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import colorLog from '../log.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const distDir = path.resolve(rootDir, 'dist');

export default function makeManifest(config) {
  function generateManifest(manifest, to, cacheKey) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to, { recursive: true });
    }

    const manifestPath = path.join(to, 'manifest.json');

    if (cacheKey && manifest.content_scripts) {
      manifest.content_scripts.forEach(script => {
        if (script.css) {
          script.css = script.css.map(css =>
            css.replace('<KEY>', cacheKey)
          );
        }
      });
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    colorLog(`✅ Manifest file created: ${manifestPath}`, 'success');
  }

  return {
    name: 'make-manifest',
    buildStart() {
      this.addWatchFile(path.join(rootDir, 'manifest.js'));
    },
    async writeBundle() {
      const cacheKey = config?.getCacheInvalidationKey?.();

      try {
        const { default: manifest } = await import(
          `file://${path.join(rootDir, 'manifest.js')}?t=${Date.now()}`
        );
        generateManifest(manifest, distDir, cacheKey);
      } catch (err) {
        colorLog(`❌ Failed to load manifest.js: ${err.message}`, 'error');
      }
    }
  };
}
