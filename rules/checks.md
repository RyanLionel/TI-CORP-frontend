---
description: O que precisa passar antes de declarar uma tarefa pronta
globs: []
alwaysApply: true
---

# Verificação de fim de tarefa
> leitor: agente

## Quando
Sempre que você for dizer "pronto", "implementado" ou "funcionando".

## Procedimento
1. Testes: ainda não existe suíte neste repositório. Enquanto não existir, escreva "sem suíte de testes" na
   resposta. Quando existir, rode-a e cole a última linha da saída.
2. Rode `npm run build` (checa tipos e builda) antes de qualquer push. Build que quebra na Vercel é o feedback mais lento e
   mais caro deste projeto.
3. Rode `git status --short`. Só podem aparecer arquivos do escopo
   da tarefa.
4. Diga qual critério de aceitação (CA-xx) esta tarefa atende.

## Verificação
Pronto = os comandos aplicáveis terminaram sem falha E o git status não
trouxe surpresa. As duas coisas, não uma.

## Não faça
- Não relate sucesso parcial. Teste vermelho é tarefa não terminada,
  mesmo que o código "esteja certo".
- Não tente consertar a mesma falha duas vezes seguidas sem me mostrar
  a saída do erro.
- Não rode teste contra a API ou o banco de produção.
- Não diga "testes passando" quando não existe suíte.
