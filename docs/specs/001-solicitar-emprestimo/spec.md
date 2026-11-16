# Spec — Solicitar empréstimo (lado do front)

> Status: rascunho. Decisões fechadas por Ryan em 2026-11-16.
> Dona do comportamento e do contrato: spec 001 do repo back (TI-CORP, docs/specs/001-solicitar-emprestimo). Esta spec cobre só as telas; regra de negócio, banco e RLS são provados lá.

## Objetivo
A pessoa logada vê o catálogo, solicita um equipamento disponível, entende quando é recusada e acompanha os próprios empréstimos em aberto.

## Vínculo
PRD (back): Catálogo, Solicitar, Limite, Atraso, Manutenção · spec 001 do back (contrato REST; CA-11 é deste repo) · spec 002 do back (fotos e crédito "Fotos: Pixabay") · spec 002-login (sessão e token) · ADR-002 (design) · ADR-004 (testes).

## Regras
1. A área logada tem duas seções: Catálogo e Meus empréstimos.
2. Cada cartão mostra imagem, nome, categoria, patrimônio e situação (Disponível, Emprestado, Em manutenção). Sem imagem (`imagem: null`), um espaço 4:3 com o nome da categoria.
3. O rodapé do catálogo mostra sempre "Fotos: Pixabay" com link para https://pixabay.com (exigência da API; spec 002 do back).
4. Busca por nome ou patrimônio e filtro por situação, na própria tela (PRD, Catálogo).
5. "Solicitar" só aparece em equipamento disponível. Sucesso: "Empréstimo criado. Devolução até dd/mm/aaaa", e catálogo e meus empréstimos são recarregados.
6. Recusa (409): a tela mostra o `message` da API, sem reescrever.
7. Meus empréstimos: nome do equipamento (cruzado com o catálogo), "Devolução até dd/mm/aaaa" e a etiqueta "Atrasado" quando `atrasado`. Sem empréstimos: "Você não tem empréstimos em aberto."
8. Datas em dd/mm/aaaa, fuso America/Sao_Paulo.
9. Toda chamada à API leva `Authorization: Bearer <access_token da sessão>`. Resposta 401: a sessão é encerrada e a pessoa volta ao login.
10. Em desenvolvimento, o Vite repassa `/health`, `/equipments` e `/loans` para a API local; em produção, `VITE_API_URL` aponta para a API.

## Critérios de aceitação
- CA-01 · O catálogo lista os equipamentos da API com nome, categoria, patrimônio, situação e imagem, ou o espaço da categoria quando não há imagem.
- CA-02 · O catálogo mostra "Fotos: Pixabay" com link para https://pixabay.com. (CA-11 do back)
- CA-03 · Busca por nome ou patrimônio e filtro por situação reduzem a lista.
- CA-04 · Só equipamento disponível tem "Solicitar"; solicitar envia `POST /loans` com o id e mostra "Empréstimo criado. Devolução até dd/mm/aaaa", recarregando catálogo e meus empréstimos.
- CA-05 · Uma recusa 409 mostra o motivo que veio da API. (CA-11 do back)
- CA-06 · Meus empréstimos mostra nome, "Devolução até dd/mm/aaaa" e "Atrasado" quando for o caso; sem empréstimos, mostra "Você não tem empréstimos em aberto."
- CA-07 · Resposta 401 da API encerra a sessão e volta ao login.
- CA-08 · Toda chamada à API envia `Authorization: Bearer` com o token da sessão.

## Textos e detalhes de interface (propostos pelo agente na implementação, apontados pela rodada 01; revisar)
- Lista filtrada sem resultado: "Nenhum equipamento encontrado."
- 401 da API: "Sua sessão expirou." antes de voltar ao login.
- Enquanto carrega: "Carregando catálogo…"; falha de carga: alerta com o motivo.
- Nomes de categoria na tela: Notebook, Monitor, Cabo, Câmera, Acessório.
- Empréstimo cujo equipamento não está no catálogo: "Equipamento".

## Fora de escopo
Devolução, tela de Operações, cadastro de equipamento, reserva futura, renovação, notificação. Regras de negócio (limite, atraso, concorrência): provadas no back.

## Contrato afetado
Consome `GET /equipments`, `POST /loans` e `GET /loans/me` da spec 001 do back, sem mudança. `vite.config.ts` ganha o proxy de `/equipments` e `/loans`.
