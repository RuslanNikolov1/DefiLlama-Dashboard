import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    outDir: 'public',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split major libs into separate chunks
          react: ['react', 'react-dom'],
          recharts: ['recharts'],
          vendor: [
            'axios',
            'react-router-dom',
            'framer-motion',
            '@tanstack/react-query',
            '@tanstack/react-table'
          ],
        },
      },
    },
  }
})
