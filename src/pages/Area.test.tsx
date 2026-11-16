// Spec 001 do front: API e Supabase como dublês (ADR-004); nenhum teste chama rede.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { Equipamento, MeuEmprestimo } from '../lib/api'

const auth = vi.hoisted(() => ({ signOut: vi.fn() }))
vi.mock('../lib/supabase', () => ({ supabase: { auth } }))

import { Area } from './Area'

const EQUIPAMENTOS: Equipamento[] = [
  { id: 'e1', nome: 'Notebook 14 polegadas', categoria: 'notebook', patrimonio: 'TI-0001', situacao: 'disponivel', imagem: null },
  { id: 'e2', nome: 'Notebook 15 polegadas', categoria: 'notebook', patrimonio: 'TI-0002', situacao: 'emprestado', imagem: null },
  { id: 'e4', nome: 'Monitor 22 polegadas', categoria: 'monitor', patrimonio: 'TI-0007', situacao: 'manutencao', imagem: null },
  { id: 'e5', nome: 'Webcam Full HD', categoria: 'camera', patrimonio: 'TI-0011', situacao: 'disponivel', imagem: { url: 'https://exemplo.local/webcam.jpg' } },
]

type Resposta = { status: number; body: unknown }
let rotas: Record<string, Resposta | (() => Resposta)>
let chamadas: { url: string; init?: RequestInit }[]

beforeEach(() => {
  chamadas = []
  rotas = {
    'GET /equipments': { status: 200, body: EQUIPAMENTOS },
    'GET /loans/me': { status: 200, body: [] },
  }
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      chamadas.push({ url, init })
      const r = rotas[`${init?.method ?? 'GET'} ${url}`]
      const { status, body } = typeof r === 'function' ? r() : (r ?? { status: 404, body: { message: 'rota de teste ausente' } })
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
const cartao = (nome: string) => screen.getByRole('listitem', { name: nome })

describe('catálogo', () => {
  it('CA-01: lista os equipamentos com nome, categoria, patrimônio, situação e imagem ou espaço da categoria', async () => {
    renderArea()
    await screen.findByRole('heading', { name: 'Catálogo' })
    const nb = cartao('Notebook 14 polegadas')
    expect(within(nb).getByText('Notebook · TI-0001')).toBeTruthy()
    expect(within(nb).getByText('Disponível')).toBeTruthy()
    expect(within(nb).getByText('Notebook', { selector: '.card-img span' })).toBeTruthy()
    expect(within(cartao('Notebook 15 polegadas')).getByText('Emprestado')).toBeTruthy()
    expect(within(cartao('Monitor 22 polegadas')).getByText('Em manutenção')).toBeTruthy()
    const img = within(cartao('Webcam Full HD')).getByRole('img', { name: 'Webcam Full HD' }) as HTMLImageElement
    expect(img.src).toBe('https://exemplo.local/webcam.jpg')
  })

  it('CA-02: mostra "Fotos: Pixabay" com link para pixabay.com', async () => {
    renderArea()
    const link = (await screen.findByRole('link', { name: 'Pixabay' })) as HTMLAnchorElement
    expect(link.href).toBe('https://pixabay.com/')
    expect(link.closest('footer')?.textContent).toBe('Fotos: Pixabay')
  })

  it('CA-03: busca por nome ou patrimônio e filtro por situação reduzem a lista', async () => {
    renderArea()
    await screen.findByRole('heading', { name: 'Catálogo' })
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'ti-0002' } })
    expect(screen.getAllByRole('listitem').map((li) => li.getAttribute('aria-label'))).toEqual(['Notebook 15 polegadas'])
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'notebook' } })
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Situação'), { target: { value: 'manutencao' } })
    expect(screen.getAllByRole('listitem').map((li) => li.getAttribute('aria-label'))).toEqual(['Monitor 22 polegadas'])
  })
})

describe('solicitar', () => {
  it('CA-04: só disponível tem "Solicitar"; solicitar envia POST /loans e mostra a devolução, recarregando a tela', async () => {
    rotas['POST /loans'] = { status: 201, body: { id: 'l1', equipmentId: 'e1', dueAt: '2026-12-04T13:00:00.000Z' } }
    renderArea()
    await screen.findByRole('heading', { name: 'Catálogo' })
    expect(within(cartao('Notebook 15 polegadas')).queryByRole('button')).toBeNull()
    expect(within(cartao('Monitor 22 polegadas')).queryByRole('button')).toBeNull()

    const getsAntes = chamadas.filter((c) => c.url === '/equipments').length
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar Notebook 14 polegadas' }))
    expect((await screen.findByText(/Empréstimo criado/)).textContent).toBe('Empréstimo criado. Devolução até 04/12/2026')
    const post = chamadas.find((c) => c.init?.method === 'POST')
    expect(post?.url).toBe('/loans')
    expect(JSON.parse(String(post?.init?.body))).toEqual({ equipmentId: 'e1' })
    await waitFor(() => expect(chamadas.filter((c) => c.url === '/equipments').length).toBe(getsAntes + 1))
    expect(chamadas.filter((c) => c.url === '/loans/me').length).toBe(2)
  })

  it('CA-05: recusa 409 mostra o motivo que veio da API', async () => {
    rotas['POST /loans'] = { status: 409, body: { statusCode: 409, message: 'Limite de 5 empréstimos em aberto atingido' } }
    renderArea()
    fireEvent.click(await screen.findByRole('button', { name: 'Solicitar Webcam Full HD' }))
    expect((await screen.findByRole('alert')).textContent).toBe('Limite de 5 empréstimos em aberto atingido')
  })
})

describe('meus empréstimos', () => {
  it('CA-06: mostra nome, "Devolução até dd/mm/aaaa" e "Atrasado" quando for o caso', async () => {
    const meus: MeuEmprestimo[] = [
      { id: 'l1', equipmentId: 'e2', dueAt: '2026-12-04T13:00:00.000Z', atrasado: false },
      { id: 'l2', equipmentId: 'e1', dueAt: '2026-11-01T13:00:00.000Z', atrasado: true },
    ]
    rotas['GET /loans/me'] = { status: 200, body: meus }
    renderArea()
    const secao = within(await screen.findByRole('region', { name: 'Meus empréstimos' }))
    const emDia = within(secao.getByRole('listitem', { name: 'Notebook 15 polegadas' }))
    expect(emDia.getByText('Devolução até 04/12/2026')).toBeTruthy()
    expect(emDia.queryByText('Atrasado')).toBeNull()
    const atrasado = within(secao.getByRole('listitem', { name: 'Notebook 14 polegadas' }))
    expect(atrasado.getByText('Devolução até 01/11/2026')).toBeTruthy()
    expect(atrasado.getByText('Atrasado')).toBeTruthy()
  })

  it('CA-06: sem empréstimos mostra "Você não tem empréstimos em aberto."', async () => {
    renderArea()
    expect(await screen.findByText('Você não tem empréstimos em aberto.')).toBeTruthy()
  })
})

describe('sessão e token', () => {
  it('CA-07: resposta 401 da API encerra a sessão', async () => {
    rotas['GET /equipments'] = { status: 401, body: { message: 'Sessão inválida' } }
    renderArea()
    await waitFor(() => expect(auth.signOut).toHaveBeenCalledTimes(1))
  })

  it('CA-08: toda chamada à API envia Authorization: Bearer com o token da sessão', async () => {
    rotas['POST /loans'] = { status: 201, body: { id: 'l1', equipmentId: 'e1', dueAt: '2026-12-04T13:00:00.000Z' } }
    renderArea()
    fireEvent.click(await screen.findByRole('button', { name: 'Solicitar Notebook 14 polegadas' }))
    await screen.findByText(/Empréstimo criado/)
    expect(chamadas.length).toBeGreaterThanOrEqual(5)
    for (const c of chamadas) {
      expect((c.init?.headers as Record<string, string>).Authorization).toBe('Bearer tok-123')
    }
  })
})
