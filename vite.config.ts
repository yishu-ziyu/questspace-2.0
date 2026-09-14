import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { splitApiPlugin } from './src/server/splitApiPlugin'

export default defineConfig(({ mode }) => {
  // Merge .env.local vars into process.env so server plugins can read them
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return { plugins: [react(), tailwindcss(), splitApiPlugin()] }
})
