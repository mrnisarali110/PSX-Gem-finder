import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This prevents "process is not defined" errors in the browser
    // since the code references process.env.API_KEY
    'process.env': {} 
  }
})