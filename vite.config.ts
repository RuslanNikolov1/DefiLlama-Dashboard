import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // optional: raise threshold for warnings
    rollupOptions: {
      output: {
        manualChunks: {
          // Split major libs into separate chunks
          react: ['react', 'react-dom'],
          recharts: ['recharts'],
          vendor: [
            'axios',
            'react-router-dom',
            'classnames',
            // add other big libs you see in node_modules
          ],
        },
      },
    },
  },
});
