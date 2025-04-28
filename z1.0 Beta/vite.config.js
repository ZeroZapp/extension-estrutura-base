// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        popup: path.resolve(__dirname, 'src/pages/popup/index.html'),
        options: path.resolve(__dirname, 'src/pages/options/index.html'),
        sidepanel: path.resolve(__dirname, 'src/pages/sidepanel/index.html')
      }
    }
  }
});