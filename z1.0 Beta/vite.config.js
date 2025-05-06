// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { getCacheInvalidationKey, getPlugins } from './utils/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const pagesDir = resolve(srcDir, 'pages');

const isDev = process.env.__DEV__ === 'true' || process.env.NODE_ENV === 'development';
const isProduction = !isDev;

export default defineConfig({
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
      '@assets': resolve(srcDir, 'assets'),
      '@pages': pagesDir,
    },
  },
  plugins: [...getPlugins(isDev), react()],
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, 'dist'),
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    emptyOutDir: !isDev,
    rollupOptions: {
      input: {
        devtools: resolve(pagesDir, 'devtools', 'index.html'),
        panel: resolve(pagesDir, 'panel', 'index.html'),
        contentInjected: resolve(pagesDir, 'content', 'injected', 'index.js'),
        contentClient: resolve(pagesDir, 'content', 'client', 'index.js'),
        moduleraid: resolve(pagesDir, 'libs', 'moduleraid.js'),
        contentUI: resolve(pagesDir, 'content', 'ui', 'index.js'),
        background: resolve(pagesDir, 'background', 'index.js'),
        contentStyle: resolve(pagesDir, 'content', 'style.scss'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
        options: resolve(pagesDir, 'options', 'index.html'),
        sidepanel: resolve(pagesDir, 'sidepanel', 'index.html'),
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const { name } = path.parse(assetInfo.name);
          const assetFileName = name === 'contentStyle' ? `${name}${getCacheInvalidationKey()}` : name;
          return `assets/[ext]/${assetFileName}.chunk.[ext]`;
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.js', '**/*.test.jsx'],
    setupFiles: './test-utils/vitest.setup.js',
  },
  define: {
    global: 'window',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.__DEV__': JSON.stringify(isDev.toString()),
    'process.env.__FIREFOX__': JSON.stringify(process.env.__FIREFOX__ === 'true')
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
  esbuild: {
    drop: isDev ? [] : ['console', 'debugger'],
  },
});