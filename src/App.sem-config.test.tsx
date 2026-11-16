// Spec 002-login, CA-06: sem VITE_SUPABASE_*, o client é null e a tela avisa em vez de quebrar.
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'

vi.mock('./lib/supabase', () => ({ supabase: null }))

import { App } from './App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it('CA-06: sem VITE_SUPABASE_URL/ANON_KEY a tela mostra "Login não configurado"', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({}) })))
  render(<App />)
  expect((await screen.findByRole('alert')).textContent).toBe('Login não configurado')
  expect((screen.getByRole('button', { name: 'Entrar' }) as HTMLButtonElement).disabled).toBe(true)
})
