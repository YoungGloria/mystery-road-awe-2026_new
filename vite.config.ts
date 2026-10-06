import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/mystery-road-awe-2026_new/',
  plugins: [react()],
  // add input for react.html to the build options so that it is included in the build output
  build: {
    rollupOptions: {
      input: { main: 'index.html', react: 'react.html' },
    },
  },
});
