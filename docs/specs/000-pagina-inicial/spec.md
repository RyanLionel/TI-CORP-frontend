# Página inicial — acesso ao EMPREST.AI

## Vínculo

PRD: repo back (TI-CORP), `docs/PRD.md`, seção Acesso · ADRs que restringem: ADR-002 (design system, neste repo) e ADR-001 (stack, repo back) · Referência visual: `layout.md`

## Objetivo

Disponibilizar a primeira tela do sistema EMPREST.AI para apresentar o propósito do produto e permitir que uma pessoa inicie uma sessão como **Colaborador** ou **Operações**.

Esta é uma tela de entrada do protótipo. Nesta etapa, os dados de credenciais não são validados por um serviço de autenticação real; as ações devem fornecer feedback visual e preparar a transição de tela definida para cada papel.

## Problema

Pessoas que precisam emprestar equipamentos de TI ainda não têm um ponto de entrada claro para o catálogo, nem um caminho explícito para a visão operacional. A página inicial deve comunicar regras básicas do serviço e separar esses dois acessos sem sobrecarregar o usuário.

## Histórias de usuário

- Como colaborador, quero entender o limite e o prazo de empréstimo antes de entrar no catálogo.
- Como colaborador, quero entrar com meu e-mail e senha corporativos para acessar o catálogo.
- Como pessoa de Operações, quero um acesso próprio para ir à visão de acompanhamento dos empréstimos.

## Escopo

### Incluído

- Tela única de login em português do Brasil.
- Identidade visual EMPREST.AI, conforme `layout.md`.
- Formulário com os campos obrigatórios **E-mail corporativo** e **Senha**.
- Ação principal **Entrar**, que encaminha o colaborador ao Catálogo após a autenticação existir.
- Ação secundária **Entrar como Operações**, que encaminha à tela de Operações após a autenticação existir.
- Texto de privacidade: “Cada pessoa vê apenas os próprios empréstimos.”
- Layout responsivo para larguras de desktop e celular.
- Estados de foco, validação nativa de campos obrigatórios e feedback de ação no protótipo.

### Não incluído

- Integração com Supabase Auth, RLS ou backend NestJS.
- Recuperação e alteração de senha.
- Cadastro de contas, SSO e MFA.
- Persistência de sessão.
- Catálogo, empréstimos, operações e cadastro de equipamentos; essas telas terão suas próprias specs.

## Critérios de aceitação

- CA-01 · A página usa fundo `#161826`, superfícies escuras e o acento teal `#2fb8ac`, sem áreas grandes preenchidas pelo acento.
- CA-02 · Em telas de referência de 1360–1440px, a página é dividida em duas colunas: apresentação à esquerda e acesso à direita.
- CA-03 · A coluna de apresentação contém a marca EMPREST.AI, o título “O equipamento certo, quando você precisa.”, uma descrição e as estatísticas `3 itens por pessoa`, `14 dias de prazo` e `0 linhas para preencher`.
- CA-04 · A coluna de acesso contém o título “Entrar”, texto de apoio, campos de e-mail e senha, botão principal e o atalho de Operações.
- CA-05 · Os campos são semanticamente identificados por `label`, têm `autocomplete` apropriado e indicam foco de forma visível.
- CA-06 · Não é possível enviar o formulário sem preencher e-mail válido e senha.
- CA-07 · Ao enviar o formulário no protótipo, a interface apresenta um feedback de sucesso sem recarregar a página.
- CA-08 · Ao selecionar “Entrar como Operações”, a interface apresenta um feedback específico para o papel selecionado.
- CA-09 · Em viewport de até 760px, as colunas passam a uma única coluna e nenhum conteúdo fica oculto ou exige rolagem horizontal.
- CA-10 · Textos, datas futuras e interações devem permanecer em português do Brasil, sem emojis ou mensagens promocionais.

## Regras e decisões

- A marca deve combinar um símbolo quadrado contornado em teal e o texto `EMPREST.AI`, com `.AI` no acento.
- A tipografia é Raleway nos pesos 400, 500, 600 e 700.
- O botão principal é contornado, não preenchido; em hover recebe somente tint teal discreto.
- O login real será conectado ao Supabase somente após a definição de autenticação e políticas de RLS.
- A transição de tela esperada é: **Entrar** → Catálogo (Colaborador); **Entrar como Operações** → Operações.

## Dependências

- `layout.md` como referência visual.
- ADR-001 (repo back) para a futura integração com a API NestJS e o Supabase.
- Definição futura dos fluxos de autenticação e das políticas RLS.

## Fora da v1

- Login social e diretório corporativo.
- Lembrar sessão entre dispositivos.
- Gestão de permissões além dos papéis Colaborador e Operações.

## Contrato afetado

Tela de login em `src/main.tsx` e `src/styles.css`. Nenhum endpoint, tabela ou política de acesso muda nesta spec.
