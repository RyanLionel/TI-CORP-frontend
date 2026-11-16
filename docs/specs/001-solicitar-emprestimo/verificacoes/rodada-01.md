> Rodada 1 · resposta literal do subagente verificador-spec, aberto como agente novo, sem o contexto da sessão principal (plano B da aula 11).
> Adaptação de harness (2026-11-16): os checks foram executados pelo Ryan no HEAD e entregues ao subagente como evidência; ele leu código e testes só em modo leitura.

Spec: docs/specs/001-solicitar-emprestimo/spec.md (front) · Rodada: 1 · Commit: a0dd7036fe4863e270ffe7cfaf1c3e43faf6e155 · Árvore: limpa

| CA | evidência (arquivo:linha do teste) | status | observação |
|---|---|---|---|
| CA-01 | src/pages/Area.test.tsx:50 | ATENDIDO | Confere categoria e patrimônio ("Notebook · TI-0001"), as três situações, o espaço da categoria quando `imagem: null` (`.card-img span`) e o `src` da imagem. Código em src/components/Catalogo.tsx:73-83. O teste acha o nome pelo `aria-label` do `li`, não pelo `<h3>` visível. |
| CA-02 | src/pages/Area.test.tsx:63 | ATENDIDO | Confere o link para https://pixabay.com/ e o rodapé com o texto exato "Fotos: Pixabay" (Catalogo.tsx:99-104). Como cita o CA-11 do back, a parte do back ainda precisa ser verificada lá. |
| CA-03 | src/pages/Area.test.tsx:70 | ATENDIDO | Testa busca por patrimônio ("ti-0002", sem diferenciar maiúsculas), busca por nome ("notebook" → 2 itens) e filtro "manutencao" (Catalogo.tsx:31-38). |
| CA-04 | src/pages/Area.test.tsx:84; src/lib/datas.test.ts:4 | ATENDIDO | Confere que Emprestado e Em manutenção não têm botão. Confere o `POST /loans` com `{equipmentId:'e1'}`, o texto exato "Empréstimo criado. Devolução até 04/12/2026" e a recarga de `/equipments` e `/loans/me` (Area.tsx:51-63). datas.test cobre o dd/mm/aaaa no fuso America/Sao_Paulo. |
| CA-05 | src/pages/Area.test.tsx:101 | ATENDIDO | O `role=alert` mostra o `message` da API sem reescrever (api.ts:32-37, Area.tsx:59). Como cita o CA-11 do back, a parte do back ainda precisa ser verificada lá. |
| CA-06 | src/pages/Area.test.tsx:110; src/pages/Area.test.tsx:126; src/lib/datas.test.ts:4 | ATENDIDO | Confere o nome cruzado com o catálogo, "Devolução até dd/mm/aaaa", "Atrasado" só quando `atrasado: true` e o texto exato da lista vazia (MeusEmprestimos.tsx). |
| CA-07 | src/pages/Area.test.tsx:133 | REPROVADO | O teste só prova que `signOut` é chamado uma vez depois do 401 em `GET /equipments`. O dublê de Area.test.tsx:37 não dispara `onAuthStateChange`, e nenhum teste que cite CA-07 mostra a tela de login depois do 401. A volta ao login depende do `useSession` (Area.tsx:21 e src/auth/useSession.ts:18), que só é provado no CA-04 da spec 002-login (src/App.test.tsx:90), e esse teste não cita este CA. O 401 vindo de `POST /loans` também não tem teste. |
| CA-08 | src/pages/Area.test.tsx:139 | ATENDIDO | As 5 chamadas (2 GETs iniciais, o POST e 2 GETs de recarga) levam `Authorization: Bearer tok-123` (api.ts:28). O `GET /health` da tela de login (src/components/HealthStatus.tsx:11) vai sem token. Ele acontece antes da sessão e vem da spec 000, por isso não conta como falha aqui. |

Checks: npm test → passou (executado pelo humano no HEAD a0dd703 e entregue como evidência: 4 arquivos, 17 testes passando)
Checks: npm run build → passou (executado pelo humano no HEAD a0dd703 e entregue como evidência: tsc -b && vite build, "✓ built in 382ms")
Checks: git status --short → passou (vazio; conferido aqui com git rev-parse HEAD = a0dd7036fe4863e270ffe7cfaf1c3e43faf6e155)
Fora de escopo: não há código de devolução, Operações, cadastro, reserva, renovação nem notificação. Há textos e decisões de interface que a spec não pede:
- "Nenhum equipamento encontrado." (Catalogo.tsx:71)
- "Sua sessão expirou." no 401 (Area.tsx:29)
- "Carregando catálogo…" e o alerta de erro de carga (Area.tsx:80-89)
- tabela própria de nomes de categoria, como camera → "Câmera" (Catalogo.tsx:11-18)
- se o `nome` não for achado no catálogo, aparece "Equipamento" (MeusEmprestimos.tsx:7)

Nenhum desses contradiz a spec, mas a spec não define nenhum deles.
Veredito: NÃO PRONTA — o CA-07 exige "volta ao login" e nenhum teste que o cite prova isso; hoje só a chamada a `signOut` é testada.
