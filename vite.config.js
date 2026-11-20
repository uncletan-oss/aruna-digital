import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // BASE_PATH dipakai untuk GitHub Pages di sub-path (mis. /aruna-digital/)
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: {
    sourcemap: false,
    cssCodeSplit: true,
  },
  ssr: {
    // dibundel ke entry-server agar tidak bergantung pada format ESM/CJS paket
    noExternal: ['react-helmet-async'],
  },
});
