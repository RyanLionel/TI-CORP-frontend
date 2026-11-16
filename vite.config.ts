import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Em desenvolvimento, a API local (repo back) responde em localhost:3000.
const api = 'http://localhost:3000'
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/health': api, '/equipments': api, '/loans': api } },
})
