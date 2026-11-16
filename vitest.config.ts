import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// ADR-004: Vitest + jsdom. Testes do front não chamam API nem Supabase (rules/tests.md).
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', include: ['src/**/*.test.tsx', 'src/**/*.test.ts'] },
})
