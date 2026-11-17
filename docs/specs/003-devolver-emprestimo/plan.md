# Plano — Devolver empréstimo (front, spec 003)

1. `api.devolver(token, loanId)` em `src/lib/api.ts` faz `POST /loans/{id}/return` com o token (CA-02).
2. `MeusEmprestimos` ganha o botão "Devolver {nome}" e um aviso próprio (CA-01, CA-03).
3. `Area.devolver` desabilita os botões durante a chamada e mostra "Devolução registrada.". Depois recarrega o catálogo e "Meus empréstimos". O erro passa pelo mesmo `tratar` (401 → sair; CA-04).
4. Testes em `src/pages/Devolver.test.tsx`, com fetch e Supabase como dublês (ADR-004).
