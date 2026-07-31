import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: process.env.VITE_ROCKY_WALLET_BACKEND_TARGET || 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
    fs: {
      strict: true,
    },
  },
});
