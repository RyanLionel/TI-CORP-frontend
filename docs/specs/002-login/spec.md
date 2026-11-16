# Spec — Login real (Supabase Auth)

> Status: pronta (2026-11-16). Decisões fechadas por Ryan em 2026-11-16; verificação: verificacoes/rodada-02.md (PRONTA, commit c5c59c3).

## Objetivo
A pessoa entra com e-mail e senha pelo Supabase Auth, chega à área logada e consegue sair. Substitui o login de protótipo da spec 000.

## Vínculo
PRD (repo back): seção Acesso e Restrições ("login corporativo") · ADR-001 (Supabase Auth; repo back) · ADR-002 (design system) · ADR-004 (testes) · spec 000 (protótipo que esta spec substitui) · spec 001 do back (o token vai para a API como `Authorization: Bearer`).

## Regras
1. Um formulário só, com e-mail e senha. O botão "Entrar como Operações" sai: o papel vem do banco (`profiles.role`) e a tela de Operações está fora de escopo (PRD).
2. O login usa `supabase.auth.signInWithPassword` com a chave pública (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Nunca a service_role (rules/secrets.md).
3. Credencial recusada: "E-mail ou senha incorretos", e a pessoa continua na tela de login. Outra falha: "Não foi possível entrar. Tente de novo."
4. Logada, a pessoa vê a área logada (por enquanto, o espaço onde entra o catálogo da spec 001 do front) com o e-mail dela e o botão "Sair" no topo.
5. A sessão continua ao recarregar a página (padrão do supabase-js).
6. "Sair" encerra a sessão e volta para a tela de login.
7. Os textos da tela de login seguem o PRD: até 5 itens por pessoa, prazo de 14 dias úteis.
8. Sem as variáveis `VITE_SUPABASE_*`, a tela mostra "Login não configurado" em vez de quebrar.

## Critérios de aceitação
- CA-01 · E-mail e senha válidos levam à área logada, com o e-mail da pessoa e o botão "Sair".
- CA-02 · Credencial recusada mostra "E-mail ou senha incorretos" e mantém a tela de login.
- CA-03 · Abrir o site com sessão já existente vai direto para a área logada.
- CA-04 · "Sair" encerra a sessão e volta para a tela de login.
- CA-05 · A tela de login não tem "Entrar como Operações" e diz "5 itens" e "14 dias úteis".
- CA-06 · Sem `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY`, a tela mostra "Login não configurado".

## Fora de escopo
Cadastro pela tela, recuperar senha, login social, tela de Operações, catálogo e empréstimos (spec 001 do front).

## Contrato afetado
Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`: já estão no `.env.example` e no passo 5 do `docs/producao.md` do back (painel da Vercel do front). Nenhum endpoint muda.
