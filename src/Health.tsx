import { useEffect, useState } from 'react'

type Estado = 'carregando' | 'ok' | 'erro'

export function Health() {
  const [estado, setEstado] = useState<Estado>('carregando')
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL ?? ''
    fetch(`${base}/health`)
      .then((r) => setEstado(r.ok ? 'ok' : 'erro'))
      .catch(() => setEstado('erro'))
  }, [])
  const texto = { carregando: 'Verificando a API...', ok: 'API e banco disponíveis', erro: 'API indisponível' }[estado]
  return <p role="status" className="notice" data-estado={estado}>{texto}</p>
}
