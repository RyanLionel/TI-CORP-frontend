# Plano de implementação — página inicial

## Abordagem

Construir a tela de acesso como componente React isolado no frontend, com estado local apenas para o feedback do protótipo. Não conectar o formulário a uma API até que a autenticação tenha contrato, variáveis de ambiente e políticas RLS definidos.

## Etapas

1. Criar a base do frontend TypeScript + React e definir o ponto de montagem da aplicação.
2. Implementar a composição da tela em duas áreas semânticas: apresentação e acesso.
3. Criar o componente da marca EMPREST.AI e os blocos de regras de empréstimo.
4. Implementar o formulário de e-mail e senha com validação HTML nativa, labels e atributos de autocomplete.
5. Adicionar o estado local que mostra feedback ao enviar como colaborador ou selecionar Operações.
6. Aplicar os tokens visuais do `layout.md`: cores, tipografia Raleway, bordas, espaçamento, foco e hovers.
7. Adicionar breakpoints para apresentar o conteúdo em uma coluna no celular.
8. Validar navegação por teclado, contraste e ausência de rolagem horizontal em viewport estreita.
9. Quando a autenticação estiver especificada, substituir os handlers locais por chamadas ao fluxo de login e redirecionar conforme o papel retornado.

## Estrutura esperada

```text
front/
├── index.html
├── package.json
├── src/
│   ├── main.tsx
│   └── styles.css
└── vite.config.ts
```

## Estado do protótipo

| Evento | Estado local | Resultado visual |
|---|---|---|
| Envio válido do formulário | `notice = acesso validado` | Mensagem de confirmação para o fluxo de colaborador |
| Clique em Operações | `notice = operações selecionado` | Mensagem de confirmação para o fluxo operacional |
| Campo inválido | validação nativa do navegador | O envio é interrompido e o campo informa erro |

## Validação

- Executar verificação de tipos e build do frontend.
- Verificar a renderização em desktop (1440px) e celular (360px).
- Testar Tab/Shift+Tab nos campos e botões.
- Confirmar que o formulário não envia sem valores obrigatórios.
- Confirmar que os dois CTAs apresentam mensagens diferentes no protótipo.

## Riscos e mitigação

- **Autenticação ainda não definida:** manter a integração fora desta feature e não simular credenciais válidas.
- **Fonte externa indisponível:** definir fallback para fonte sem serifa do sistema, preservando legibilidade.
- **Expansão de escopo:** não incluir recuperação de senha ou gestão de usuários nesta tela.
