> Rodada 2 · resposta literal do subagente verificador-spec, aberto como agente novo, sem o contexto da sessão principal (plano B da aula 11).
> Adaptação de harness (2026-11-16): os checks foram executados pelo Ryan no HEAD e entregues ao subagente como evidência; ele leu código e testes só em modo leitura.

Spec: docs/specs/002-login/spec.md · Rodada: 2 · Commit: c5c59c3410f425fc3eaff0077232a709c152183a · Árvore: limpa (`git status --short` vazio)

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-01 | src/App.test.tsx:55 | ATENDIDO | O teste exercita src/pages/Login.tsx:19-22 (`signInWithPassword`), src/auth/useSession.ts:18 (`onAuthStateChange`), src/App.tsx:14-15 e src/pages/Area.tsx:74-77 (e-mail e "Sair" no topo). O login bem-sucedido é um dublê que dispara `SIGNED_IN`. |
| CA-02 | src/App.test.tsx:67, :76, :83 | ATENDIDO | O teste exercita src/pages/Login.tsx:24, que agora só trata `error.code === 'invalid_credentials'` como credencial recusada. O ponto aberto na rodada 1 está fechado: o teste da linha 83 usa 400 com `email_not_confirmed` e recebe a mensagem geral, como manda a regra 3. O teste da linha 76 cobre a exceção (Login.tsx:26-27). |
| CA-03 | src/App.test.tsx:90 | ATENDIDO | O teste exercita src/auth/useSession.ts:17 (`getSession`). Manter a sessão ao recarregar depende do padrão do supabase-js (regra 5), simulado com um `getSession` que já devolve uma sessão. |
| CA-04 | src/App.test.tsx:97 | ATENDIDO | O teste exercita src/pages/Area.tsx:17-22 (`signOut`). A volta ao login vem do `SIGNED_OUT` do dublê, tratado por src/auth/useSession.ts:18. |
| CA-05 | src/App.test.tsx:105 | ATENDIDO | O teste exercita src/pages/Login.tsx:44-54. Não existe botão com "Operações"; o único "Operações" é texto de rodapé (Login.tsx:61). |
| CA-06 | src/App.sem-config.test.tsx:14 | ATENDIDO | O teste exercita src/pages/Login.tsx:82-86 e o botão desabilitado (Login.tsx:78), trocando o client por `null`. A condição de src/lib/supabase.ts:8 (`url && anonKey`) quando falta só uma das variáveis continua sem teste direto. |

Checks: npm test → passou (o humano rodou no HEAD c5c59c3 e entregou como evidência: 20 testes passando no Vitest; 8 em App.test, 1 em App.sem-config.test, 10 em Area.test e 1 em datas.test)
Checks: npm run build → passou (o humano rodou no HEAD e entregou como evidência: sem erro)
Checks: git status --short → passou (vazio; conferido em modo leitura neste HEAD)
Fora de escopo: nada encontrado. Não há cadastro, recuperar senha, login social nem tela de Operações (sem `signUp`, `resetPassword` nem `signInWithOAuth` em src/). O tratamento de 401 (Area.tsx:24-34) e o teste "CA-07 (spec 001)" (App.test.tsx:114) pertencem à spec 001 do front. O ponto da rodada 1 sobre rules/secrets.md foi resolvido. .claude/agents/verificador-spec.md e agents/verificador-spec.md diferem só no fim de linha.
Veredito: PRONTA. Os seis CAs têm teste que os cita e passa, e o build e o git status estão limpos no HEAD c5c59c3. Continua aberto, sem bloquear, só o teste direto de quando falta apenas uma das variáveis `VITE_SUPABASE_*` (CA-06).
