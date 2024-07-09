import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/


export default defineConfig({
  // plugins: [react()],
  build: {
    plugins: [react()],
    chunkSizeWarningLimit: 1000, // Adjust this value as needed
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'],
          moment: ['moment'],
          // Add other manual chunks as needed
        }
      }
    }
  }
});
