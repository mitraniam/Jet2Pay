import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logoSrc = resolve(__dirname, '../Logo/jet2pay_logo_019cd36e-7f02-781b-9fc0-7f3dbe0ded65.webp')
const logoDest = resolve(__dirname, 'public/logo.webp')

if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, logoDest)
}

export default defineConfig({
  plugins: [react()],
})
