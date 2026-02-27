import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/crosswalks': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/alerts': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ai': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/output_images': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
