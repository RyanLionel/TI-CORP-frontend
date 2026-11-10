# ADR-002: Design System

## Decisões

| Item | Escolha |
|---|---|
| Base visual | Nocturne adaptado à marca EMPREST.AI |
| Tema | Escuro, de baixa cromia e densidade operacional |
| Cor de acento | Teal `#2fb8ac` |
| Tipografia | Raleway (400, 500, 600 e 700) |
| Tokens | Variáveis CSS compartilhadas em `:root` |
| Componentes | Componentes reutilizáveis ou classes equivalentes do design system |
| Ícones | Phosphor Icons |
| Layout | Flexbox ou Grid com `gap` |
| Acessibilidade | Foco visível, estados desabilitados e contraste por tokens |
| Animações | Curtas e discretas; sem escala, parallax ou sombras pulsantes |

## Justificativas

- **Base visual:** o Nocturne atende ao contexto de uma ferramenta interna ao priorizar superfícies escuras, informação densa e cromia baixa. A adaptação preserva esse caráter e aplica a marca EMPREST.AI.
- **Tema:** um único tema escuro reduz decisões por tela e mantém a leitura de estados operacionais consistente.
- **Cor de acento:** o teal identifica a marca e diferencia ações, foco, ícones e destaques sem competir com informações semânticas de atraso, manutenção e empréstimo.
- **Tipografia:** Raleway oferece uma única família para títulos, interface e corpo, reduzindo variações tipográficas.
- **Tokens:** tokens CSS centralizam cores, raios, fontes e espaçamentos, permitindo evolução visual sem alterar cada tela.
- **Componentes:** botões, campos, tags, cards, navegação, tabelas, diálogos e toasts reutilizáveis evitam comportamentos e estilos divergentes.
- **Ícones:** Phosphor Icons fornece um conjunto consistente de ícones para a interface.
- **Layout:** Flexbox e Grid com `gap` mantêm espaçamento previsível e evitam margens usadas apenas para separar elementos irmãos.
- **Acessibilidade:** foco visível e estados desabilitados padronizados tornam os controles identificáveis por teclado e evitam estados ambíguos.
- **Animações:** transições sutis informam mudança de estado sem reduzir a percepção de ferramenta operacional.

## Alternativas descartadas

- **Tema claro como padrão:** não representa a direção visual definida para o produto nesta versão.
- **Acento aplicado em grandes preenchimentos:** reduz a densidade e contraria a identidade definida, em que o teal é linha, brilho e destaque.
- **Paleta e espaçamentos definidos por tela:** aumenta a inconsistência e o custo de manutenção.
- **Estilos inline como padrão permanente:** dificulta o reuso de tokens, estados e componentes entre as telas.
- **Biblioteca de componentes externa como fonte visual:** não foi adotada para preservar os tokens e o comportamento próprios do produto.

## Consequências

**Fica mais fácil:**

- Criar telas consistentes para Catálogo, Empréstimos, Operações e Equipamentos.
- Comunicar visualmente os estados de disponível, emprestado, atraso e manutenção.
- Atualizar identidade visual, contraste, tipografia e espaçamento de forma centralizada.
- Reutilizar comportamentos de foco, hover, pressionado, desabilitado, diálogo e toast.
- Revisar acessibilidade visual de forma uniforme.

**Fica mais difícil:**

- Introduzir uma nova cor, raio, escala ou componente sem avaliar o impacto no sistema existente.
- Usar variações visuais livres em protótipos ou telas isoladas.
- Manter a fidelidade da fonte Raleway quando o carregamento externo estiver indisponível; será necessário fallback `sans-serif`.
- Garantir a densidade do desktop em telas menores sem validar responsividade e navegação por teclado.

**O que isso impede de fazer depois sem custo:**

- Trocar para um tema claro ou outra linguagem visual sem revisar todos os componentes e estados semânticos.
- Substituir o teal como acento sem atualizar tokens, componentes, marca e referências visuais.
- Adotar uma biblioteca de UI com design próprio sem criar uma camada de adaptação aos tokens EMPREST.AI.
- Mudar a tipografia sem revisar métricas, quebras de texto e dimensões dos componentes.

## O que este ADR NÃO decide

- Arquitetura interna do frontend, roteamento ou gerenciamento de estado.
- Biblioteca de componentes ou de CSS concreta.
- Conteúdo e regras de negócio de cada página.
- Autenticação, autorização, Supabase ou RLS.
- Tema claro, internacionalização ou customização visual por usuário.
- Implementação definitiva dos componentes; esta decisão define seus contratos visuais e de interação.

## Referências

- [ADR-001 — Stack](001-stack.md)
- [Especificação visual do protótipo](../../layout.md)
