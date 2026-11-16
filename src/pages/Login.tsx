import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { HealthStatus } from '../components/HealthStatus'

const CREDENCIAL_RECUSADA = 'E-mail ou senha incorretos'
const FALHA_GERAL = 'Não foi possível entrar. Tente de novo.'

export function Login() {
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    const dados = new FormData(event.currentTarget)
    setErro(null)
    setEnviando(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: String(dados.get('email') ?? ''),
        password: String(dados.get('password') ?? ''),
      })
      if (error) setErro(error.code === 'invalid_credentials' || error.status === 400 ? CREDENCIAL_RECUSADA : FALHA_GERAL)
      // Sucesso: o useSession percebe a sessão nova e troca para a área logada.
    } catch {
      setErro(FALHA_GERAL)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="login">
      <section className="login-story" aria-label="Apresentação">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">
            EMPREST<span>.AI</span>
          </span>
        </div>
        <h1>O equipamento certo, quando você precisa.</h1>
        <p className="lead">
          Empréstimo interno de equipamentos de TI. Até 5 itens por pessoa, com prazo de 14 dias úteis, sem planilha.
        </p>
        <ul className="stats">
          <li>
            <strong>5</strong>
            <span>itens por pessoa</span>
          </li>
          <li>
            <strong>14</strong>
            <span>dias úteis de prazo</span>
          </li>
          <li>
            <strong>0</strong>
            <span>linhas para preencher</span>
          </li>
        </ul>
        <footer className="story-foot">
          <span>Operações · TI interno</span>
          <HealthStatus />
        </footer>
      </section>

      <section className="login-access" aria-label="Acesso">
        <form className="access-card" onSubmit={entrar}>
          <h2>Entrar</h2>
          <p className="support">Use o e-mail corporativo para seguir ao catálogo.</p>
          <div className="field">
            <label htmlFor="email">E-mail corporativo</label>
            <input id="email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={!supabase || enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
          <p className="privacy">Cada pessoa vê apenas os próprios empréstimos.</p>
          {!supabase ? (
            <p className="notice" role="alert">
              Login não configurado
            </p>
          ) : null}
          {erro ? (
            <p className="notice" role="alert">
              {erro}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  )
}
