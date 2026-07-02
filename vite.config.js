import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// aksworns22.github.io is a user/organization page → served from the domain root,
// so the base path is '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
