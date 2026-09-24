---
name: Alibi
description: Uma mesa de investigação para reconstruir uma versão dos acontecimentos.
colors:
  site-ink: "#242437"
  site-deep: "#151724"
  site-paper: "#EBE3DB"
  site-paper-strong: "#FFF1E4"
  site-paper-ink: "#2B2835"
  site-paper-muted: "#5C5864"
  site-coral: "#E57465"
  site-teal: "#4EC9C0"
  site-brass: "#F4B96B"
  site-brass-dark: "#855048"
  background-base: "var(--color-bg-base)"
  background-surface: "var(--color-bg-surface)"
  background-elevated: "var(--color-bg-elevated)"
  background-inset: "var(--color-bg-inset)"
  border-subtle: "var(--color-border-subtle)"
  border-strong: "var(--color-border-strong)"
  text-primary: "var(--color-text-primary)"
  text-secondary: "var(--color-text-secondary)"
  text-muted: "var(--color-text-muted)"
  projector-amber: "var(--color-accent)"
  projector-focus: "var(--color-accent-strong)"
  ink-on-amber: "var(--color-on-accent)"
  oxblood: "var(--color-danger)"
  danger-copy: "var(--color-danger-text)"
  bone-evidence: "#D8C8A4"
  evidence-ink: "#19150F"
  board-wall: "var(--board-wall)"
  miniature-contour: "#241820"
  miniature-contour-deep: "#1A1A1A"
  miniature-seam: "#654246"
  miniature-highlight: "#D8B777"
  evidence-amber-ink: "#62400B"
  evidence-danger-ink: "#641F19"
  step-numeral: "#F1E8CE"
  step-numeral-selected: "#FFF7E4"
  board-vignette: "rgba(24, 14, 19, 0.18)"
  board-keylight: "rgba(255, 244, 211, 0.08)"
  # 3D dollhouse (src/scene3d/renderer.ts): the Kenney palette is lit, not painted
  scene-shell-face: "#F1EBE0"
  scene-shell-cap: "#D9CFBF"
  scene-partition-face: "#ECE3D3"
  scene-partition-cap: "#CDBFA8"
  scene-plinth: "#D6C19F"
  scene-night-glass: "#22303F"
  scene-floor-tile: "#DED8C8"
  scene-floor-grass: "#8CBF6C"
  scene-floor-stone: "#B8B2A6"
  scene-light-key: "#FFE2B8"
  scene-light-sky: "#FFF8EC"
  scene-light-ground: "#9C8266"
  scene-lane-row: "#FFB547"
  scene-lane-col: "#5AC8FF"
  scene-lane-locked: "#4CAF72"
  scene-lane-blocked: "#8A6CFF"
  scene-lane-conflict: "#FF3B3B"
  scene-clue-wash: "#FFF2C8"
typography:
  display:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 2.8rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.01em"
  action:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.08em"
  evidence:
    fontFamily: "Courier Prime, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
  technical-label:
    fontFamily: "Courier Prime, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.18em"
  ui:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.1em"
  reveal:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
  verdict:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.35em"
  section:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.02em"
  panel-title:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
  subject:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
  copy:
    fontFamily: "Courier Prime, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  headline-wide:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.01em"
rounded:
  square: "0"
  micro: "2px"
  token: "6px"
spacing:
  hairline: "4px"
  compact: "8px"
  panel: "12px"
  roomy: "16px"
components:
  masthead-navigation:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-primary}"
    typography: "{typography.technical-label}"
    rounded: "{rounded.square}"
    padding: "0 12px"
    height: "64px"
  button-primary:
    backgroundColor: "#167A7A"
    textColor: "{colors.site-paper-strong}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "16px"
    height: "44px"
  button-tool:
    backgroundColor: "{colors.background-surface}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "0 14px"
    height: "44px"
  filter-chip:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.technical-label}"
    rounded: "{rounded.square}"
    size: "44px"
  search-field:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-primary}"
    typography: "{typography.evidence}"
    rounded: "{rounded.square}"
    padding: "0 12px 0 40px"
    height: "44px"
  case-card:
    backgroundColor: "{colors.bone-evidence}"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.square}"
    padding: "14px"
  continuity-frame:
    backgroundColor: "#E2D7BD"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
    height: "52px"
  suspect-evidence:
    backgroundColor: "#DDD1B3"
    textColor: "{colors.evidence-ink}"
    typography: "{typography.evidence}"
    rounded: "{rounded.square}"
    padding: "10px"
  notes-field:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-primary}"
    typography: "{typography.evidence}"
    rounded: "{rounded.square}"
    padding: "12px"
---

# Sistema visual do site: Alibi

## Visão geral

**Princípio criativo: “Mesa de investigação viva”.**

A interface combina uma moldura em violeta profundo com áreas de leitura em papel quente. Coral, azul-esverdeado e dourado quente dão ritmo à hierarquia e ajudam a encontrar a próxima ação. A maquete Kenney continua a ser o elemento visual principal: a interface enquadra-a sem alterar a sua arquitetura, materiais ou luz.

A referência à temporada 2, episódio 9 de *Arcane*, orienta apenas a intensidade dramática e o contraste de cores quentes e frias. A linguagem gráfica é própria de Alibi. O resultado mantém a identidade de um jogo de dedução, com pistas e comandos claros, em vez de se tornar um cartaz cinematográfico.

O site tem quatro momentos com pesos distintos: descoberta do jogo, escolha de um caso, investigação e conclusão. A mesma paleta liga estes momentos, enquanto o papel destaca informação que pede leitura e decisão.

O registo da revisão visual e funcional, com as capturas correspondentes e a referência oficial usada para contexto de inspiração, está em docs/SITE_REDESIGN_V1.md.

## Cores

### Tinta e papel

- **Tinta violeta** (site-ink, site-deep): fundo, cabeçalho e moldura da aplicação. O violeta dá profundidade sem competir com a cena.
- **Superfícies de apoio** (background-surface): painéis de comando e áreas auxiliares acompanham o tema global.
- **Papel quente** (site-paper, site-paper-strong): pistas, processo, informação do caso e conclusão. O fundo claro facilita a leitura prolongada.
- **Tinta de papel** (site-paper-ink, site-paper-muted): texto principal e informação secundária sobre o papel.

### Sinais de cor

- **Azul-esverdeado** (site-teal, #167A7A): ação principal, seleção e foco. O tom luminoso aparece como contorno sobre violeta; o tom escuro sustenta texto claro num botão.
- **Coral** (site-coral): ênfase editorial curta, como uma palavra do título ou o destaque do caso diário.
- **Dourado quente** (site-brass, site-brass-dark): filetes, números e pequenos detalhes. O tom escuro serve para texto sobre papel; o tom claro fica reservado a marcas decorativas com contraste suficiente.

**Regra dos sinais.** A cor acompanha uma ação, um estado ou uma relação visual. Não se usa como ornamento constante, nem se pede ao jogador que distinga estados apenas pela cor. As pistas de erro e sucesso mantêm texto e símbolo próprios.

**Limite entre aplicação e tabuleiro.** A nova paleta pertence à moldura do site. Os materiais da cena, a luz e os sinais lógicos do tabuleiro mantêm os tokens atuais. O azul-esverdeado e o coral da interface não repintam paredes, mobiliário nem estados da grelha. Na variante clara, o violeta permanece nos elementos estruturais e os sinais de coral, azul-esverdeado e dourado quente conservam os mesmos papéis. A vista 3D e o tema global da aplicação podem seguir comportamentos próprios; a paleta do invólucro não exige que mudem.

## Tipografia

**Títulos:** Barlow Condensed, com alternativa sem serifa do sistema.

**Texto de leitura:** Hanken Grotesk, com alternativa sem serifa do sistema.

**Dados e metadados curtos:** Courier Prime, com alternativa monoespaçada do sistema.

Barlow dá presença aos títulos e nomes. Hanken mantém as instruções e pistas confortáveis de ler. Courier Prime distingue códigos, contagens e etiquetas breves sem transformar parágrafos em texto técnico.

### Hierarquia

- **Título principal:** marca e título da página.
- **Título de secção:** biblioteca, processo e blocos de conteúdo.
- **Texto de leitura:** pistas, instruções, notas e resultado, com corpo suficiente para leitura continuada.
- **Metadados:** dificuldade, progresso, contagens e referência do caso; nunca carregam sozinhos informação essencial.

A tipografia condensada fica nos títulos e rótulos curtos. As letras espaçadas não se aplicam a parágrafos. Os textos de pista não descem ao tamanho de legenda.

## Composição do site

A largura do conteúdo cresce com o ecrã sem ocupar toda a área disponível. A entrada começa por uma imagem da maquete real e pelo caso diário; a biblioteca destaca progresso e diferenças entre casos. O cabeçalho mantém a marca, a navegação e os comandos globais compactos.

### Ecrãs largos

A partir de 1 024 px, a vista de jogo distribui a área por uma cena ampla e um processo lateral. A maquete recebe a maior parte do espaço. A coluna lateral reúne sequência, suspeitos, pistas e notas; a ação de conclusão fica sempre visível. A sequência não atravessa a largura da cena.

### Ecrãs estreitos

Abaixo de 1 024 px, o conteúdo segue uma coluna: cabeçalho, sequência, cena, ferramentas, pistas e notas. A sequência pode deslocar-se horizontalmente, mas cada nome continua legível. Os controlos não cobrem a grelha nem uma pista. Os elementos secundários não empurram a cena para baixo da primeira parte útil do ecrã.

## Profundidade e movimento

O fundo violeta pode receber manchas suaves de luz coral e azul-esverdeada. A cor permanece subtil junto da cena, sem filtro por cima da maquete. O papel recebe contornos e sombras direcionais discretas; superfícies comuns não ganham sombras genéricas.

As transições ajudam a mostrar seleção, abertura ou mudança de estado. O foco por teclado usa um contorno firme, não um brilho difuso. Com a preferência por movimento reduzido, as transições e animações perdem duração ou deixam de ocorrer.

## Formas

A estrutura usa retângulos nítidos e separadores finos. O papel pode usar um canto recortado ou uma pequena margem impressa para lembrar um documento de investigação. A hierarquia vem da escala, do espaço, da cor e da posição; os cantos arredondados ficam reservados a detalhes que os pedem.

## Componentes

### Cabeçalho

- **Perfil:** instrumento de navegação compacto, com a marca e as ações globais.
- **Forma:** faixa horizontal de contraste suficiente, com divisórias discretas.
- **Estados:** todos os comandos têm área de toque adequada, indicação visível ao passar o ponteiro e contorno de foco por teclado.

### Ações e controlos

- **Ação principal:** botão azul-esverdeado escuro com texto claro. O rótulo identifica a tarefa; a cor não substitui o verbo.
- **Ferramentas:** controlos de superfície violeta, com estado selecionado distinguível por contorno e rótulo.
- **Filtros:** mostram claramente a opção escolhida e mantêm dimensões táteis consistentes.
- **Foco:** contorno firme, com contraste sobre papel e violeta. O foco não depende de sombra ou animação.

### Folhas e painéis

- **Caso diário:** folha clara com título, progresso e uma ação principal.
- **Biblioteca:** blocos de caso com dificuldade e estado de conclusão visíveis.
- **Processo:** papel quente para pessoas e pistas; a seleção recebe um sinal lateral azul-esverdeado.
- **Notas:** campo de texto com rótulo, limite claro, estado de gravação e confirmação antes de apagar.
- **Resultado:** folha de conclusão com veredicto, pessoa identificada, dados da sessão e próximo passo.

### Campos e leitura

A pesquisa e as notas têm rótulos acessíveis, limites visíveis e foco próprio. Uma mensagem de conflito explica o que aconteceu. O estado desativado continua legível. A informação importante não fica escondida apenas num símbolo, numa cor ou num efeito ao passar o ponteiro.

### Illustrated Reconstruction Board

Each case is an authored 3D scene laid over the unchanged logical board (Midnight Delivery is the golden master). Architecture comes first: a continuous north/west shell with windows and the front door, south/east walls cut to a plinth, cut-down partitions with door frames, pony walls where furniture must back onto the camera side. Interior flooring forms a continuous architectural surface except at a declared stairwell. Tile and stone distinguish uses; exterior and courtyard zones lower the terrain and create physical transitions. Rugs belong to furniture groups and never bridge a stairwell. These choices do not draw logical room boundaries.

Every logical furnishing keeps an explicit `logic` association with a visual object that touches its cells; models render at Kenney's real size (there is no per-object scale). Small props declare a supporting surface. Before interaction there are no cell markers, row bands, column bands or room labels. A selected cell retains its visible boundary after the pointer leaves. Placement mode reveals restrained floor cues for available lanes. Active and completed rows and columns use floor washes painted on the floor (occluded by furniture), thin dashed traces and small endpoints; they never outline every cell.

### Leitura da seleção e de dois pisos

A célula ativa usa um contorno escuro exterior e um contorno claro interior, com espessura estável no ecrã. O sinal permanece legível sobre móveis e pavimentos claros ou escuros. Uma pessoa colocada mantém o contorno nos pés; um conflito acrescenta tracejado, símbolo de aviso e texto. A cor reforça o significado, mas não o comunica sozinha.

O texto de apoio identifica a célula e a divisão e distingue ocupação, conflito, ajuda e disponibilidade de linha/coluna. «Linha e coluna livres» descreve uma possibilidade de colocação, não a resposta do caso. As setas deslocam o foco na grelha, Enter ou espaço executam a ação e a seleção pertence ao caso e piso ativos.

A ajuda pedida tem um contorno creme/âmbar próprio sobre o alvo. Não a confundas com os sinais de colocação nem a atives automaticamente ao selecionar uma pessoa. Mantém a linguagem material de tinta, papel e âmbar; não acrescentes brilhos saturados nem uma grelha permanente.

Nos casos de dois pisos, as arestas do contexto fantasma descrevem paredes e lajes sem diagonais da malha. À altura real, a escada mantém volume legível através do vão; o panorama explodido torna a escada do contexto translúcida. A composição deve permitir compreender pé, subida, chegada e circulação na vista normal. Quarto, escritório, instalações sanitárias e zona de leitura devem ter relações de mobiliário reconhecíveis, com tapetes fora do vão.

### Named Rules

**The Hidden Logic Rule.** A stranger who sees the idle environment should describe a miniature apartment, not a grid. The Murdoku topology appears only as solving feedback and never dictates the architectural rhythm.

**The Asked-For Help Rule.** The board answers a clue with an amber square around its actual target cells, and only when the player presses that suspect's locate control. Help is requested, never volunteered: selecting a suspect is a placement action and must not light the board. There is deliberately no drawn clue-to-board connector; a line between two independently sized layout regions can only be positioned by guessed percentages, and it pointed into empty space at every viewport it was not tuned on.

**The Kenney World Rule.** Kenney's 3D models define the visual world at their real size and grounding. Objects are placed by relationship: against a wall face, on a surface, at a point; never by pixel offset, lift or scale.

## Do's and Don'ts

### Do:

- **Do** keep theme-aware chrome and fixed evidence/board materials as separate layers.
- **Do** preserve a continuous apartment shell, clear doorways, believable circulation and furniture relationships.
- **Do** keep logical furniture associations explicit while allowing independent visual placement.
- **Do** keep room names accessible without painting them permanently on the floor.
- **Do** use real buttons, 44px targets, visible focus, keyboard board navigation, and reduced-motion fallbacks.
- **Do** keep avatar use to the active dossier; use inexpensive accent markers in the case catalog.
- **Do** test both themes at phone and desktop widths with the board, clues, and accusation all visible and legible.

### Don't:

- **Don't** turn the interface into a generic rounded-card dashboard, glass surface, neon cyberpunk scene, or full-screen parchment tableau.
- **Don't** build walls from puzzle-cell boundaries or repeat short panels into a maze, staircase or office-cubicle plan.
- **Don't** place props on the floor when they require a desk, table, shelf or counter.
- **Don't** expose a permanent grid, placement circles or saturated row and column bands.
- **Don't** use the translucent board glow as a focus ring or the subtle border as an interactive boundary.
- **Don't** load every suspect portrait in the home catalog.
- **Don't** remount the accusation button to replay rejection motion; preserve focus and restart the CSS animation in place.
