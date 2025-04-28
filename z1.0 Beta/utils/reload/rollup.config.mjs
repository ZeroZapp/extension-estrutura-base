// utils/reload/rollup.config.mjs
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/utils/reload/initReloadServer.js',
  output: {
    file: 'dist/utils/reload/initReloadServer.js',
    format: 'cjs',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    terser(),
  ],
};