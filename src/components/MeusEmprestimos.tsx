import type { Equipamento, MeuEmprestimo } from '../lib/api'
import { formatarData } from '../lib/datas'
import type { Aviso } from './Catalogo'

type Props = {
  emprestimos: MeuEmprestimo[]
  equipamentos: Equipamento[]
  // Spec 003 do front: devolver
  aviso?: Aviso
  ocupado?: boolean
  onDevolver?: (loanId: string) => void
}

export function MeusEmprestimos({ emprestimos, equipamentos, aviso = null, ocupado = false, onDevolver }: Props) {
  const nome = (id: string) => equipamentos.find((e) => e.id === id)?.nome ?? 'Equipamento'
  return (
    <section className="meus" aria-labelledby="meus-titulo">
      <h2 id="meus-titulo">Meus empréstimos</h2>
      {aviso ? (
        <p className={`notice ${aviso.tipo === 'erro' ? 'notice-erro' : ''}`} role={aviso.tipo === 'erro' ? 'alert' : 'status'}>
          {aviso.texto}
        </p>
      ) : null}
      {emprestimos.length === 0 ? (
        <p className="support">Você não tem empréstimos em aberto.</p>
      ) : (
        <ul className="meus-lista">
          {emprestimos.map((l) => (
            <li key={l.id} aria-label={nome(l.equipmentId)}>
              <strong>{nome(l.equipmentId)}</strong>
              <span>Devolução até {formatarData(l.dueAt)}</span>
              {l.atrasado ? <span className="tag tag-atrasado">Atrasado</span> : null}
              {onDevolver ? (
                <button
                  className="btn btn-ghost"
                  type="button"
                  aria-label={`Devolver ${nome(l.equipmentId)}`}
                  disabled={ocupado}
                  onClick={() => onDevolver(l.id)}
                >
                  Devolver
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
