# Expansão dos ambientes Kenney v2

> **Estado: laboratório atualizado em 24/09/2026; integração em produção pendente.** O seguimento mediu 1 752 GLB de 16 pacotes, selecionou 86 modelos e acrescentou um protótipo de minigolfe. A avaliação revista, com as preferências do proprietário, está em [seguimento do laboratório Kenney](KENNEY_ENVIRONMENT_LAB_FOLLOWUP.md) e atualiza as classificações finais abaixo.

## Âmbito

O objetivo é perceber que ambientes Murdoku podem receber recursos Kenney sem perder a escala, a leitura e a coerência da casa de bonecas 3D atual. A decisão deve partir da arquitetura e da função do espaço. A disponibilidade de modelos não justifica alterar a planta lógica.

Esta missão é um laboratório experimental. Não cria casos finais, não redesenha cenas de referência e não altera pistas, solução, gerador, solucionador, esquema, renderizador ou validadores.

- Ramo: sol/kenney-environment-expansion-v2
- Base aprovada: aa384c2f69ab6168786abccf04f713ad3ae24a58
- HEAD verificado no início do trabalho: coincide com a base aprovada
- Data da consulta ao catálogo oficial: 23/09/2026

## Fontes e proveniência

A categoria 3D do catálogo oficial da Kenney tinha 50 entradas em quatro páginas na data da consulta: [página 1](https://kenney.nl/assets/category:3D), [página 2](https://kenney.nl/assets/category:3D/page:2), [página 3](https://kenney.nl/assets/category:3D/page:3) e [página 4](https://kenney.nl/assets/category:3D/page:4). Consultei a licença em cada uma das 50 fichas. Todas apresentam Creative Commons CC0. O inventário anterior, [KENNEY_PACK_SURVEY.md](KENNEY_PACK_SURVEY.md), mantém as ligações diretas às 50 fichas.

As fichas oficiais publicam um campo «Files». Este valor nem sempre corresponde ao número de ficheiros GLB dentro do ZIP. Medimos os 1 752 GLB dos 16 arquivos oficiais, com cobertura completa e zero falhas. O [relatório de medição](reports/kenney-lab-measurements.json) regista, para cada ZIP, o nome, a ficha oficial, a licença CC0 e o hash SHA-256. Guarda também estatísticas agregadas dos 1 752 modelos e registos individuais dos 86 modelos selecionados para o laboratório. Não contém uma linha individual persistida para cada GLB não selecionado.

| Pacote e ficha oficial | «Files» na ficha | GLB extraídos | Classe final |
| --- | ---: | ---: | --- |
| [Furniture Kit](https://kenney.nl/assets/furniture-kit) | 140 | 140 | DIRETO, base existente |
| [Nature Kit](https://kenney.nl/assets/nature-kit) | 330 | 329 | DIRETO, apenas o subconjunto atual está aprovado |
| [Building Kit](https://kenney.nl/assets/building-kit) | 80 | 79 | ADAPTADOR |
| [Modular Buildings](https://kenney.nl/assets/modular-buildings) | 100 | 108 | ADAPTADOR |
| [City Kit (Suburban)](https://kenney.nl/assets/city-kit-suburban) | 40 | 40 | ADAPTADOR |
| [City Kit (Commercial)](https://kenney.nl/assets/city-kit-commercial) | 50 | 41 | USO ESPECÍFICO, cenário distante |
| [City Kit (Roads)](https://kenney.nl/assets/city-kit-roads) | 90 | 95 | ADAPTADOR |
| [Retro Urban Kit](https://kenney.nl/assets/retro-urban-kit) | 120 | 124 | ADAPTADOR, risco elevado |
| [Mini Market](https://kenney.nl/assets/mini-market) | 20 | 20 | USO ESPECÍFICO |
| [Minigolf Kit](https://kenney.nl/assets/minigolf-kit) | 125 | 126 | USO ESPECÍFICO |
| [Food Kit](https://kenney.nl/assets/food-kit) | 200 | 200 | USO ESPECÍFICO |
| [Graveyard Kit](https://kenney.nl/assets/graveyard-kit) | 90 | 91 | USO ESPECÍFICO |
| [Survival Kit](https://kenney.nl/assets/survival-kit) | 80 | 80 | USO ESPECÍFICO |
| [Holiday Kit](https://kenney.nl/assets/holiday-kit) | 100 | 99 | USO ESPECÍFICO |
| [City Kit (Industrial)](https://kenney.nl/assets/city-kit-industrial) | 40 | 37 | USO ESPECÍFICO |
| [Factory Kit](https://kenney.nl/assets/factory-kit) | 140 | 143 | USO ESPECÍFICO, sem grua no espaço jogável |

A soma é de 1 752 GLB. Este número descreve os ficheiros extraídos dos 16 pacotes selecionados. Não indica quantos modelos devem entrar no repositório. A política do projeto permite apenas os modelos medidos e usados por cenas implementadas.

## Referências de escala

Todas as dimensões deste relatório usam unidades do modelo Murdoku, com eixo Y para cima e sistema dextrógiro. Não há conversão validada para metros. Uma silhueta humana serve apenas para comparar proporções.

As dimensões de referência, na ordem largura × altura × profundidade, são: cadeira 0,20 × 0,47 × 0,20; porta 0,486 × 1,00953 × 0,1134; parede 1,00 × 1,28953 × 0,05; árvore 0,755 × 1,70789 × 0,65385. O manual define uma célula Murdoku com 0,8 unidades Kenney e um piso Kenney com 1,0. A comparação dos novos modelos deve usar estas referências, além da origem, superfície de apoio, profundidade e rotação.

## Medições geométricas

Foram medidos os 1 752 GLB, sem falhas. A tabela resume, por pacote, a mediana e os máximos medidos em largura × altura × profundidade. Cada máximo por eixo é independente: os valores podem corresponder a modelos diferentes e não descrevem necessariamente um único GLB. A coluna de contacto indica quantos modelos têm o chão à origem, abaixo da origem ou acima da origem, por esta ordem. O relatório JSON conserva estas estatísticas agregadas por pacote e os dados individuais dos 86 modelos selecionados para o laboratório. Não apresenta limites e origens individuais para os restantes modelos.

| Pacote | Mediana L × A × P | Máximos independentes L × A × P | Chão à origem / abaixo / acima |
| --- | --- | --- | ---: |
| Building Kit | 0,30824 × 1,58346 × 2,00 | 2,39452 × 2,55 × 4,00 | 72 / 5 / 2 |
| City Kit (Commercial) | 0,84 × 1,693 × 0,50 | 2,32 × 5,47 × 1,82 | 41 / 0 / 0 |
| City Kit (Industrial) | 1,02814 × 0,96161 × 1,24 | 2,48359 × 2,31385 × 2,10802 | 37 / 0 / 0 |
| City Kit (Roads) | 1,00 × 0,08 × 1,00 | 3,00 × 0,82212 × 3,00 | 87 / 6 / 2 |
| City Kit (Suburban) | 1,2725 × 0,7375 × 0,953 | 1,828 × 1,2375 × 1,428 | 40 / 0 / 0 |
| Factory Kit | 1,00 × 0,74527 × 1,00 | 2,35 × 3,55332 × 3,68025 | 129 / 11 / 3 |
| Food Kit | 0,29561 × 0,19064 × 0,26526 | 1,25923 × 0,88163 × 1,022 | 195 / 4 / 1 |
| Furniture Kit | 0,43 × 0,40 × 0,25 | 1,82343 × 1,33953 × 1,42579 | 134 / 4 / 2 |
| Graveyard Kit | 0,62238 × 0,6689 × 0,39155 | 1,97678 × 2,30246 × 2,43803 | 80 / 5 / 6 |
| Holiday Kit | 0,90 × 0,6525 × 0,45 | 3,14145 × 2,28966 × 2,68737 | 85 / 9 / 5 |
| Mini Market | 0,80 × 0,78668 × 0,60 | 1,00 × 1,09254 × 1,00 | 20 / 0 / 0 |
| Minigolf Kit | 0,9999 × 0,23331 × 0,9999 | 4,49995 × 4,00 × 4,49995 | 110 / 16 / 0 |
| Modular Buildings | 1,00 × 0,625 × 1,00 | 2,00 × 3,7625 × 2,20 | 101 / 7 / 0 |
| Nature Kit | 0,61485 × 0,44378 × 0,5547 | 1,2685 × 2,0755 × 1,2685 | 299 / 28 / 2 |
| Retro Urban Kit | 1,00 × 0,50 × 1,00 | 2,00 × 1,70 × 2,00 | 124 / 0 / 0 |
| Survival Kit | 0,3493 × 0,28137 × 0,27063 | 1,78639 × 1,71097 × 1,44784 | 78 / 2 / 0 |

Alguns modelos medidos mostram por que a classificação precisa da prova visual e de um contexto de uso:

| Modelo | Dimensões medidas L × A × P | Comparação |
| --- | --- | --- |
| Building Kit, wall.glb | 0,10 × 2,40 × 2,00 | A altura de 2,40 excede a parede interior de 1,28953; requer envelope exterior próprio. O valor individual veio da execução de medição, não do JSON compacto; o [programa de medição](../scripts/kenney-lab-measure.mjs) pode reproduzi-lo a partir do ZIP oficial. |
| Food Kit, plate-dinner.glb | 0,89177 × 0,22136 × 0,89177 | É mais largo do que a mesa de referência, com 0,84. |
| Food Kit, cake.glb | 0,6392 × 0,27308 × 0,6392 | Verificar apoio e espaço útil numa superfície-pai real. |
| Food Kit, glass-wine.glb | 0,22677 × 0,49986 × 0,19693 | A altura ultrapassa ligeiramente a cadeira de referência, com 0,47. |
| Mini Market, cash-register.glb | 0,85 × 0,5949 × 0,85 | A largura exige uma superfície maior do que várias mesas do catálogo. |
| Mini Market, shelf-boxes.glb | 0,80 × 0,85 × 0,70 | Quase à altura da figura de referência; compõe corredores e áreas de stock no protótipo. |
| City Kit (Suburban), building-type-a.glb | 1,30 × 0,83354 × 1,02814 | Quase à altura da figura de referência, com 0,95; adaptar escala ou arquitetura se tiver de alojar pessoas. |
| Holiday Kit, cabin-wall.glb | 1,00 × 1,00 × 0,30 | Assenta na origem e aproxima-se da altura da figura; a peça de telhado precisa de recentrar o pivô em 0,14142 u. |
| Minigolf Kit, straight.glb | 0,9999 × 0,14665 × 0,9999 | Módulo de terreno quase 1 u; 110 modelos tocam o chão à origem e 16 ficam abaixo dela. |
| Survival Kit, tent.glb | 0,56076 × 0,49137 × 0,561 | Cabe em largura na célula de 0,8, mas ainda precisa de validação de apoio, colisão e material. |
| Factory Kit, crane.glb | 1,92603 × 3,55332 × 3,68025 | A altura é cerca de 2,75 vezes a parede de referência; manter fora do interior jogável até prova. |

Estas medidas não autorizam escala por objeto nem colocação direta. A composição tem de usar as dimensões reais; se o encaixe depender de escala ou elevação livre, a seleção ou a arquitetura tem de mudar.

## Matriz técnica e de compatibilidade

A geometria dos 16 pacotes foi medida. A matriz seguinte conserva as hipóteses técnicas formuladas antes da revisão das vinhetas. A secção «Decisão visual» e o [seguimento do laboratório](KENNEY_ENVIRONMENT_LAB_FOLLOWUP.md) atualizam a avaliação. «DIRETO» aplica-se apenas ao subconjunto já integrado; «ADAPTADOR» exige adaptação isolada; «USO ESPECÍFICO» reserva o pacote a um arquétipo; «REJEITAR» impede a adoção com a seleção testada. Uma escalada de sistema («SYSTEM ESCALATION») é necessária quando a proposta exigir alterar capacidades fundamentais.

| Pacote | Arquétipo a explorar | Relação possível com as pistas | Compatibilidade preliminar e validações pendentes |
| --- | --- | --- | --- |
| Furniture Kit | Interiores residenciais e comerciais | Mobiliário lógico e superfícies podem estar associados às divisões se usarem os tipos e as associações atuais. | Base visual e física do sistema. DIRETO para o conteúdo integrado; a classe não aprova automaticamente o restante pacote. |
| Nature Kit | Jardins, pátios, caminhos e perímetros | A vegetação pode identificar um espaço. Não cria uma nova regra de pista. | O projeto já usa 21 modelos selecionados. DIRETO apenas para o subconjunto integrado, não para o pacote inteiro. |
| Building Kit | Fachada, alpendre, telhado e volumes exteriores | A arquitetura enquadra o local; não define células ou relações lógicas. | A parede medida tem 2,40 de altura perante a parede interior de 1,28953. Mantê-la como envelope exterior separado até adaptação e revisão visual. |
| Modular Buildings | Casas, lojas, hotéis e frentes urbanas | Fachadas podem distinguir zonas narrativas, mas não acrescentam grelha ou relações entre pisos. | A mediana medida é 1,00 × 0,625 × 1,00, acima da célula de 0,8 em dois eixos. Testar a composição com câmara e recorte atuais. ADAPTADOR. |
| City Kit (Suburban) | Moradia suburbana e jardim frontal | Portões e caminhos podem orientar a leitura espacial, sem criar pistas de percurso. | Avaliar casas como composição exterior. Começar por vedações, caminhos e elementos pequenos se a escala e os materiais forem compatíveis. ADAPTADOR. |
| City Kit (Commercial) | Fachada de comércio, hotel ou quarteirão | O exterior enquadra a cena; os edifícios não substituem as divisões jogáveis. | Os edifícios completos podem tapar a casa em corte. Testar como volume de contexto na câmara atual. ADAPTADOR. |
| City Kit (Roads) | Rua, passeio, entrada de serviço ou frente urbana | A rua pode contextualizar a cena. Não introduz circulação, distância ou vizinhança como mecânica de pista. | A mediana da largura e profundidade é 1,00, diferente da célula de 0,8. Uma malha urbana própria ou percurso lógico exige SYSTEM ESCALATION. ADAPTADOR apenas para contexto compatível com a cena atual. |
| Retro Urban Kit | Beco ou interior urbano retro | A decoração pode servir de ambiente, sem criar pistas baseadas em píxeis ou interação. | A textura e a leitura retro divergem da linguagem visual atual. ADAPTADOR de risco elevado; testar uma rua isolada com material de transição. |
| Mini Market | Mercearia ou supermercado de bairro | Prateleiras e produtos podem distinguir zonas. Os objetos não têm significado mecânico sem suporte no sistema de pistas. | Usar primeiro como mobiliário isolado, sem adotar as paredes como estrutura. Validar apoios, pegadas e oclusão num protótipo. USO ESPECÍFICO. |
| Food Kit | Café, restaurante, bar ou cozinha | Alimentos são adereços narrativos. As pistas continuam a usar divisões, linhas, colunas e pisos suportados. | Objetos pequenos precisam de uma superfície-pai declarada. Não usar elevação manual. Validar apoios e leitura. USO ESPECÍFICO. |
| Graveyard Kit | Cemitério, jardim memorial ou perímetro exterior | Túmulos podem ser elementos de história visual, não objetos interrogáveis pelo sistema atual. | Avaliar escala, concentração fora da zona jogável e oclusão das células. Reservar para um caso-piloto próprio. USO ESPECÍFICO. |
| Survival Kit | Acampamento, abrigo ou posto de campo | Tendas e fogueiras podem enquadrar o caso; não acrescentam regras de abrigo, fogo ou deslocação. | Comparar escala, materiais e apoios com Furniture e Nature. Avaliar oclusão e diferença de estilo. USO ESPECÍFICO. |
| Holiday Kit | Cabana sazonal, neve e decoração festiva | A estação pode alterar o contexto narrativo, sem alterar a lógica do caso. | Validar a cabana na escala atual e separar clima, iluminação e adereços da arquitetura base. USO ESPECÍFICO. |
| City Kit (Industrial) | Frente de armazém, central ou espaço de serviço | A maquinaria e a fachada contextualizam a cena; a lógica continua dentro das regras existentes. | Tratar como contexto urbano/industrial. Validar colisões, origem e composição com City Kit (Roads) antes de propor uma rua ou lote maior. ADAPTADOR. |
| Factory Kit | Oficina, fábrica ou espaço de manutenção | Máquinas e esteiras não podem alterar movimento ou criar pistas operacionais sem semântica aprovada. | Confirmar animações, volumes, colisões, apoio e oclusão. Exige protótipo isolado e acesso claro às divisões. USO ESPECÍFICO. |

### Materiais

A inspeção preliminar dos GLB revela duas famílias: Furniture Kit e Nature Kit não usam texturas; os outros 14 pacotes usam mapas de cor e KHR_texture_transform. Retro Urban Kit também usa KHR_materials_unlit, além das texturas. Nenhum dos 14 pacotes texturados usa o modo de alfa MASK.

| Pacote | Materiais e transparência observados | Consequência para a compatibilidade |
| --- | --- | --- |
| Furniture Kit | 140 modelos com KHR_materials_unlit e sem texturas; 18 materiais BLEND, incluindo `glass`. | O renderizador já substitui o material com o nome exato `glass` por vidro noturno opaco. A conversão atual está alinhada com este conjunto de cores. |
| Nature Kit | 329 modelos com KHR_materials_unlit, sem texturas e sem materiais BLEND. | É a extensão mais bem estabelecida da Furniture Kit. |
| Building Kit | 79 modelos com mapa de cor; 10 materiais BLEND chamados `glass`. A parede com janela redonda usa vidro com opacidade de 50%. | ADAPTADOR. Preservar mapa e alfa; rever o envelope exterior separado. |
| City Kit (Suburban) | 40 modelos com mapas; sem materiais BLEND. As casas de pré-visualização têm telhados verde-vivo. | ADAPTADOR. Vedações e caminhos parecem promissores. Manter casas e paleta como camada exterior própria. |
| City Kit (Commercial) | 41 modelos com mapas; sem materiais BLEND. Inclui edifícios completos. | ADAPTADOR. Preferir fachada distante ou fundo; não usar nos interiores em corte sem prova visual. |
| City Kit (Industrial) | 37 modelos e 63 associações de material; sem materiais BLEND. | ADAPTADOR. Usar como exterior industrial e confirmar a composição com uma escala única. |
| City Kit (Roads) | 95 modelos com mapas; sem materiais BLEND. Inclui cone e vedação de obras. | ADAPTADOR. Compor a estrada numa camada própria, sem lhe atribuir semântica de circulação ou pista. |
| Modular Buildings | 108 modelos com mapas; sem materiais BLEND. Inclui módulos de edifício e janelas. | ADAPTADOR. Reservar para módulos exteriores; manter o sistema atual de divisões e paredes físicas. |
| Mini Market | 20 modelos com mapas; um material BLEND em `wall-window`, chamado `glass`, com opacidade de 50%. | USO ESPECÍFICO. O tratamento global de `glass` tornaria esta janela opaca; requer preservação do mapa e alfa. |
| Food Kit | 200 modelos com mapas; dois materiais BLEND. As tampas `frying-pan-lid` e `pot-stew-lid` têm opacidade de 50%. | USO ESPECÍFICO. Usar poucos adereços em superfícies-pai declaradas e preservar a transparência das tampas. |
| Graveyard Kit | 91 modelos com mapas; sem materiais BLEND. Inclui altar de pedra e banco. | USO ESPECÍFICO. Rever a iluminação e manter os elementos altos fora da zona jogável. |
| Holiday Kit | 99 modelos com mapas; sem materiais BLEND. Inclui componentes de cabana. | USO ESPECÍFICO. Reservar para cenas sazonais e rever luz e paleta. |
| Factory Kit | 143 modelos com mapas; 11 materiais BLEND. A janela `machine-window` tem opacidade de cerca de 10%. | USO ESPECÍFICO. Rever sombras nas superfícies transparentes antes de adotar uma oficina. |
| Survival Kit | 80 modelos com mapas; sem materiais BLEND. Inclui estruturas e objetos de acampamento. | USO ESPECÍFICO. Rever escala e materiais numa cena exterior. |
| Retro Urban Kit | 124 modelos com KHR_materials_unlit e texturas; 237 associações de materiais mapeados e 20 materiais BLEND. | ADAPTADOR, dificuldade elevada. As texturas de tijolo e o aspeto retro divergem da paleta atual; testar uma pequena frente urbana isolada antes de considerar a produção. |

O ficheiro `renderer.ts` conserva cor, transparência, opacidade e face dos materiais ao convertê-los para Lambert, mas elimina os mapas e a propriedade `alphaTest`. Só trata como vidro noturno opaco um material cujo nome seja exatamente `glass`. Todas as malhas transparentes recebem `castShadow` e `receiveShadow`; não há tratamento específico de sombras para materiais transparentes. Assim, um GLB válido não prova que a textura, a transparência ou as sombras aparecem corretamente no jogo.

O adaptador de materiais deve preservar o mapa de cor carregado e a sua transformação, o alfa, a identidade do material e as opções adequadas de sombra. Não aplicar a substituição de `glass` a todos os pacotes: Mini Market e Food Kit usam vidro transparente em objetos funcionais. Se a solução exigir alterar `renderer.ts`, aplica-se SYSTEM ESCALATION antes de qualquer adoção em produção.

O laboratório comparou Building Kit como envelope de casa, City Kit (Roads) e elementos exteriores, Mini Market com Food Kit num interior comercial, e City Kit (Industrial) com Factory Kit. A revisão visual confirmou a necessidade de adaptar mapas, escala e apoios antes de qualquer adoção. A ficha oficial confirma a licença e a contagem publicada, mas não substitui a inspeção dos ficheiros nem a prova num caso real.

### Limitações ainda abertas

Os hashes dos ZIP e a medição geométrica dos 1 752 GLB estão concluídos. O relatório conserva estatísticas agregadas por pacote e dados individuais dos 86 modelos selecionados; os restantes detalhes individuais podem ser reproduzidos a partir dos arquivos oficiais. As capturas de laboratório mostram apoio, escala, materiais e leitura, mas não constituem uma validação de colisões, ocupação lógica ou oclusão com pessoas e sobreposições reais.

O laboratório usa uma cena Three.js isolada que replica os parâmetros relevantes da câmara, luz, sombras e tom. O adaptador experimental conserva mapas de cor, ao contrário do renderizador de produção. Por isso, o aspeto final de um novo pacote só ficará provado depois de uma proposta de integração aprovada e de um teste num caso de produção próprio. Não alterámos o renderizador nesta missão.

**Estado:** investigação e revisão visual do laboratório concluídas; adoção por caso, materiais de produção e provas de colisão/oclusão pendentes.

## Arquétipos e efeito nas pistas

Os protótipos não criam regras novas. O motor atual relaciona pessoas com divisões, linhas, colunas e pisos. Os objetos podem ajudar a distinguir um espaço ou suportar a narrativa, mas não podem sugerir que uma bancada, lápide, viatura, máquina ou produto resolve uma pista por si só.

- Moradia suburbana, hotel e comércio podem usar divisões lógicas atuais, desde que cada pessoa e objeto continue dentro dos limites físicos validados. Fachada, jardim e rua são contexto.
- Café, restaurante e supermercado podem usar mesa, balcão, prateleira e produto como elementos visuais. Só tipos de mobiliário já declarados e associados podem integrar a lógica.
- Cemitério, acampamento, cabana sazonal, rua ou fábrica podem variar o local e os adereços. Não podem acrescentar pistas de objeto, percurso, clima, máquina ou estado do ambiente.
- Uma pista que mencione um elemento novo só é possível se a semântica já existir e a afirmação for literalmente verdadeira na solução. Uma nova semântica exige SYSTEM ESCALATION.

## Plano de protótipos

O ficheiro de dados do laboratório define onze grupos de protótipo e seleciona 86 modelos: casa suburbana; café; supermercado de bairro; cemitério; oficina ou fábrica; fachada comercial; frente urbana e estrada; acampamento; aldeia de Natal; minigolfe; e transição Building Kit/Modular Buildings. Todos carregaram e foram vistos no laboratório. A seleção continua experimental.

O comparador implementado usa cadeira, porta, parede, bancada, banco e árvore do catálogo atual, além de régua e diagnóstico de volume. As [capturas](reference/kenney-environment-expansion-v2/README.md) sustentam a decisão visual deste relatório.

Para cada protótipo, registar:

1. modelos exatos usados e proveniência;
2. dimensões e orientação medidas;
3. composição, percurso e zonas de corte;
4. materiais e superfícies de apoio;
5. colisões, visibilidade e ocupação de células;
6. captura no mesmo renderizador, câmara e iluminação do jogo;
7. leitura em computador e telemóvel;
8. decisão visual final de GPT-6 Sol High.

O [índice de evidência visual](reference/kenney-environment-expansion-v2/README.md) reúne as capturas obtidas.

## Ordem de trabalho recomendada

1. **Concluído:** verificar as fichas oficiais, licenças CC0, hashes dos 16 ZIPs e medir os 1 752 GLB. Manter a distinção entre «Files» oficial e ficheiros GLB extraídos.
2. Resolver o risco de material texturado em investigação isolada, sem alterar o renderizador como parte da produção normal.
3. **Concluído para o laboratório:** rever o comparador com os modelos de referência atuais e parâmetros de câmara e luz comparáveis; capturar o resultado. O laboratório usa um renderizador isolado, não o do jogo.
4. **Concluído para o laboratório:** selecionar poucos modelos por finalidade e montar vinhetas pequenas. Evitar importar pacotes completos.
5. **Pendente para produção:** validar apoio, colisão, oclusão, transições de interior/exterior, cortes e visibilidade com pessoas e sobreposições reais.
6. **Concluído para o laboratório:** rever visualmente as dez vinhetas e registar as capturas.
7. **Concluído para o laboratório:** classificar como DIRETO, ADAPTADOR, USO ESPECÍFICO ou REJEITAR. A adoção em produção continua a exigir uma proposta própria.

## Decisão visual

Inspecionei o laboratório no navegador a 1 440 × 1 100 e a 390 × 844. As [15 capturas iniciais](reference/kenney-environment-expansion-v2/README.md) documentam o comparador, as dez vinhetas e duas vistas móveis. O laboratório apresenta sempre a escala nativa como ponto de partida; o fator experimental não modifica os modelos do jogo. A revisão abaixo avalia os modelos escolhidos, não cada um dos 1 752 GLB individualmente. A revisão visual posterior dos quatro dioramas prioritários está resumida no [seguimento](KENNEY_ENVIRONMENT_LAB_FOLLOWUP.md).

| Pacote | Classe final | Decisão e limite observado |
| --- | --- | --- |
| Furniture Kit | DIRETO, subconjunto integrado | Define a escala, a espessura das paredes, as superfícies e a silhueta do projeto. Outros modelos do pacote ainda exigem seleção física. |
| Nature Kit | DIRETO, subconjunto integrado | A árvore, os arbustos e a vedação convivem bem com a base Furniture no [cemitério](reference/kenney-environment-expansion-v2/kenney-v2-graveyard.png). |
| Building Kit | ADAPTADOR | A parede de 2,40 u e o telhado de 2,39 u não cabem no sistema interior de parede de 1,28953 u. Servem como estudo de envelope exterior próprio, não como peças intercambiáveis. |
| Modular Buildings | ADAPTADOR | A casa completa é demasiado pequena junto da parede Building no [teste de conjunto](reference/kenney-environment-expansion-v2/kenney-v2-building-modular.png). Usar como família exterior independente após fixar uma escala e um corte coerentes. |
| City Kit (Suburban) | ADAPTADOR | A composição suburbana está aprovada para exploração. A casa à escala 1,00 tem 0,83354 u de altura, quase a figura de 0,95 u; exige adaptação de escala ou arquitetura própria para um caso com pessoas. É uma limitação dimensional, não uma rejeição estética. |
| City Kit (Commercial) | USO ESPECÍFICO | O edifício completo de três pisos aparece pequeno junto da figura e não oferece corte. Apenas fachada distante ou contexto, sem substituir o interior jogável. |
| City Kit (Industrial) | USO ESPECÍFICO | Edifício de contexto para armazém/oficina; a comparação com a maquinaria Factory não demonstrou uma escala comum. |
| City Kit (Roads) | ADAPTADOR | Peças rodoviárias têm malha de 1,00 u, diferente da célula de 0,8 u. A [vinheta](reference/kenney-environment-expansion-v2/kenney-v2-roads.png) não fechou a frente de rua; precisa de camada urbana composta e contínua, fora da grelha lógica. |
| Retro Urban Kit | ADAPTADOR, dificuldade elevada | A textura de asfalto gasto e o tratamento mais pixelizado quebram a linguagem da cena. A combinação com Roads revelou emendas e cor incoerentes; fica em ensaio isolado até encontrar uma transição de superfície convincente. |
| Mini Market | USO ESPECÍFICO | Prateleiras, expositores, arca, paredes, caixa, cesta e carrinho compõem o novo supermercado. Validar corredores e balcão com pessoas antes de criar um caso. |
| Food Kit | USO ESPECÍFICO | O bolo nativo mede 0,6392 u de largura e domina a mesa; a [adaptação experimental a 0,30×](reference/kenney-environment-expansion-v2/kenney-v2-cafe-adapted.png) restitui uma relação plausível. Exige fator por família/uso, superfícies-pai e material texturado. |
| Graveyard Kit | USO ESPECÍFICO | O [cemitério](reference/kenney-environment-expansion-v2/kenney-v2-graveyard.png) é a vinheta mais coerente, com caminho, agrupamento de campas e Nature Kit. O jazigo e as lápides altas ainda exigem prova com pessoas e pistas. |
| Factory Kit | USO ESPECÍFICO | Pequenas máquinas e caixas podem vestir uma oficina. A grua de 3,55332 u [domina o plano](reference/kenney-environment-expansion-v2/kenney-v2-industrial.png) e fica rejeitada dentro da área jogável. |
| Survival Kit | USO ESPECÍFICO | A seleção anterior é pequena perante a figura; o utilizador quer explorar melhor este grupo. Procurar uma composição de cabana/abrigo e vegetação antes de decidir a escala de um caso. |
| Holiday Kit | USO ESPECÍFICO | A cabana com paredes, telhado nevado e chaminé, árvore decorada, presentes, vedação e boneco de neve forma uma aldeia de Natal legível. O telhado exige prova de corte para não tapar pistas e pessoas. |
| Minigolf Kit | USO ESPECÍFICO | A nova [vinheta de minigolfe](http://127.0.0.1:5180/?kenneyLab=1) liga percurso, obstáculos, rampas, buracos, bandeira e bola. Testar zonas como buracos/campos; não criar semântica de pista para tacadas ou movimento. |

### O que as vinhetas permitem construir

| Vinheta | Caso e zonas possíveis | Objetos e pistas possíveis | Alcance e leitura da grelha |
| --- | --- | --- | --- |
| Cemitério | Caso memorial com entrada, alameda, grupo de campas e jazigo. | Monumentos e vegetação distinguem zonas; só relações já suportadas entre pessoa, divisão, linha, coluna e piso podem ser pistas. | Candidato a caso completo apenas após validar uma planta exterior e ocupação com pessoas. A grelha pode permanecer invisível se os caminhos e limites a tornarem legível; a vista móvel confirma apenas as formas principais. |
| Loja de bairro | Loja pequena com prateleiras, arca, balcão e área de stock. | Produtos, prateleiras e caixa são adereços de identidade; não são pistas interrogáveis sem semântica aprovada. | Candidato a caso interior depois de compor paredes Furniture, balcão e corredores físicos. A grelha pode ficar invisível; a vinheta ainda não prova circulação com pessoas. |
| Café | Sala de mesas, serviço e entrada; cozinha num ensaio posterior. | Bolo, chávenas e copos podem narrar uma pista que já refira a divisão, nunca criar nova regra de objeto. | Candidato a caso completo após adaptar Food e completar a arquitetura. A escala 0,30× funciona nas mesas testadas, mas os detalhes ficam pequenos em telemóvel e as sobreposições não foram validadas. |
| Casa suburbana | Frente de moradia, jardim, entrada e caminho. | Vedação e vegetação orientam o local, sem semântica lógica nova. | Apenas revestimento exterior nesta seleção: a casa nativa é menor do que a figura. A grelha pode manter-se invisível se o interior continuar canónico. |
| Fachada comercial e indústria | Frente de rua, armazém ou zona de serviço ao fundo. | Fachadas identificam o local; pequenas caixas/máquinas podem vestir zonas. | Contexto exterior apenas. Edifícios monolíticos ocultariam pessoas e pistas se substituíssem a casa em corte. |
| Suburbana, Natal, supermercado e minigolfe | Moradia com jardim e entrada; aldeia sazonal; loja com corredores e stock; percurso de minigolfe. | Acessórios reconhecíveis podem vestir zonas; pistas continuam limitadas às relações já suportadas pelo motor. | Candidatos a puzzles completos depois de validar ocupação humana, acessos, cortes e escala. O minigolfe deve usar a grelha apenas como estrutura interna, sem a exibir. |

### Adaptadores e prioridade

1. **Primeiro:** aprofundar a casa suburbana e a aldeia de Natal. A casa Suburban, com 0,83354 u de altura, fica quase à altura da figura de 0,95 u. A estética é aprovada para exploração, mas a família precisa de escala ou arquitetura própria para alojar pessoas e pistas.
2. **Segundo:** transformar o supermercado em planta jogável. Definir balcão, corredores, stock e saída; validar a figura Mini Market de 0,72335 u e a caixa de 0,5949 u junto da referência canónica.
3. **Terceiro:** testar um caso de minigolfe com buracos como zonas e percurso apenas como composição visual. Manter a lógica dentro das relações existentes e a grelha invisível.
4. **Depois:** completar café, cemitério, Survival e fachadas Urban/Building. Manter Retro Urban isolado até resolver a diferença de textura, paleta e junção à estrada normal.

O adaptador técnico necessário para os 14 pacotes texturados deve preservar `map`, a transformação `KHR_texture_transform`, alfa e identidade do material, tratar vidro por pacote e limitar sombras de superfícies transparentes. A adaptação de escala deve ser explícita por família e contexto, com apoio físico declarado; nenhuma peça pode receber elevação livre para esconder uma incompatibilidade. O laboratório implementa esse ensaio de forma isolada. A sua passagem ao renderizador de produção exige a escalada de sistema indicada abaixo, revisão visual e validação de casos próprios.

## Trabalho delegado e revisão

GPT-6 Luna XHigh pode executar tarefas delimitadas de medição, inventário, composição de protótipos de laboratório, recolha de capturas preliminares e validação mecânica. Cada resultado deve incluir fontes, ficheiros exatos e limites conhecidos.

GPT-6 Sol High decide a direção visual, a prioridade dos arquétipos, a compatibilidade final, a seleção dos modelos e a aprovação das capturas. Só GPT-6 Sol High pode declarar a revisão visual concluída.

## SYSTEM ESCALATION

Registar uma escalada antes de qualquer trabalho que precise de uma alteração fundamental. Estes cenários exigem decisão de arquitetura se não couberem nas capacidades atuais:

| Necessidade | Motivo da escalada |
| --- | --- |
| Acrescentar semântica de pista para objetos, máquinas, clima, caminhos ou interação | O motor atual não autoriza estes tipos de relação. |
| Criar um terceiro piso ou mudar a semântica de circulação entre pisos | O contrato de produção cobre até dois pisos. |
| Alterar escala, elevação livre por objeto, câmara, luz, esquema ou física | São partes fundamentais do sistema, não soluções locais de composição. |
| Adotar materiais texturados se o suporte exigir alterar `renderer.ts` | O renderizador atual descarta a propriedade `map` ao converter materiais para Lambert. |
| Introduzir grelha rodoviária, lote urbano ou abertura que o esquema atual não represente | Exige uma topologia ou forma arquitetónica diferente da cena aprovada. |
| Alterar colisões ou tolerâncias para aceitar modelos inadequados | A correção pertence à seleção do recurso ou a um adaptador autorizado, não a afrouxar o validador. |

Cada registo deve identificar o arquétipo, a regra que bloqueia a cena, a prova medida ou visual, os ficheiros fundamentais afetados, as alternativas dentro do sistema atual e a decisão solicitada. Não fazer adaptações improvisadas de escala ou deslocamento para ocultar incompatibilidades.

Enquanto não houver decisão, podem continuar tarefas independentes de documentação, inventário e comparação. A integração de conteúdo fica limitada aos modelos já medidos e usados por cenas implementadas.
