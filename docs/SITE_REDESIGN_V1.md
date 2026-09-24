# Redesenho do site, versão 1

- **Data:** 24/09/2026
- **Base aprovada:** aa384c2f69ab6168786abccf04f713ad3ae24a58
- **Ramo:** sol/site-redesign-v1
- **Estado:** revisão visual e verificações funcionais concluídas.

## Objetivo visual

A interface passa a funcionar como uma mesa de investigação com uma identidade mais vibrante. O fundo usa tinta violeta profunda; folhas de papel quente organizam processos, pistas e resultados; coral, azul-esverdeado e dourado quente assinalam momentos importantes. A maquete tridimensional continua a ser o principal foco visual e mantém os materiais e a luz definidos para as cenas Kenney.

A referência à temporada 2, episódio 9 de *Arcane*, serve apenas para orientar a intensidade da luz, o contraste dramático e a relação entre cores quentes e frias. Para contexto de produção, consultar o artigo oficial da [Netflix Tudum](https://www.netflix.com/tudum/features/arcane-season-two-behind-the-scenes); esta página não foi usada como fonte de valores de cor. A composição, os símbolos, as letras e os elementos gráficos são próprios de Alibi. Não se reproduzem personagens, imagens ou elementos distintivos da série.

O redesenho resolve os problemas registados em docs/WEBSITE_REDESIGN_AUDIT.md: a página inicial passa a mostrar a maquete real; a biblioteca dá mais contexto ao progresso; a vista de jogo privilegia a cena e a leitura das pistas; a conclusão do caso recebe uma composição com escala adequada.

## Limite protegido

O trabalho abrange a apresentação do site: entrada, biblioteca, cabeçalho do caso, sequência de pessoas, painéis de pistas e notas, comandos e resultado. Os controlos mantêm as mesmas ações e regras.

A cena Kenney fica intocada. Não se alteram src/scene3d/, os dados dos casos, a geometria, a câmara, a iluminação da maquete, os materiais, nem as marcas lógicas da grelha. Os realces usados para comunicar seleção, conflito, ajuda ou disponibilidade no tabuleiro continuam sujeitos ao sistema existente. A nova paleta pertence ao invólucro da aplicação e não repinta a cena. Na variante clara, o violeta mantém-se nos elementos estruturais e os sinais coral, azul-esverdeado e dourado quente mantêm os mesmos papéis. A vista 3D e o tema global podem seguir comportamentos próprios; a paleta do invólucro não os obriga a mudar.

## Paleta e utilização

| Cor | Função | Utilização |
| --- | --- | --- |
| Violeta profundo, #151724 e #242437 | Fundo e estrutura | Dá unidade ao site e cria contraste com papel e cena. |
| Papel quente, #EBE3DB e #FFF1E4 | Conteúdo de leitura | Folhas de caso, pistas, notas e resultado. Mantém o texto num tom escuro e confortável. |
| Azul-esverdeado, #4EC9C0 e #167A7A | Ação e estado ativo | Liga foco, seleção e ação principal. O tom claro funciona como contorno sobre o violeta; o tom escuro suporta texto claro em botões. |
| Coral, #E57465 | Ênfase narrativa | Destaca uma palavra, o caso do dia ou um detalhe da composição. Não substitui mensagens de erro. |
| Dourado quente, #F4B96B e #855048 | Acabamento e metadados | Filetes, números e pequenos sinais editoriais. O tom escuro sustenta texto sobre papel; o tom claro assinala detalhes breves. |

A cor identifica funções; não serve de decoração contínua. O dourado quente e o coral aparecem em doses pequenas. Os gradientes ficam no fundo do site e não cobrem a cena. Os estados de erro e sucesso mantêm os seus sinais próprios, texto e ícone, para não se confundirem com os destaques da marca. O texto e os contornos interativos têm contraste suficiente no fundo onde aparecem.

## Hierarquia por página

- **Entrada:** marca e promessa do jogo; imagem da maquete real; caso do dia e ação principal; depois, explicação, progresso e acesso aos níveis.
- **Biblioteca:** dificuldade, tamanho, número de pisos e progresso ficam legíveis antes de abrir um caso. Filtros e pesquisa mantêm alvos táteis claros.
- **Caso:** a cena ocupa a área principal. Em ecrãs largos, o processo reúne sequência, pistas e notas numa coluna ordenada. Em telemóvel, a sequência precede a cena e pode percorrer-se na horizontal; depois da grelha surgem as ferramentas, as pistas e as notas.
- **Caso concluído:** uma folha de resultado destaca o veredicto e a pessoa identificada. O caso seguinte é a ação principal; partilha e navegação ficam em segundo plano.

Barlow Condensed identifica títulos e nomes; Hanken Grotesk serve a leitura corrente e os comandos; Courier Prime fica para códigos, medidas e metadados curtos. As pistas usam corpo confortável para leitura continuada. Os tamanhos pequenos ficam limitados a informação auxiliar.

## Adaptação e acessibilidade

Em computador, a disposição aproveita a largura sem afastar a cena do processo. Em telemóvel, a página passa a uma coluna, a sequência desloca-se sem comprimir os nomes e os comandos continuam acessíveis. Nenhuma faixa fixa pode tapar uma célula, uma pista ou um botão.

Os controlos mantêm pelo menos 44 px de altura, foco visível por teclado e nomes acessíveis. Os estados de seleção, erro, ajuda e sucesso usam texto ou símbolos além da cor. As transições respeitam a preferência por movimento reduzido. A legibilidade das pistas tem prioridade sobre rótulos decorativos.

## Como rever as capturas

O diretório docs/reference/site-redesign-v1/ contém 42 ficheiros de referência anteriores, incluindo metadados JSON, e 33 capturas posteriores em PNG. Compare as imagens anteriores e posteriores, dando prioridade às mesmas dimensões e ao mesmo estado do jogo.

Exemplos úteis:

- [Entrada em 1 440 × 1 100](reference/site-redesign-v1/site-v1-after-home-1440x1100.png) e [entrada em 390 × 844](reference/site-redesign-v1/site-v1-after-home-390x844.png).
- [Biblioteca em 1 280 × 800](reference/site-redesign-v1/site-v1-after-library-1280x800.png) e [biblioteca em 390 × 844](reference/site-redesign-v1/site-v1-after-library-390x844.png).
- [Caso em 1 440 × 1 100](reference/site-redesign-v1/site-v1-after-puzzle-1440x1100.png) e [caso em 390 × 844](reference/site-redesign-v1/site-v1-after-puzzle-390x844.png).
- [Conclusão em 1 440 × 1 100](reference/site-redesign-v1/site-v1-after-case-closed-1440x1100.png) e [conclusão em 390 × 844](reference/site-redesign-v1/site-v1-after-case-closed-390x844.png).
- [Maquete antes, 1 440 × 1 100](reference/site-redesign-v1/site-v1-before-canvas-1440x1100.png) e [maquete depois, 1 440 × 1 100](reference/site-redesign-v1/site-v1-after-canvas-1440x1100.png).

A revisão compara presença da maquete, leitura das pistas, hierarquia, recorte dos elementos e acessibilidade dos comandos em computador e telemóvel. Na vista de jogo, confirma também que o tabuleiro conserva a composição original. As capturas incluem estados de seleção, ocupação, conflito, pista, localizador, notas, pisos, vista fantasma e vista explodida.

## Resultado da revisão visual

A composição da maquete mantém-se visualmente equivalente. A comparação raster entre as capturas do tabuleiro a 1 440 × 1 100 registou uma diferença média de 2,0946 níveis por canal RGB, numa escala de 0 a 255. Este valor descreve uma pequena diferença acumulada; não significa identidade pixel a pixel. A revisão de âmbito confirmou que src/scene3d/ e os dados das cenas ficaram intactos.

## Verificações funcionais concluídas

A verificação de qualidade terminou com 440 testes aprovados e 5 ignorados. A compilação e a verificação de estilo do código também passaram.

A revisão manual cobriu seleção e colocação, conflitos, desfazer e refazer, limpeza, pistas, localizador, persistência das notas, navegação por teclado, mudança de piso, contexto fantasma e explodido, conclusão do caso e passagem ao caso seguinte.
