# Expansão dos ambientes Kenney V3

> **Estado:** três pilotos jogáveis e dez modelos adaptados. Os três ambientes são candidatos condicionais. A integração num caso oficial exige trabalho de pistas e aprovação desse caso.

## Objetivo e limites

A V3 parte da pesquisa concluída na V2 e verifica se três famílias promissoras podem funcionar como ambientes Murdoku: cemitério, loja de bairro e café. Cada piloto usa uma cena física e um caso de desenvolvimento selecionado pelo endereço `?pilot=cemetery`, `?pilot=shop` ou `?pilot=cafe`. Os casos só entram no catálogo durante o desenvolvimento. Não alteram casos dourados nem acrescentam regras ao solucionador.

O lote parte do SHA aprovado `d508a240c28969e0e7bd4bf9c42fe305ebdc75bd`, no ramo `sol/kenney-environment-expansion-v3`. A V2 mediu 1 626 modelos de 15 pacotes e avaliou dez vinhetas. A V3 não repete esse levantamento: adapta apenas dez modelos já selecionados e medidos, e testa composições com as dimensões e a câmara de Murdoku.

Consultar a [análise V2](KENNEY_ENVIRONMENT_EXPANSION_V2.md), o [índice de imagens V2](reference/kenney-environment-expansion-v2/README.md), o [guia dos adaptadores V3](KENNEY_PACK_ADAPTERS_V3.md) e o [índice visual V3](reference/kenney-environment-expansion-v3/README.md).

## Alterações de produção

O seletor dos pilotos fica limitado a `import.meta.env.DEV`. Cada URL cria um caso de seis por seis, com quatro divisões e quatro pessoas, e liga-o a uma `SceneSpec` de desenvolvimento. A geometria da cena e as pistas continuam a usar o esquema e as relações já existentes.

O adaptador acrescenta dez modelos medidos ao catálogo de produção, com apenas os GLB e as texturas usados pelos três pilotos. A escala uniforme fica incorporada no nó raiz do ficheiro GLB. O catálogo mede novamente o resultado, e o script de geração compara limites, dimensões e contacto com o chão com os valores da fonte e da escala declarada.

| Família e modelos | Escala incorporada | Dimensões finais aproximadas, largura × altura × profundidade | Apoio e papel no piloto |
| --- | ---: | --- | --- |
| Graveyard Kit: `graveyard_cryptSmall` | 0,90× | 1,215 × 0,900 × 1,260 | Pavimento; elemento de cenário |
| Graveyard Kit: `graveyard_grave` | 1,00× | 0,724 × 0,114 × 1,241 | Pavimento; elemento de cenário |
| Graveyard Kit: `graveyard_gravestoneCross` | 1,00× | 0,450 × 0,915 × 0,330 | Pavimento; elemento de cenário |
| Mini Market: `miniMarket_shelfBoxes` | 1,00× | 0,800 × 0,850 × 0,700 | Pavimento; expositor sem pista lógica |
| Mini Market: `miniMarket_freezer` | 1,00× | 0,800 × 0,350 × 0,600 | Pavimento; arca sem pista lógica |
| Mini Market: `miniMarket_cashRegister` | 0,50× | 0,425 × 0,297 × 0,425 | Sobre superfície `counter`; adereço, sem pista própria |
| Food Kit: `food_cake` | 0,30× | 0,192 × 0,082 × 0,192 | Sobre `table` ou `counter`; adereço |
| Food Kit: `food_plateDinner` | 0,30× | 0,268 × 0,066 × 0,268 | Sobre `table` ou `counter`; adereço |
| Food Kit: `food_cupCoffee` | 0,30× | 0,065 × 0,042 × 0,086 | Sobre `table` ou `counter`; adereço |
| Food Kit: `food_glassWine` | 0,30× | 0,068 × 0,150 × 0,059 | Sobre `table` ou `counter`; adereço |

As dez fontes tinham contacto medido com o chão em `y = 0`. A escala e a origem normalizada ficam no recurso, sem deslocamentos ou alturas escolhidos por cena. O adaptador de material conserva o mapa, a transformação UV carregada pelo GLTF, a cor, o alfa, a opacidade, o modo de faces e os parâmetros de profundidade. Os modelos adaptados passam a Lambert texturado; os modelos Furniture Kit e Nature Kit mantêm o caminho de renderização atual. As malhas continuam a usar a regra genérica de sombras do renderizador. Não há tratamento novo de sombras transparentes nem normalização de cor ou saturação. A luz e a câmara também não mudam.

O pedido V3 autoriza a escalada de sistema limitada necessária para esta integração: `renderer.ts` chama o conversor apenas para os modelos listados em `PACK_ADAPTERS`; `packAdapters.ts` conserva os materiais; `scripts/kenney-pack-adapt.mjs` cria os GLB adaptados e regenera o catálogo. O esquema, o solucionador, os validadores e o caminho legado de materiais não foram alargados. Qualquer suporte futuro que ultrapasse estes modelos exige nova revisão da arquitetura.

## Cemitério

**Conceito:** recinto memorial de seis por seis, com entrada a oeste, pequeno vestíbulo, alameda de lajes, dois grupos de campas, jazigo e canteiros na orla. O pavimento de terra é contínuo, com pedra apenas no limiar e no adro. O percurso deixa espaço para pessoas e seleção. As zonas lógicas do caso são Graveyard, Chapel, Gate e Orchard; a última ainda não tem árvores por causa da oclusão nesta câmara.

**Recursos e disposição:** `graveyard_grave` e `graveyard_gravestoneCross` usam 1,00×; `graveyard_cryptSmall` usa 0,90×. O jazigo assenta em `[4,25; 2,25]`. O caminho usa `path_stone`; os canteiros usam `plant_bushSmall`, `plant_bushDetailed`, `flower_yellowA`, `flower_purpleA` e `flower_redA`. `chair`, `lampRoundFloor` e `cardboardBoxClosed` completam os objetos de pista. As campas e o jazigo são cenário.

**Material e lista exata:** os três GLB Graveyard conservam as texturas de origem no adaptador Lambert; Nature Kit e Furniture Kit usam o percurso existente. Todos os modelos e posições constam da [cena do cemitério](../src/scene3d/scenes/pilot-cemetery.ts).

**Pistas que o piloto consegue representar:** arbusto, planta ou flor, candeeiro, cadeira e caixa, através de modelos canónicos que já têm esses tipos lógicos. Árvore, portão, lápide, cruz, campa, caminho e jazigo não recebem `logic` no piloto. Não atribuímos semântica de banco à cadeira nem de portão às paredes.

**Interação e limites:** à escala 1,00×, o jazigo ocultava quatro células. A escala canónica 0,90× e a nova posição eliminam os avisos do validador. Na revisão do navegador, o jazigo mantém-se como foco, mas as pessoas, a seleção, o conflito, o localizador, a dica e as linhas/colunas permanecem visíveis. O recinto ainda tem uma zona central pouco caracterizada, e a identidade da zona Orchard exige vegetação que não tape o tabuleiro. Para usar campas ou portão como pistas, é preciso acrescentar tipos semânticos e testar a leitura nessa câmara.

**Decisão:** **CONDICIONAL**. A composição pode servir de base a um caso oficial, após resolver as pistas específicas do cemitério e rever a densidade da zona Orchard.

## Loja de bairro

**Conceito:** loja de seis por seis, com área de venda e caixa a norte, armazém a sudoeste e escritório a sudeste. A entrada fica a oeste. Um vão largo e uma porta ligam as áreas públicas e de trabalho. As zonas usam revestimentos distintos para separar venda, stock e escritório.

**Recursos e disposição:** Mini Market fornece `miniMarket_shelfBoxes` (1,00×), `miniMarket_freezer` (1,00×) e `miniMarket_cashRegister` (0,50×). A caixa registadora assenta na superfície declarada do módulo central de balcão. Três módulos Furniture Kit formam o balcão; um expositor lateral e um expositor junto à fachada compõem as áreas de venda. A cena usa também `food_cake`, `food_plateDinner` e `food_cupCoffee` em superfícies de exposição, todos a 0,30×. No armazém há uma estante baixa e um pequeno grupo de caixas; o escritório inclui mesa, cadeira, portátil, candeeiro e arrumação canónicos. Os modelos novos de prateleira, arca, caixa registadora e comida são adereços sem associação lógica.

**Material e lista exata:** Mini Market e Food Kit mantêm as texturas de origem no adaptador Lambert; Furniture Kit conserva o material existente. Todos os modelos, apoios e posições constam da [cena da loja](../src/scene3d/scenes/pilot-shop.ts).

**Pistas que o piloto consegue representar:** balcão, frigorífico, planta, estante, caixa, mesa e cadeira. A planta na zona de venda substituiu o altifalante usado no primeiro rascunho e coincide com `plant@2,4`. Prateleira de produtos, arca e caixa registadora Mini Market não são alvos lógicos.

**Interação e limites:** a caixa registadora depende do apoio medido do balcão. A revisão do navegador confirmou o corredor central, as pessoas e os sete estados de interação. A arca Mini Market e o expositor têm leitura de cenário, mas ainda não representam pistas lógicas. A área de venda comporta um segundo expositor sem formar uma fila de objetos; o armazém continua a depender de uma entrada legível e da clareza das caixas.

**Decisão:** **CONDICIONAL**. A loja está suficientemente composta para um caso piloto; falta integrar semântica visual para caixa registadora, expositor e arca, se forem pistas do caso oficial.

## Café e restaurante

**Conceito:** espaço de seis por seis com sala de refeições e cozinha a norte, pátio a sudoeste e balcão de serviço a sudeste. Duas janelas iluminam a sala e a cozinha. Passagens em paredes interiores separam as zonas sem fechar a circulação. A entrada fica a oeste.

**Recursos e disposição:** os quatro adereços Food Kit (`food_cake`, `food_plateDinner`, `food_cupCoffee`, `food_glassWine`) usam escala 0,30× e superfícies-pai declaradas. A sala agrupa mesa, cadeiras, banco e comida; a cozinha usa armários, lava-loiça, máquina de café, fogão e frigorífico; o balcão reúne módulos, bancos altos e um copo; o pátio combina mesa, assentos, vegetação e lajes. Os móveis são Furniture Kit e a vegetação/caminho vêm de Nature Kit.

**Material e lista exata:** Food Kit preserva a textura de origem no adaptador Lambert; Furniture Kit e Nature Kit mantêm o percurso existente. Todos os modelos, apoios e posições constam da [cena do café](../src/scene3d/scenes/pilot-cafe.ts).

**Pistas que o piloto consegue representar:** planta, candeeiro, cadeira, mesa, balcão, fogão e caixa. O frigorífico é cenário sem `logic`. A caixa usa `cardboardBoxOpen`, pelo que a leitura visual coincide com o tipo lógico. Bolo, prato, chávena e copo contam apenas como elementos narrativos, não como pistas.

**Interação e limites:** a revisão no navegador confirmou os sete estados, incluindo conflito e dica, em computador e nas capturas móveis disponíveis. Pessoas e sobreposições continuam legíveis. O Food Kit dá contexto às mesas e ao balcão, mas bolo, prato, chávena e copo são pequenos nesta câmara, sobretudo em telemóvel. Não devem ser pistas sem um localizador próprio. A caixa de entrega substituiu um rádio que parecia um relógio na primeira versão.

**Decisão:** **CONDICIONAL**. A arquitetura e o serviço estão prontos para desenvolvimento de um caso, mas as pistas de comida exigem leitura dedicada se forem usadas na lógica.

## Estados de jogo e evidência

Os três casos são dados de desenvolvimento ligados à interface normal do jogo, não maquetes estáticas. Foram revistos no navegador em repouso, com célula selecionada, pessoa colocada, conflito, localizador de pistas, dica e sobreposição de linha/coluna. A seleção ativa a mesma camada de linhas e colunas; por isso, as capturas desses dois nomes podem ser idênticas. O [índice visual V3](reference/kenney-environment-expansion-v3/README.md) distingue as imagens finais das versões intermédias.

As capturas de regressão mostram Midnight Delivery antes e depois da integração. Os quatro casos protegidos não receberam alterações. A validação automatizada do catálogo oficial cobre 60 puzzles e as cenas existentes.

## Plano de adoção por níveis

| Nível | Recursos | Condições |
| --- | --- | --- |
| **Nível 1: seguros para uso atual** | Furniture Kit e Nature Kit já aprovados; os dez modelos V3 apenas como cenário ou adereço nos pilotos. | Escala, material, textura e apoio verificados. Usar os novos modelos noutro ambiente exige nova revisão de composição. |
| **Nível 2: usar após infraestrutura e validação específicas** | Graveyard Kit, Mini Market e Food Kit como fontes de novas pistas lógicas. | Definir tipos semânticos legíveis, validar localizador e relações, provar seleção e oclusão no caso final. A aprovação dos dez modelos não aprova o pacote inteiro. |
| **Nível 3: uso especial** | Building Kit, Modular Buildings, Suburban, Commercial, Roads, Industrial e Factory. | A V2 mantém uso como envelope exterior, fachada distante, contexto urbano ou estudo de oficina. Cada família precisa de composição própria, escala coerente e validação de oclusão. Não faz parte da adoção desta V3. |
| **Não usar nas seleções testadas** | Retro Urban, Survival e Holiday. | A prova V2 continua a rejeitar estas combinações. Reabri-las exige evidência nova e concreta, não apenas a existência de mais modelos. |

## Regressões, validação e estado final

Os casos Midnight Delivery, The Empty Chair, The Last Nightcap, The Wrong Coat e as cenas de produção criadas noutros ramos permaneceram fora do âmbito de edição. A V3 não altera a arquitetura, o mobiliário, a câmara, a luz, a interação nem a lógica desses casos. A validação final inclui testes integrais, tipos, análise estática, compilação, recursos em falta, inspeção visual e igualdade do SHA local/remoto.

**Resultado:** adaptadores prontos para o subconjunto medido; três ambientes **CONDICIONAIS** para novos casos. Nenhum é ainda um caso oficial. A decisão global para uso em produção de um puzzle é **NOT READY** até fechar a semântica das pistas e validar a versão final do caso.
