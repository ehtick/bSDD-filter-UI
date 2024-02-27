/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './bsdd_search',
  base: './',
  server: {
    port: 3000,
  },
  build: {
    outDir: '../dist/bsdd_search',
    // assetsDir: '',
    lib: {
      entry: 'src/lib/index.tsx',
      name: 'BsddSearch',
      fileName: 'react-bsdd-search',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  plugins: [react()],
  preview: {
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
