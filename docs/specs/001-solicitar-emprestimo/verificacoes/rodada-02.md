> Rodada 2 · resposta literal do subagente verificador-spec, aberto como agente novo, sem o contexto da sessão principal (plano B da aula 11).
> Adaptação de harness (2026-11-16): os checks foram executados pelo Ryan no HEAD e entregues ao subagente como evidência; ele leu código e testes só em modo leitura.

Spec: docs/specs/001-solicitar-emprestimo/spec.md (front) · Rodada: 2 · Commit: c5c59c3410f425fc3eaff0077232a709c152183a · Árvore: limpa (`git status --short` vazio, conferido aqui)

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-01 | src/pages/Area.test.tsx:50 | ATENDIDO | Mesmo teste da rodada 01, sem mudança. Confere categoria e patrimônio, as três situações, o espaço da categoria com `imagem: null` e o `src` da imagem. Código em src/components/Catalogo.tsx:75. |
| CA-02 | src/pages/Area.test.tsx:63 | ATENDIDO | Confere o link para https://pixabay.com/ e o rodapé com o texto exato "Fotos: Pixabay" (Catalogo.tsx:102). Como é o CA-11 do back, a parte do back ainda precisa ser verificada lá. |
| CA-03 | src/pages/Area.test.tsx:70 | ATENDIDO | Testa busca por patrimônio, busca por nome e o filtro de situação. Código em Catalogo.tsx:32-36. |
| CA-04 | src/pages/Area.test.tsx:84; src/lib/datas.test.ts:4 | ATENDIDO | Equipamento emprestado ou em manutenção não tem botão. Confere o `POST /loans` com `{equipmentId:'e1'}`, o texto "Empréstimo criado. Devolução até 04/12/2026" e a recarga de `/equipments` e `/loans/me` (Area.tsx:51-63). |
| CA-05 | src/pages/Area.test.tsx:101 | ATENDIDO | O `role=alert` mostra o `message` da API sem reescrever (api.ts:131-136, Area.tsx:59). Como é o CA-11 do back, a parte do back ainda precisa ser verificada lá. |
| CA-06 | src/pages/Area.test.tsx:110; src/pages/Area.test.tsx:126; src/lib/datas.test.ts:4 | ATENDIDO | Confere o nome cruzado com o catálogo, "Devolução até dd/mm/aaaa", "Atrasado" só quando `atrasado: true` e o texto da lista vazia (MeusEmprestimos.tsx:7-19). |
| CA-07 | src/App.test.tsx:114; src/pages/Area.test.tsx:133; src/pages/Area.test.tsx:139 | ATENDIDO | Corrige a reprovação da rodada 01. App.test.tsx:114 renderiza o `App` inteiro com sessão ativa, faz a API responder 401 e confere três coisas: a tela de login aparece ("E-mail corporativo"), `signOut` é chamado uma vez e o botão "Sair" some. O dublê de `signOut` dispara `SIGNED_OUT` (App.test.tsx:35-38): é o comportamento esperado do Supabase, mas é suposição do dublê. O 401 no `POST /loans` (Area.test.tsx:139) só prova o `signOut`; a volta ao login nesse caso passa pelo mesmo `tratar`/`sair`, coberta por construção. O texto "Sua sessão expirou." não é conferido por nenhum teste. |
| CA-08 | src/pages/Area.test.tsx:146 | ATENDIDO | Todas as chamadas (2 GETs, o POST e 2 GETs de recarga) levam `Authorization: Bearer tok-123` (api.ts:127). O `GET /health` do login vai sem token, mas vem da spec 000 e acontece antes da sessão. |

Checks: npm test → passou (rodado pelo humano no HEAD c5c59c3 e entregue como evidência: 20 testes passando no Vitest; a contagem bate com os 20 `it` dos 4 arquivos de teste)
Checks: npm run build → passou (rodado pelo humano no HEAD c5c59c3 e entregue como evidência: sem erro)
Checks: git status --short → passou (vazio; conferido aqui junto com `git rev-parse HEAD` = c5c59c3410f425fc3eaff0077232a709c152183a)
Fora de escopo: não há código de devolução, Operações, cadastro, reserva, renovação nem notificação. Os textos de interface apontados na rodada 01 agora estão na spec, na seção "Textos e detalhes de interface", marcada como "revisar". O commit c5c59c3 também traz mudanças da spec 002-login (src/pages/Login.tsx:23-24, com teste em src/App.test.tsx:83; src/lib/supabase.ts:3 só muda um comentário). Nenhuma contradiz a spec 001.
Veredito: PRONTA — os 8 CAs têm teste que os cita e passa, o CA-07 agora prova a volta à tela de login após 401, e os CA-02 e CA-05 ainda precisam ser verificados como CA-11 no repo back.

> Nota do humano: o CA-11 do back foi conferido em TI-CORP, spec 001, verificacoes/rodada-06.md (PRONTA, commit 6fa1438).
