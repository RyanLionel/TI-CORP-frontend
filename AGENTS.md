# EMPREST.AI — Front

Interface web do EMPREST.AI (empréstimo de equipamentos de TI), papéis
Colaborador e Operações. Este repositório é só o front; o back, o banco e
o PRD ficam em https://github.com/RyanLionel/TI-CORP.

## Onde olhar
- PRD e ADR-001 (stack geral): repo back, `docs/PRD.md` e `docs/adr/001-stack.md`.
- docs/adr/ — decisões deste repo (002 design system).
- docs/specs/<NNN-nome>/ — spec, plano e tarefas de cada tela.
- rules/restrictions.md — leia sempre, antes de qualquer tarefa. As demais
  rules têm gatilho próprio (campo "Quando").
- layout.md — referência visual do protótipo (vale via ADR-002).
- agents/ — subagentes (ver Subagentes).

## Comandos
Verificados, a partir da raiz:
- instalar: `npm install`
- rodar em desenvolvimento: `npm run dev` (http://localhost:5173)
- buildar e checar tipos: `npm run build`

## Ambiente
- Front em Vite + React + TypeScript (SPA). Deploy na Vercel (projeto ti-corp-frontend).
- Back em outro repositório, com outra Vercel. O contrato da API vem de lá.
- Configuração só por variável de ambiente; ver .env.example. O Vite só
  expõe variáveis `VITE_*`.

## Precedência
Se dois artefatos discordarem sobre comportamento, a spec vence o código.
Se algo não estiver escrito em lugar nenhum, pergunte — não decida.
Contrato de API: vale o do repo back.

## Convenções não óbvias
- Dependência com versão exata (sem `^`, `~` ou `latest`) e release com mais de 7 dias.
- Spec com critérios CA-xx; teste e commit citam o CA que atendem.
- CA que depende de API, banco ou RLS é verificado no repo back
  (status OUTRO REPOSITÓRIO no verificador).
- Interface em português do Brasil, sem emoji.
- O `tsconfig.node.json` não emite arquivos: não reative `emit`, senão surge
  um `vite.config.js` que o Vite passa a preferir ao `.ts`.

## Subagentes
- agents/verificador-spec.md — confere uma spec contra a implementação.
  Obrigatório antes de declarar qualquer spec pronta. Não corrige nada.

## Skills
- Ficam em skills/<nome>/SKILL.md. Ainda não existe nenhuma.
- Em conflito, rules/ e docs/adr/ vencem qualquer skill.

## Estado atual do projeto
Existe: componente Health (AZ-05 do andar zero) que consulta GET /health da API; em dev o Vite faz proxy para localhost:3000. Tela de login (protótipo, spec 000), sem login real (sem Supabase). `npm run build` passa.
Não existe: suíte de testes, catálogo, empréstimos, operações, skills/, .mcp.json.
