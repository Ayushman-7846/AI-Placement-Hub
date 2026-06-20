import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // React plugin — enables Fast Refresh and JSX transform
    react(),

    // Tailwind CSS v4 Vite plugin — replaces PostCSS approach
    // No tailwind.config.js needed; configuration lives in CSS via @theme
    tailwindcss(),
  ],

  resolve: {
    alias: {
      // Path aliases for cleaner imports
      // Usage: import { Button } from '@/components/common/Button'
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@routes': path.resolve(__dirname, './src/routes'),
    },
  },

  server: {
    port: 3000,
    strictPort: false,
    // Proxy API calls to the backend during development
    // This avoids CORS issues in development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  preview: {
    port: 3000,
  },

  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true for debugging production issues
    // Chunk size warning threshold (in kB)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        // NOTE: Vite 8 uses Rolldown — manualChunks must be a function (not object)
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) {
            return 'router';
          }
          if (id.includes('node_modules/axios')) {
            return 'http';
          }
        },
      },
    },
  },

  // Environment variables — only VITE_ prefixed vars are exposed to client
  envPrefix: 'VITE_',
});
