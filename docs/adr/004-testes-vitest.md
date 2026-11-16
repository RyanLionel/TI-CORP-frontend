# ADR-004 — Vitest para os testes do front

**Status:** aceito (decidido por Ryan em 2026-11-16; texto redigido pelo agente, revisar)
**Negócio:** spec 001 do back (CA-11) e spec 002-login deste repo · fecha "Biblioteca de testes do front" deixada em aberto pelo ADR-001

## Contexto
O ADR-001 (repo back) não escolheu a biblioteca de testes do front, e `rules/tests.md` mandava propor e esperar.
Com login real e as telas de catálogo e empréstimos, o front passa a ter comportamento que precisa de prova:
critérios CA-xx que só existem na tela (crédito das fotos, motivo da recusa, data de devolução).

## Decisão
- Runner: `vitest` 5.1.0, ambiente `jsdom` 30.1.3 (simula o navegador).
- Telas: `@testing-library/react` 16.3.3 e `@testing-library/dom` 10.4.2 (testa pelo que a pessoa vê, não pela implementação).
- Todas como devDependencies, versão exata, publicadas há mais de 7 dias (regra de dependências).
- Testes em `src/**/*.test.tsx`; `npm test` roda `vitest run`.
- Testes do front não chamam a API nem o Supabase: as chamadas de rede são substituídas por dublês. Regra de negócio, banco e RLS são provados no repo back.

## Alternativas consideradas
- **Jest (o mesmo do back):** um só runner nos dois repos, mas exige configurar transformação de TypeScript/JSX e ESM à parte do Vite; o Vitest reaproveita a configuração do Vite.
- **Playwright (teste de ponta a ponta no navegador real):** prova o fluxo inteiro, mas precisa de API, banco e navegador de pé a cada execução; caro para o tamanho atual. Pode entrar depois, para a conferência em produção.
- **Sem testes no front:** o CA-11 da spec 001 ficaria SEM TESTE no verificador.

## Consequências
- Back (Jest) e front (Vitest) têm runners diferentes; `rules/checks.md` de cada repo diz o seu comando.
- Os testes do front dependem de dublês da API: se o contrato do back mudar, o teste do front não percebe sozinho. O contrato continua sendo do repo back.
