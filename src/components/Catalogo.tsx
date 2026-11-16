import { useMemo, useState } from 'react'
import type { Equipamento, Situacao } from '../lib/api'

export type Aviso = { tipo: 'ok' | 'erro'; texto: string } | null

const SITUACAO: Record<Situacao, string> = {
  disponivel: 'Disponível',
  emprestado: 'Emprestado',
  manutencao: 'Em manutenção',
}
const CATEGORIA: Record<string, string> = {
  notebook: 'Notebook',
  monitor: 'Monitor',
  cabo: 'Cabo',
  camera: 'Câmera',
  acessorio: 'Acessório',
}
const categoria = (c: string) => CATEGORIA[c] ?? c

type Props = {
  equipamentos: Equipamento[]
  aviso: Aviso
  ocupado: boolean
  onSolicitar: (id: string) => void
}

export function Catalogo({ equipamentos, aviso, ocupado, onSolicitar }: Props) {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<'todas' | Situacao>('todas')

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return equipamentos.filter(
      (e) =>
        (filtro === 'todas' || e.situacao === filtro) &&
        (!termo || e.nome.toLowerCase().includes(termo) || (e.patrimonio ?? '').toLowerCase().includes(termo)),
    )
  }, [equipamentos, busca, filtro])

  return (
    <section className="catalogo" aria-labelledby="catalogo-titulo">
      <h2 id="catalogo-titulo">Catálogo</h2>
      <div className="filtros">
        <div className="field">
          <label htmlFor="busca">Buscar</label>
          <input
            id="busca"
            type="search"
            placeholder="Nome ou patrimônio"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="filtro">Situação</label>
          <select id="filtro" value={filtro} onChange={(e) => setFiltro(e.target.value as 'todas' | Situacao)}>
            <option value="todas">Todas</option>
            <option value="disponivel">Disponível</option>
            <option value="emprestado">Emprestado</option>
            <option value="manutencao">Em manutenção</option>
          </select>
        </div>
      </div>

      {aviso ? (
        <p className={`notice ${aviso.tipo === 'erro' ? 'notice-erro' : ''}`} role={aviso.tipo === 'erro' ? 'alert' : 'status'}>
          {aviso.texto}
        </p>
      ) : null}

      {lista.length === 0 ? <p className="support">Nenhum equipamento encontrado.</p> : null}
      <ul className="cards">
        {lista.map((e) => (
          <li className="card" key={e.id} aria-label={e.nome}>
            <div className="card-img">
              {e.imagem ? <img src={e.imagem.url} alt={e.nome} /> : <span>{categoria(e.categoria)}</span>}
            </div>
            <h3>{e.nome}</h3>
            <p className="card-meta">
              {categoria(e.categoria)}
              {e.patrimonio ? ` · ${e.patrimonio}` : ''}
            </p>
            <span className={`tag tag-${e.situacao}`}>{SITUACAO[e.situacao]}</span>
            {e.situacao === 'disponivel' ? (
              <button
                className="btn btn-primary btn-block"
                type="button"
                aria-label={`Solicitar ${e.nome}`}
                disabled={ocupado}
                onClick={() => onSolicitar(e.id)}
              >
                Solicitar
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      <footer className="credito">
        Fotos:{' '}
        <a href="https://pixabay.com" target="_blank" rel="noreferrer">
          Pixabay
        </a>
      </footer>
    </section>
  )
}
