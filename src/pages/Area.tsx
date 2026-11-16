import { useState } from 'react'
import { supabase } from '../lib/supabase'

// Área logada (spec 002-login). O catálogo e os empréstimos entram aqui pela spec 001 do front.
export function Area({ email }: { email: string }) {
  const [saindo, setSaindo] = useState(false)

  async function sair() {
    if (!supabase) return
    setSaindo(true)
    await supabase.auth.signOut()
    // O useSession percebe o fim da sessão e volta para o login.
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
        <h1>Catálogo</h1>
        <p className="support">Em construção.</p>
      </main>
    </div>
  )
}
