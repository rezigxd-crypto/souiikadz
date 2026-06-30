import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':        path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context':   path.resolve(__dirname, './src/context'),
      '@pages':     path.resolve(__dirname, './src/pages'),
      '@hooks':     path.resolve(__dirname, './src/hooks'),
      '@data':      path.resolve(__dirname, './src/data'),
      '@lib':       path.resolve(__dirname, './src/lib'),
      '@i18n':      path.resolve(__dirname, './src/i18n'),
      '@assets':    path.resolve(__dirname, './src/assets'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':    ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor':   ['framer-motion'],
          'icons-vendor':    ['lucide-react'],
          'seo-vendor':      ['react-helmet-async'],
        },
      },
    },
  },
})
