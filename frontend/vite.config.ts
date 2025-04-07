import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/travel-activity-finder/',
  root: './', // Root is the project directory
  build: {
    rollupOptions: {
      input: './public/index.html' // Point to public/index.html
    },
    outDir: 'dist' // Ensure output goes to dist/
  }
});