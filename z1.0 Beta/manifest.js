import fs from 'node:fs';
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: '__MSG_extensionName__',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  permissions: ['storage', 'sidePanel', 'alarms', 'tabs', 'activeTab', 'scripting'],
  side_panel: {
    default_path: 'src/pages/sidepanel/index.html',
  },
  options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  action: {
    default_icon: 'icon-34.png',
  },
  icons: {
    128: 'icon-128.png',
  },
  content_scripts: [
    {
      matches: ['*://web.whatsapp.com/*', '*://*.dash.z0z.app/*'],
      js: ['src/pages/contentInjected/index.js'],
      // KEY for cache invalidation
      css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
    {
      matches: ['*://web.whatsapp.com/*', '*://*.dash.z0z.app/*'],
      js: ['src/pages/contentUI/index.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'src/pages/contentInjectedClient/index.js',
        'src/pages/moduleraid/index.js',
        'assets/js/*.js',
        'assets/css/*.css',
        'icon-128.png',
        'icon-34.png',
      ],
      matches: ['*://web.whatsapp.com/*', '*://*.dash.z0z.app/*'],
    },
  ],
  host_permissions: ['https://web.whatsapp.com/*'],
};

// Escreve o manifest.json no diretório de saída
const outDir = './dist';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(
  `${outDir}/manifest.json`,
  JSON.stringify(manifest, null, 2)
);

export default manifest;
