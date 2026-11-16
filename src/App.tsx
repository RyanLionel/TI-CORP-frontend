import { useSession } from './auth/useSession'
import { Login } from './pages/Login'
import { Area } from './pages/Area'

export function App() {
  const sessao = useSession()
  if (sessao.status === 'carregando') {
    return (
      <p className="api-status" role="status">
        Carregando…
      </p>
    )
  }
  return sessao.status === 'dentro' ? (
    <Area email={sessao.session.user.email ?? ''} token={sessao.session.access_token} />
  ) : (
    <Login />
  )
}
