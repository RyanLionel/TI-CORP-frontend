// Spec 002-login: dublê do Supabase (ADR-004); nenhum teste chama rede.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { Session } from '@supabase/supabase-js'

type Ouvinte = (evento: string, session: Session | null) => void

const auth = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
}))
vi.mock('./lib/supabase', () => ({ supabase: { auth } }))

import { App } from './App'

const sessao = (email: string) => ({ user: { email }, access_token: 'tok' }) as unknown as Session
let ouvinte: Ouvinte = () => {}

beforeEach(() => {
  // /health responde o status; a área logada recebe catálogo e empréstimos vazios.
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => ({
      ok: true,
      json: async () => (String(url).endsWith('/health') ? { status: 'ok', database: 'up' } : []),
    })),
  )
  auth.getSession.mockResolvedValue({ data: { session: null } })
  auth.onAuthStateChange.mockImplementation((cb: Ouvinte) => {
    ouvinte = cb
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  })
  auth.signOut.mockImplementation(async () => {
    ouvinte('SIGNED_OUT', null)
    return { error: null }
  })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

// Espera o formulário: o app começa em "Carregando…" enquanto lê a sessão.
async function preencherEEntrar(email: string, senha: string) {
  fireEvent.change(await screen.findByLabelText('E-mail corporativo'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: senha } })
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('login', () => {
  it('CA-01: e-mail e senha válidos levam à área logada, com o e-mail e o botão Sair', async () => {
    auth.signInWithPassword.mockImplementation(async () => {
      ouvinte('SIGNED_IN', sessao('ryan@exemplo.local'))
      return { data: {}, error: null }
    })
    render(<App />)
    await preencherEEntrar('ryan@exemplo.local', 'segredo')
    expect(await screen.findByRole('button', { name: 'Sair' })).toBeTruthy()
    expect(screen.getByText('ryan@exemplo.local')).toBeTruthy()
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: 'ryan@exemplo.local', password: 'segredo' })
  })

  it('CA-02: credencial recusada mostra "E-mail ou senha incorretos" e mantém o login', async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: { code: 'invalid_credentials', status: 400 } })
    render(<App />)
    await preencherEEntrar('ryan@exemplo.local', 'errada')
    expect((await screen.findByRole('alert')).textContent).toBe('E-mail ou senha incorretos')
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull()
  })

  it('CA-02: falha que não é de credencial mostra a mensagem geral', async () => {
    auth.signInWithPassword.mockRejectedValue(new Error('rede'))
    render(<App />)
    await preencherEEntrar('ryan@exemplo.local', 'qualquer')
    expect((await screen.findByRole('alert')).textContent).toBe('Não foi possível entrar. Tente de novo.')
  })

  it('CA-02: erro 400 que não é de credencial (e-mail não confirmado) mostra a mensagem geral', async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: { code: 'email_not_confirmed', status: 400 } })
    render(<App />)
    await preencherEEntrar('ryan@exemplo.local', 'certa')
    expect((await screen.findByRole('alert')).textContent).toBe('Não foi possível entrar. Tente de novo.')
  })

  it('CA-03: com sessão já existente, abre direto na área logada', async () => {
    auth.getSession.mockResolvedValue({ data: { session: sessao('ryan@exemplo.local') } })
    render(<App />)
    expect(await screen.findByRole('button', { name: 'Sair' })).toBeTruthy()
    expect(screen.queryByLabelText('E-mail corporativo')).toBeNull()
  })

  it('CA-04: Sair encerra a sessão e volta para o login', async () => {
    auth.getSession.mockResolvedValue({ data: { session: sessao('ryan@exemplo.local') } })
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: 'Sair' }))
    expect(await screen.findByLabelText('E-mail corporativo')).toBeTruthy()
    expect(auth.signOut).toHaveBeenCalledTimes(1)
  })

  it('CA-05: a tela de login não tem "Entrar como Operações" e segue o PRD (5 itens, 14 dias úteis)', async () => {
    render(<App />)
    await screen.findByLabelText('E-mail corporativo')
    expect(screen.queryByRole('button', { name: /Operações/ })).toBeNull()
    expect(screen.getByText(/Até 5 itens por pessoa, com prazo de 14 dias úteis/)).toBeTruthy()
    expect(screen.getByText('dias úteis de prazo')).toBeTruthy()
    await waitFor(() => expect(screen.getByText('API ok · banco up')).toBeTruthy())
  })

  it('CA-07 (spec 001): resposta 401 da API encerra a sessão e volta para a tela de login', async () => {
    auth.getSession.mockResolvedValue({ data: { session: sessao('ryan@exemplo.local') } })
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        String(url).endsWith('/health')
          ? { ok: true, status: 200, json: async () => ({ status: 'ok', database: 'up' }) }
          : { ok: false, status: 401, json: async () => ({ message: 'Sessão inválida' }) },
      ),
    )
    render(<App />)
    expect(await screen.findByLabelText('E-mail corporativo')).toBeTruthy()
    expect(auth.signOut).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull()
  })
})
