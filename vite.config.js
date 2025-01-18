import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['react', 'react-dom'], // Add external modules as needed
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Example alias
    },
  },
});

