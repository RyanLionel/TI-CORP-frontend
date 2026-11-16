> Rodada 1 · resposta literal do subagente verificador-spec, aberto como agente novo, sem o contexto da sessão principal (plano B da aula 11).
> Adaptação de harness (2026-11-16): os checks foram executados pelo Ryan no HEAD e entregues ao subagente como evidência; ele leu código e testes só em modo leitura.

Spec: docs/specs/002-login/spec.md · Rodada: 1 · Commit: a0dd7036fe4863e270ffe7cfaf1c3e43faf6e155 · Árvore: limpa

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-01 | src/App.test.tsx:55 | ATENDIDO | Testa src/pages/Login.tsx:19-22 (`signInWithPassword` com e-mail e senha), src/auth/useSession.ts:18 (`onAuthStateChange`) e src/pages/Area.tsx:74-77 (e-mail e "Sair" no topo). O login bem-sucedido é um dublê que dispara `SIGNED_IN`. |
| CA-02 | src/App.test.tsx:67 e src/App.test.tsx:76 | ATENDIDO | Testa src/pages/Login.tsx:23. Fora do CA (regra 3): o código trata qualquer `error.status === 400` como credencial recusada. No Supabase, outros erros também voltam com 400 (por exemplo, e-mail não confirmado), e a regra 3 manda mostrar a mensagem geral nesses casos. O teste usa `code` e `status` juntos, então não separa as duas condições. |
| CA-03 | src/App.test.tsx:83 | ATENDIDO | Testa src/auth/useSession.ts:17 (`getSession`). Manter a sessão ao recarregar depende do padrão do supabase-js (regra 5). O teste simula isso com `getSession`, que já devolve uma sessão. |
| CA-04 | src/App.test.tsx:90 | ATENDIDO | Testa src/pages/Area.tsx:17-22 (`signOut`). A volta ao login vem do `SIGNED_OUT` do dublê, tratado por useSession. |
| CA-05 | src/App.test.tsx:98 | ATENDIDO | Testa src/pages/Login.tsx:43-53. Não há botão com "Operações". O único "Operações" que sobra é um texto de rodapé (src/pages/Login.tsx:60), não um botão. |
| CA-06 | src/App.sem-config.test.tsx:14 | ATENDIDO | Testa src/pages/Login.tsx:81-85 e o botão desabilitado (Login.tsx:77). O teste troca o client por `null` com um dublê. A regra de src/lib/supabase.ts:8 (`url && anonKey`), que deixa o client `null` quando falta só uma das variáveis, não é testada diretamente. |

Checks: npm test → passou (executado pelo humano no HEAD a0dd703 e entregue como evidência: 4 arquivos, 17 testes passando)
Checks: npm run build → passou (executado pelo humano e entregue como evidência: tsc -b && vite build, "✓ built in 382ms")
Checks: git status --short → passou (vazio, executado pelo humano e entregue como evidência)
Fora de escopo: nada encontrado. Não há cadastro, recuperar senha, login social nem tela de Operações. O catálogo e os empréstimos em src/pages/Area.tsx vêm da spec 001 do front (commit e4ed174), não desta. Um ponto à parte: o comentário em src/lib/supabase.ts:3 cita "service_role". Isso não é chave, mas faz a verificação de rules/secrets.md (buscar "service" em src/ não pode encontrar nada) falhar.
Veredito: PRONTA. Os seis CAs têm teste que os cita e passa, e build e git status estão limpos. Ficam abertos para o time: o mapeamento de qualquer 400 contra a regra 3 e o comentário que falha a busca de rules/secrets.md.
