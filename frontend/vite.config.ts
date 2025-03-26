// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Фронтенд будет работать на порту 3001
    proxy: {
      // Проксирование запросов API на бэкенд
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});