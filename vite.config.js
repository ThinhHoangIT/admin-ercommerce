import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    target: 'esnext', // Bạn có thể chọn target theo nhu cầu của dự án
    minify: 'esbuild',
    sourcemap: false,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '~': path.resolve(__dirname, './'),
    },
  },
});
