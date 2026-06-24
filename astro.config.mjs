// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 4321,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4321,
    strictPort: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
