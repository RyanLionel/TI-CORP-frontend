import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { api, ApiError, type Equipamento, type MeuEmprestimo } from '../lib/api'
import { formatarData } from '../lib/datas'
import { Catalogo, type Aviso } from '../components/Catalogo'
import { MeusEmprestimos } from '../components/MeusEmprestimos'

// Área logada: catálogo e meus empréstimos (spec 001 do front), com Sair (spec 002-login).
export function Area({ email, token }: { email: string; token: string }) {
  const [saindo, setSaindo] = useState(false)
  const [equipamentos, setEquipamentos] = useState<Equipamento[] | null>(null)
  const [meus, setMeus] = useState<MeuEmprestimo[]>([])
  const [erroCarga, setErroCarga] = useState<string | null>(null)
  const [aviso, setAviso] = useState<Aviso>(null)
  const [ocupado, setOcupado] = useState(false)
  const [avisoDevolucao, setAvisoDevolucao] = useState<Aviso>(null)

  const sair = useCallback(async () => {
    if (!supabase) return
    setSaindo(true)
    await supabase.auth.signOut()
    // O useSession percebe o fim da sessão e volta para o login.
  }, [])

  // 401 da API: sessão inválida ou expirada; volta ao login (CA-07).
  const tratar = useCallback(
    (e: unknown): string => {
      if (e instanceof ApiError && e.status === 401) {
        void sair()
        return 'Sua sessão expirou.'
      }
      return e instanceof Error ? e.message : 'Não foi possível falar com a API.'
    },
    [sair],
  )

  const carregar = useCallback(async () => {
    try {
      const [lista, meusEmprestimos] = await Promise.all([api.equipamentos(token), api.meusEmprestimos(token)])
      setEquipamentos(lista)
      setMeus(meusEmprestimos)
      setErroCarga(null)
    } catch (e) {
      setErroCarga(tratar(e))
    }
  }, [token, tratar])

  useEffect(() => {
    void carregar()
  }, [carregar])

  async function solicitar(id: string) {
    setOcupado(true)
    setAviso(null)
    try {
      const novo = await api.solicitar(token, id)
      setAviso({ tipo: 'ok', texto: `Empréstimo criado. Devolução até ${formatarData(novo.dueAt)}` })
      await carregar()
    } catch (e) {
      setAviso({ tipo: 'erro', texto: tratar(e) })
    } finally {
      setOcupado(false)
    }
  }

  // Spec 003 do front: devolver um empréstimo próprio
  async function devolver(loanId: string) {
    setOcupado(true)
    setAvisoDevolucao(null)
    try {
      await api.devolver(token, loanId)
      setAvisoDevolucao({ tipo: 'ok', texto: 'Devolução registrada.' })
      await carregar()
    } catch (e) {
      setAvisoDevolucao({ tipo: 'erro', texto: tratar(e) })
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="area">
      <header className="area-top">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">
            EMPREST<span>.AI</span>
          </span>
        </div>
        <span className="area-user">{email}</span>
        <button className="btn btn-ghost" type="button" onClick={sair} disabled={saindo}>
          Sair
        </button>
      </header>
      <main className="area-body">
        {erroCarga ? (
          <p className="notice notice-erro" role="alert">
            {erroCarga}
          </p>
        ) : null}
        {equipamentos === null && !erroCarga ? (
          <p className="support" role="status">
            Carregando catálogo…
          </p>
        ) : null}
        {equipamentos ? (
          <>
            <Catalogo equipamentos={equipamentos} aviso={aviso} ocupado={ocupado} onSolicitar={solicitar} />
            <MeusEmprestimos
              emprestimos={meus}
              equipamentos={equipamentos}
              aviso={avisoDevolucao}
              ocupado={ocupado}
              onDevolver={devolver}
            />
          </>
        ) : null}
      </main>
    </div>
  )
}
