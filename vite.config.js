import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor code into separate chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // GSAP
            if (id.includes('gsap') || id.includes('@gsap')) {
              return 'vendor-gsap';
            }
            // Locomotive Scroll
            if (id.includes('locomotive-scroll')) {
              return 'vendor-locomotive';
            }
            // All other node_modules
            return 'vendor-other';
          }
        },
        // Ensure consistent chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'gsap',
      '@gsap/react',
      'locomotive-scroll'
    ]
  }
})
