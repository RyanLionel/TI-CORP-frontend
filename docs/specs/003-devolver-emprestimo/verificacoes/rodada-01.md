> Rodada 1 · resposta literal do subagente verificador-spec, aberto como agente novo, sem o contexto da sessão principal (plano B da aula 11).
> Adaptação de harness (2026-11-17): os checks foram executados pelo Ryan no HEAD e entregues ao subagente como evidência; ele leu código e testes só em modo leitura.
> O subagente não escreveu a linha de cabeçalho; ela foi completada pela sessão principal com os dados que ele mesmo conferiu (HEAD e462821f…, árvore vazia).

Spec: docs/specs/003-devolver-emprestimo/spec.md · Rodada: 1 · Commit: e462821f223b420666e007d26dd213f97d62d916 · Árvore: limpa

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-01 | src/pages/Devolver.test.tsx:51-55 | ATENDIDO | Procura pelo nome acessível os botões "Devolver Notebook 14 polegadas" e "Devolver Webcam Full HD", um por empréstimo listado. O código está em src/components/MeusEmprestimos.tsx: `aria-label={\`Devolver ${nome(l.equipmentId)}\`}`. |
| CA-02 | src/pages/Devolver.test.tsx:57-66 | ATENDIDO | Confere `POST /loans/l1/return`, o header `Authorization: Bearer tok-123` e a mensagem "Devolução registrada.". Confere também que `/equipments` e `/loans/me` são buscados de novo depois do POST. O código está em src/lib/api.ts:49-50 (`api.devolver`) e src/pages/Area.tsx:67-79. Que o empréstimo some e o equipamento volta a `disponivel` depende do back (CA-02 da spec 005), que se verifica no repo TI-CORP. |
| CA-03 | src/pages/Devolver.test.tsx:68-73 | ATENDIDO | Um 409 com `{ message: 'Empréstimo já devolvido' }` aparece em `role=alert` com o texto exato. O código está em src/lib/api.ts (apiFetch, que repassa o `message`), Area.tsx:75 (`tratar`) e MeusEmprestimos.tsx (aviso com `role="alert"`). A mensagem é a mesma do CA-04 da spec 005 do back. |
| CA-04 | src/pages/Devolver.test.tsx:75-80 | ATENDIDO | O teste prova que um 401 na devolução chama `signOut` uma vez, pelo `tratar` → `sair` de Area.tsx:26-35. A volta à tela de login depois do `signOut` não tem teste próprio da devolução. Ela usa o mesmo mecanismo (`useSession`) que já é provado em src/App.test.tsx:114-128 (CA-07 da spec 001). |

Checks: `npm test` → passou (5 arquivos de teste, 24 testes; rodado pelo humano no HEAD e462821f)
Checks: `npm run build` → passou (rodado pelo humano)
Checks: `git status --short` → passou (vazio; conferido aqui com `git -c core.autocrlf=true status --short`, HEAD = e462821f223b420666e007d26dd213f97d62d916)
Fora de escopo: nada encontrado. Não há modal de confirmação, histórico de devoluções nem tela de Operações. Duas observações que não reprovam a spec:
- A regra 2 (botão desabilitado durante a chamada) foi implementada com `disabled={ocupado}`, mas não tem CA nem teste.
- O estado `ocupado` é o mesmo do Catálogo, então os botões "Solicitar" também ficam desabilitados enquanto a devolução roda.

Veredito: PRONTA — os quatro CAs têm teste que os cita e passa, e os checks do humano passaram no commit e462821.
