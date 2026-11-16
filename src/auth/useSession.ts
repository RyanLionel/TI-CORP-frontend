import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type SessionState = { status: 'carregando' } | { status: 'fora' } | { status: 'dentro'; session: Session }

// Lê a sessão salva e acompanha login/logout: é o que mantém a pessoa logada ao recarregar (CA-03).
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>(supabase ? { status: 'carregando' } : { status: 'fora' })

  useEffect(() => {
    if (!supabase) return
    let ativo = true
    const aplicar = (session: Session | null) => {
      if (ativo) setState(session ? { status: 'dentro', session } : { status: 'fora' })
    }
    supabase.auth.getSession().then(({ data }) => aplicar(data.session))
    const { data } = supabase.auth.onAuthStateChange((_evento, session) => aplicar(session))
    return () => {
      ativo = false
      data.subscription.unsubscribe()
    }
  }, [])

  return state
}
