import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['three'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js and 3D libs in their own chunk — largest dependency, deferred from critical path
          'three': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          // Spline scene loader
          'spline': ['@splinetool/react-spline', '@splinetool/runtime'],
          // Gemini AI SDK
          'gemini': ['@google/generative-ai'],
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation
          'vendor-motion': ['framer-motion'],
          // UI utilities
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
})
