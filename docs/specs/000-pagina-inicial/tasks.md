# Tarefas — página inicial

## Especificação

- [x] Documentar objetivo, escopo e critérios de aceitação.
- [x] Documentar plano técnico e limites do protótipo.
- [ ] Validar a spec com Produto e Operações.

## Frontend

- [x] Criar a estrutura base da tela de acesso em React.
- [x] Implementar a área de apresentação e a marca EMPREST.AI.
- [x] Implementar os campos de e-mail e senha com labels e validação nativa.
- [x] Implementar CTAs para Colaborador e Operações com feedback local.
- [x] Aplicar layout responsivo, tokens de cor e estados de foco/hover.
- [x] Posicionar a implementação no diretório de frontend definitivo: a raiz deste repositório (Vite + React).

## Qualidade

- [x] Executar `build` e verificação de tipos: `npm run build` passa (ainda sem suíte de testes).
- [ ] Fazer revisão visual em 1440px e 360px.
- [ ] Validar navegação por teclado e mensagens de formulário.

## Integração futura

- [ ] Definir o contrato de autenticação com o backend.
- [ ] Configurar Supabase Auth e variáveis de ambiente.
- [ ] Definir e aplicar políticas RLS para os papéis Colaborador e Operações.
- [ ] Substituir os feedbacks locais por autenticação, sessão e redirecionamento reais.
