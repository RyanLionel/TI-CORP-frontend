# Plano — Login real
Restrições: ADR-001 (Supabase Auth), ADR-002 (tokens e componentes), ADR-004 (Vitest; sem rede nos testes), rules/secrets.md (só `VITE_*` e chave anon).

1. `src/lib/supabase.ts` cria o client do supabase-js a partir de `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`; exporta `null` se faltar alguma (CA-06).
2. `src/auth/useSession.ts`: lê a sessão atual (`getSession`) e acompanha mudanças (`onAuthStateChange`). É o que faz a sessão continuar ao recarregar (CA-03).
3. `src/pages/Login.tsx`: a marcação de login que já existe no `main.tsx` (base local, ADR-002), com um formulário só e os textos do PRD (CA-05); chama `signInWithPassword` e mostra os erros da regra 3 (CA-01, CA-02).
4. `src/pages/Area.tsx`: topo com o e-mail da pessoa e "Sair" (`signOut`) (CA-01, CA-04); o corpo fica reservado para o catálogo (spec 001 do front).
5. `src/main.tsx` só monta o `App`, que escolhe Login ou Area pela sessão. O `HealthStatus` (AZ-05) continua na tela de login.
6. Testes em `src/**/*.test.tsx` com dublê de `src/lib/supabase.ts` (`vi.mock`): nenhuma chamada de rede.
