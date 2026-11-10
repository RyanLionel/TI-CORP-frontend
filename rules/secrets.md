---
description: Onde cada variável de ambiente vive e qual chave usar
globs: ["**/.env*", "src/**", "vite.config.ts"]
alwaysApply: false
---

# Variáveis de ambiente e chaves
> leitor: agente

## Quando
Ao criar ou usar qualquer variável de ambiente, ao instanciar o client
do banco, ou ao escrever código que lê configuração.

## Procedimento
1. Chave pública (anon): só ela pode aparecer em código que roda no
   navegador (front, variáveis `VITE_*`). A proteção dela são as
   políticas de acesso (RLS) do banco.
2. Chave de serviço (service_role): ignora todas as políticas e só existe
   no repo back. Nunca no front, nunca em variável `VITE_*`.
3. Variável nova existe em TRÊS lugares ou em nenhum: `.env` local
   (sua máquina, ignorado pelo git), `.env.example` (versionado, sem
   valor) e o painel da Vercel (preview e production).
4. Ao criar uma variável, diga na resposta em quais dos três lugares
   você já a colocou e o que falta eu fazer à mão.

## Verificação
Uma busca por "service" no código do front (`src/`) não retorna
nada. `.env.example` tem todas as chaves que o projeto usa, sem
nenhum valor real. `git ls-files | grep '\.env'` só mostra `.env.example`.

## Não faça
- Não escreva valor de chave em resposta, commit, log ou comentário.
- Não crie variável só no `.env` local. Ela quebra o deploy e o erro
  só aparece no build da Vercel.
- Não contorne uma política de acesso trocando de chave. Se a política
  atrapalha, a política está errada: pare e me avise.
- Não grave senha de usuário (nem "senha padrão") em arquivo versionado.
