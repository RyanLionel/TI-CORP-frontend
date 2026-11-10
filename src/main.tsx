import { FormEvent, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { Health } from './Health'

function Logo() {
  return <a className="brand" href="#inicio" aria-label="EMPREST.AI, página inicial"><span className="brand-mark" aria-hidden="true"><i /></span><span>EMPREST<span>.AI</span></span></a>
}

function App() {
  const [notice, setNotice] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice('Acesso validado. O catálogo estará disponível em breve.')
  }

  return <main className="login-page" id="inicio">
    <section className="intro" aria-labelledby="intro-title"><div className="intro-content"><Logo />
      <div className="hero-copy"><p className="eyebrow">GESTÃO INTERNA DE TI</p><h1 id="intro-title">O equipamento certo,<br />quando você precisa.</h1><p>Empréstimos simples e visíveis para manter o seu time em movimento.</p></div>
      <div className="stats" aria-label="Regras do empréstimo"><div><strong>3</strong><span>itens por pessoa</span></div><div><strong>14</strong><span>dias de prazo</span></div><div><strong>0</strong><span>linhas para preencher</span></div></div>
      <p className="intro-footer">Operações <b>·</b> TI interno</p>
    </div></section>
    <section className="access" aria-labelledby="access-title"><div className="access-card"><p className="section-label">BEM-VINDO DE VOLTA</p><h2 id="access-title">Entrar</h2><p className="access-lead">Use seus dados corporativos para continuar.</p>
      <form onSubmit={submit}><label htmlFor="email">E-mail corporativo</label><input id="email" type="email" autoComplete="email" placeholder="nome@empresa.com" required />
      <label htmlFor="password">Senha</label><div className="password-field"><input id="password" type="password" autoComplete="current-password" placeholder="Sua senha" required /><button type="button" className="show-password" aria-label="Mostrar senha">○</button></div>
      <button className="button primary" type="submit">Entrar <span aria-hidden="true">→</span></button></form>
      <button className="button operations" type="button" onClick={() => setNotice('Modo Operações selecionado.')}>Entrar como Operações <span aria-hidden="true">→</span></button>
      {notice && <p className="notice" role="status">{notice}</p>}<p className="privacy">Cada pessoa vê apenas os próprios empréstimos.</p><Health />
    </div></section>
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
