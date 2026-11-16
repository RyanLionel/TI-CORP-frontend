import type { Equipamento, MeuEmprestimo } from '../lib/api'
import { formatarData } from '../lib/datas'

type Props = { emprestimos: MeuEmprestimo[]; equipamentos: Equipamento[] }

export function MeusEmprestimos({ emprestimos, equipamentos }: Props) {
  const nome = (id: string) => equipamentos.find((e) => e.id === id)?.nome ?? 'Equipamento'
  return (
    <section className="meus" aria-labelledby="meus-titulo">
      <h2 id="meus-titulo">Meus empréstimos</h2>
      {emprestimos.length === 0 ? (
        <p className="support">Você não tem empréstimos em aberto.</p>
      ) : (
        <ul className="meus-lista">
          {emprestimos.map((l) => (
            <li key={l.id} aria-label={nome(l.equipmentId)}>
              <strong>{nome(l.equipmentId)}</strong>
              <span>Devolução até {formatarData(l.dueAt)}</span>
              {l.atrasado ? <span className="tag tag-atrasado">Atrasado</span> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
