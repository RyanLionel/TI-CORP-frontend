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
4. A biblioteca de testes do front ainda não foi decidida: proponha e
   espere (rules/restrictions.md). O teste de política de acesso (RLS)
   vive no repo back.

## Verificação
O comando de testes passa. (Ainda não existe suíte: ver rules/checks.md.)

## Não faça
- Não teste o framework ou bibliotecas externas.
- Não escreva teste sem citar um CA da spec.
