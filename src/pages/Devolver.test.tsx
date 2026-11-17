// Spec 003 do front · devolver empréstimo. API e Supabase como dublês (ADR-004); nenhum teste chama rede.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { Equipamento, MeuEmprestimo } from '../lib/api'

const auth = vi.hoisted(() => ({ signOut: vi.fn() }))
vi.mock('../lib/supabase', () => ({ supabase: { auth } }))

import { Area } from './Area'

const EQUIPAMENTOS: Equipamento[] = [
  { id: 'e1', nome: 'Notebook 14 polegadas', categoria: 'notebook', patrimonio: 'TI-0001', situacao: 'emprestado', imagem: null },
  { id: 'e5', nome: 'Webcam Full HD', categoria: 'camera', patrimonio: 'TI-0011', situacao: 'emprestado', imagem: null },
]
const MEUS: MeuEmprestimo[] = [
  { id: 'l1', equipmentId: 'e1', dueAt: '2026-12-04T15:00:00.000Z', atrasado: false },
  { id: 'l2', equipmentId: 'e5', dueAt: '2026-12-04T15:00:00.000Z', atrasado: false },
]

type Resposta = { status: number; body: unknown }
let rotas: Record<string, Resposta>
let chamadas: { url: string; init?: RequestInit }[]

beforeEach(() => {
  chamadas = []
  rotas = {
    'GET /equipments': { status: 200, body: EQUIPAMENTOS },
    'GET /loans/me': { status: 200, body: MEUS },
    'POST /loans/l1/return': { status: 200, body: { id: 'l1', returnedAt: '2026-11-17T13:00:00.000Z' } },
  }
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      chamadas.push({ url, init })
      const { status, body } = rotas[`${init?.method ?? 'GET'} ${url}`] ?? { status: 404, body: { message: 'rota de teste ausente' } }
      return { ok: status >= 200 && status < 300, status, json: async () => body }
    }),
  )
  auth.signOut.mockResolvedValue({ error: null })
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

const renderArea = () => render(<Area email="ryan@exemplo.local" token="tok-123" />)

describe('devolver (spec 003 do front)', () => {
  it('CA-01: cada empréstimo listado tem o botão "Devolver {nome}"', async () => {
    renderArea()
    expect(await screen.findByRole('button', { name: 'Devolver Notebook 14 polegadas' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Devolver Webcam Full HD' })).toBeTruthy()
  })

  it('CA-02: o clique envia POST /loans/{id}/return com o token, mostra "Devolução registrada." e recarrega as listas', async () => {
    renderArea()
    fireEvent.click(await screen.findByRole('button', { name: 'Devolver Notebook 14 polegadas' }))
    expect(await screen.findByText('Devolução registrada.')).toBeTruthy()
    const post = chamadas.find((c) => c.url === '/loans/l1/return')
    expect(post?.init?.method).toBe('POST')
    expect((post?.init?.headers as Record<string, string>).Authorization).toBe('Bearer tok-123')
    const depois = chamadas.slice(chamadas.indexOf(post!) + 1).map((c) => c.url)
    expect(depois).toEqual(expect.arrayContaining(['/equipments', '/loans/me']))
  })

  it('CA-03: recusa da API aparece no alerta com o motivo, sem reescrita', async () => {
    rotas['POST /loans/l1/return'] = { status: 409, body: { message: 'Empréstimo já devolvido' } }
    renderArea()
    fireEvent.click(await screen.findByRole('button', { name: 'Devolver Notebook 14 polegadas' }))
    expect((await screen.findByRole('alert')).textContent).toBe('Empréstimo já devolvido')
  })

  it('CA-04: 401 na devolução encerra a sessão', async () => {
    rotas['POST /loans/l1/return'] = { status: 401, body: { message: 'Sessão inválida' } }
    renderArea()
    fireEvent.click(await screen.findByRole('button', { name: 'Devolver Notebook 14 polegadas' }))
    await waitFor(() => expect(auth.signOut).toHaveBeenCalledTimes(1))
  })
})
