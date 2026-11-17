# Spec — Devolver empréstimo (front)

> Status: rascunho (2026-11-17). Aprovada pelo Ryan em 2026-11-17 ("aprovo"); código escrito, aguardando checks e verificador.

## Objetivo
Em "Meus empréstimos", o colaborador devolve um item com um clique e vê o resultado na hora.

## Vínculo
Back: spec 005-devolver-emprestimo (`POST /loans/:id/return`) · front: spec 001 (Meus empréstimos)

## Regras
1. Cada item de "Meus empréstimos" tem um botão "Devolver" com rótulo acessível "Devolver {nome do equipamento}".
2. O clique chama `POST /loans/:id/return` com o token da sessão. Enquanto a chamada roda, o botão fica desabilitado.
3. Em caso de sucesso, aparece "Devolução registrada." e o catálogo e "Meus empréstimos" são recarregados.
4. Em caso de recusa, aparece o `message` da API num `role=alert`, sem reescrita. Um 401 encerra a sessão, igual ao resto da área.

## Critérios de aceitação
- CA-01 · Cada empréstimo listado tem o botão "Devolver {nome}".
- CA-02 · O clique envia `POST /loans/{id}/return` com `Authorization: Bearer <token>`. Depois do sucesso, a mensagem "Devolução registrada." aparece e `/equipments` e `/loans/me` são buscados de novo.
- CA-03 · Uma recusa (409, por exemplo) mostra o `message` da API sem reescrita.
- CA-04 · Um 401 na devolução encerra a sessão e volta à tela de login.

## Fora de escopo
Confirmação em janela modal, histórico de devoluções, tela de Operações.
