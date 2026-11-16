// Cliente da API (contrato: spec 001 do repo back). Toda chamada leva o token da sessão (CA-08).
export type Situacao = 'disponivel' | 'emprestado' | 'manutencao'
// A spec 001 do back diz "url pública, fotógrafo, fonte"; os nomes dos campos são fechados pela spec 002 (fotos).
export type Imagem = { url: string } | null
export type Equipamento = {
  id: string
  nome: string
  categoria: string
  patrimonio: string | null
  situacao: Situacao
  imagem: Imagem
}
export type MeuEmprestimo = { id: string; equipmentId: string; dueAt: string; atrasado: boolean }
export type NovoEmprestimo = { id: string; equipmentId: string; dueAt: string }

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

const base = () => ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

export async function apiFetch<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` }
  if (init.body) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${base()}${path}`, { ...init, headers })
  const body: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      body && typeof body === 'object' && typeof (body as { message?: unknown }).message === 'string'
        ? (body as { message: string }).message
        : 'Não foi possível falar com a API.'
    throw new ApiError(res.status, message)
  }
  return body as T
}

export const api = {
  equipamentos: (token: string) => apiFetch<Equipamento[]>('/equipments', token),
  meusEmprestimos: (token: string) => apiFetch<MeuEmprestimo[]>('/loans/me', token),
  solicitar: (token: string, equipmentId: string) =>
    apiFetch<NovoEmprestimo>('/loans', token, { method: 'POST', body: JSON.stringify({ equipmentId }) }),
}
