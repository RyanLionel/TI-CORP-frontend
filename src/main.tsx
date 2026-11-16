/// <reference types="vite/client" />
import { StrictMode, useEffect, useState, type FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type HealthBody = { status?: string; database?: string }

function HealthStatus() {
  const [label, setLabel] = useState('Consultando a API…')

  useEffect(() => {
    const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
    fetch(`${base}/health`)
      .then(async (response) => {
        const body = (await response.json()) as HealthBody
        if (!response.ok) {
          setLabel('API indisponível')
          return
        }
        setLabel(`API ${body.status ?? 'sem status'} · banco ${body.database ?? 'sem status'}`)
      })
      .catch(() => setLabel('API indisponível'))
  }, [])

  return (
    <p className="api-status" role="status">
      {label}
    </p>
  )
}

function App() {
  const [notice, setNotice] = useState<string | null>(null)

  function enterAsCollaborator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('Acesso de colaborador registrado neste protótipo. O catálogo entra quando a autenticação existir.')
  }

  function enterAsOperations() {
    setNotice('Acesso de Operações registrado neste protótipo. A visão operacional entra quando a autenticação existir.')
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
          Empréstimo interno de equipamentos de TI. Até três itens por pessoa, com prazo de 14 dias, sem planilha.
        </p>
        <ul className="stats">
          <li>
            <strong>3</strong>
            <span>itens por pessoa</span>
          </li>
          <li>
            <strong>14</strong>
            <span>dias de prazo</span>
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
        <form className="access-card" onSubmit={enterAsCollaborator} noValidate={false}>
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
          <button className="btn btn-primary btn-block" type="submit">
            Entrar
          </button>
          <button className="btn btn-ghost btn-block" type="button" onClick={enterAsOperations}>
            Entrar como Operações
          </button>
          <p className="privacy">Cada pessoa vê apenas os próprios empréstimos.</p>
          {notice ? (
            <p className="notice" role="status">
              {notice}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root ausente')
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
