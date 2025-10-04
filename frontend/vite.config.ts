import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev: все запросы на /api → http://localhost:8000
// Prod: используем относительный /api (Nginx проксирует на backend)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: '/',
})
