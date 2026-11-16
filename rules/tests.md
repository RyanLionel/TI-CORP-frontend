---
description: Como se escreve e se roda teste neste projeto
globs: ["**/*.test.ts", "**/*.test.tsx"]
alwaysApply: false
---

# Testes
> leitor: agente

## Quando
Ao escrever, alterar ou remover qualquer teste.

## Procedimento
1. Testes não chamam a API nem o banco de produção.
2. O nome do teste cita o critério que ele prova: `CA-03: ...`.
3. Teste de endpoint verifica status E corpo.
4. Runner: Vitest + jsdom + Testing Library (ADR-004). Testes em `src/**/*.test.tsx`;
   rodam com `npm test`. Chamadas à API e ao Supabase são dublês: o teste de
   regra de negócio e de política de acesso (RLS) vive no repo back.
5. Teste de tela verifica o que a pessoa vê (texto, rótulo, papel), não detalhes
   de implementação.

## Verificação
`npm test` passa.

## Não faça
- Não teste o framework ou bibliotecas externas.
- Não escreva teste sem citar um CA da spec.
