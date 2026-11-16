import { useEffect, useState } from 'react'

type HealthBody = { status?: string; database?: string }

// AZ-05 do andar zero: mostra o resultado de GET /health da API.
export function HealthStatus() {
  const [label, setLabel] = useState('Consultando a API…')

  useEffect(() => {
    const base = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')
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
