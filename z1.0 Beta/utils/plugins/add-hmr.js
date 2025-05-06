import * as path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DUMMY_CODE = `export default function(){};`;

function getInjectionCode(fileName) {
  return readFileSync(path.resolve(__dirname, '..', 'reload', 'injections', fileName), { encoding: 'utf8' });
}

export default function addHmr(config) {
  const { background, view, isDev } = config;
  const idInBackgroundScript = 'virtual:reload-on-update-in-background-script';
  const idInView = 'virtual:reload-on-update-in-view';

  const scriptHmrCode = isDev ? getInjectionCode('script.js') : DUMMY_CODE;
  const viewHmrCode = isDev ? getInjectionCode('view.js') : DUMMY_CODE;

  return {
    name: 'add-hmr',
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
      return null;
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }

      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
      return null;
    },
  };
}

function getResolvedId(id) {
  return '\0' + id;
}