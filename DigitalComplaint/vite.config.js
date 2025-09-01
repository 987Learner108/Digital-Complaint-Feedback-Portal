import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/dist' // Output to backend's dist folder
  },
  server: {
    port: 3000
  }
})
