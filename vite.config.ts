import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],
  define:{
    'process.env.VITE_CLIENT_ID': JSON.stringify(process.env.VITE_CLIENT_ID),
    'process.env.VITE_CLIENT_SECRET': JSON.stringify(process.env.VITE_CLIENT_SECRET)
  }
  
})
