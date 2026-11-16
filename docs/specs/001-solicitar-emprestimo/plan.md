# Plano — Solicitar empréstimo (front)
Restrições: contrato da spec 001 do back · ADR-002 (tokens e componentes) · ADR-004 (Vitest; sem rede nos testes) · rules/secrets.md (só `VITE_*`).

1. `src/lib/api.ts`: `apiFetch` com base em `VITE_API_URL`, `Authorization: Bearer`, erro tipado com status e `message` da API; tipos `Equipamento` e `MeuEmprestimo` iguais ao contrato (CA-08).
2. `src/lib/datas.ts`: `formatarData` em dd/mm/aaaa no fuso America/Sao_Paulo (CA-04, CA-06).
3. `vite.config.ts`: proxy de `/equipments` e `/loans` para `http://localhost:3000`.
4. `src/pages/Area.tsx` carrega catálogo e meus empréstimos com o token da sessão, recarrega depois de solicitar e encerra a sessão em 401 (CA-07).
5. `src/components/Catalogo.tsx`: cartões, busca, filtro, "Solicitar", mensagens de sucesso e recusa, crédito "Fotos: Pixabay" (CA-01 a CA-05).
6. `src/components/MeusEmprestimos.tsx`: lista com nome, data e "Atrasado" (CA-06).
7. Testes com `fetch` e Supabase como dublês (ADR-004).
