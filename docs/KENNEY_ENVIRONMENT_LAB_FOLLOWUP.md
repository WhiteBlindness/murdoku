# Seguimento do laboratório de ambientes Kenney

Revisão de 24/09/2026 no ramo `sol/kenney-environment-expansion-v2`, com quatro protótipos revistos por Astra no laboratório local. Este documento atualiza as classificações do [relatório v2](KENNEY_ENVIRONMENT_EXPANSION_V2.md). «Uso específico» identifica uma família válida para certos ambientes; não significa rejeição.

## Medição e proveniência

O laboratório mede 1 752 modelos GLB de 16 pacotes oficiais, sem falhas, e carrega 86 modelos selecionados em 11 protótipos. A medição serve para comparar amostras reais, não aprova automaticamente um pacote inteiro.

O [Minigolf Kit](https://kenney.nl/assets/minigolf-kit) foi obtido no catálogo oficial da Kenney. O ZIP tem o nome `kenney_minigolf-kit.zip`, hash SHA-256 `74B7BF5CF82BF8A5225319ADE1284600C64F9482AE66F0CCF1F22D2212D5A952` e licença CC0, conforme a ficha oficial. O repositório guarda apenas 13 modelos selecionados e as respetivas texturas para o laboratório. Os outros pacotes e a proveniência estão listados no [relatório de medição](reports/kenney-lab-measurements.json).

## Classificação dos 16 pacotes

| Pacote | Classe | Uso e condição principal |
| --- | --- | --- |
| Furniture Kit | DIRETO | Referência atual de escala e arquitetura; apenas os modelos já integrados estão aprovados. |
| Nature Kit | DIRETO | Vegetação e elementos exteriores já usados; manter a seleção validada. |
| Building Kit | ADAPTADOR | Arquitetura exterior com escala própria; não encaixa na parede interior atual. |
| Modular Buildings | ADAPTADOR | Família de casas exteriores independente; precisa de escala e solução de corte próprias. |
| City Kit (Suburban) | ADAPTADOR | Estética aprovada para exploração. A casa à escala 1,00 tem 0,83354 u de altura, quase a figura de 0,95 u; um caso com pessoas exige adaptação de escala ou outra arquitetura. É uma limitação dimensional, não uma rejeição visual. |
| City Kit (Commercial) | USO ESPECÍFICO | Fachada e enquadramento exterior; edifícios completos não substituem divisões em corte. |
| City Kit (Industrial) | USO ESPECÍFICO | Contexto de armazém ou oficina; compatibilidade de escala com máquinas por validar. |
| City Kit (Roads) | ADAPTADOR | Compor uma camada de rua contínua. O módulo de 1,00 u não coincide com a célula de 0,8 u. |
| Retro Urban Kit | ADAPTADOR, risco elevado | O asfalto e as texturas retro são os que mais se afastam da linguagem atual. Manter isolado até resolver paleta, junções e transição com Roads. |
| Mini Market | USO ESPECÍFICO | Loja de bairro ou supermercado, com corredores, balcão, arcas e stock; validar circulação e escala com pessoas. |
| Food Kit | USO ESPECÍFICO | Café, restaurante e cozinha; requer escala por tipo de adereço e superfícies de apoio declaradas. |
| Graveyard Kit | USO ESPECÍFICO | Cemitério ou jardim memorial; testar oclusão de pessoas e pistas junto de monumentos altos. |
| Survival Kit | USO ESPECÍFICO | Acampamento ou abrigo remoto; desenvolver uma composição maior antes de definir uma escala de caso. |
| Holiday Kit | USO ESPECÍFICO | Cabana nevada e espaço sazonal; protótipo aprovado para exploração, com corte e oclusão por validar. |
| Minigolf Kit | USO ESPECÍFICO | Percurso temático com buracos e obstáculos como zonas visuais; não introduzir regras de tacada nem movimento. |
| Factory Kit | USO ESPECÍFICO | Oficina ou zona de manutenção; manter gruas e maquinaria alta fora das áreas jogáveis até prova de oclusão. |

Não se rejeita nenhum destes 16 pacotes nesta ronda. Retro Urban continua a ser o caso mais difícil. Os restantes merecem exploração dentro dos ambientes em que a escala, a função e a composição fazem sentido.

## Quatro protótipos revistos

Os quatro dioramas foram inspecionados em `http://127.0.0.1:5180/?kenneyLab=1`, com escala nativa como ponto de partida e sem alterar puzzles existentes. As capturas atuais de cada diorama estão ligadas na tabela; as [capturas arquivadas do ciclo v2](reference/kenney-environment-expansion-v2/README.md) documentam as comparações anteriores.

| Protótipo | Leitura e potencial de caso | Próxima prova necessária |
| --- | --- | --- |
| [Casa suburbana](reference/kenney-environment-expansion-v2/followup-suburban.png) | A casa, a entrada, o caminho, a vedação e a vegetação formam uma frente de moradia mais agrupada. Pode apoiar um caso residencial com jardim e entrada, mantendo as divisões interiores numa arquitetura compatível com pessoas. | Resolver a altura da casa face à figura, definir limites entre exterior e divisões e testar pistas com pessoas e sobreposições. |
| [Aldeia de Natal](reference/kenney-environment-expansion-v2/followup-holiday.png) | Cabana, telhado com neve e chaminé, árvore, presentes, lanterna e boneco de neve compõem um ambiente sazonal coerente. Pode vestir uma casa, oficina de brinquedos ou espaço festivo. | Confirmar a montagem do telhado e a vista em corte; garantir que a decoração não tapa pessoas nem pistas. |
| [Supermercado de bairro](reference/kenney-environment-expansion-v2/followup-market.png) | Paredes, corredores de prateleiras, expositor, arca, caixa, carrinho e funcionário dão estrutura à loja. A base frontal foi reduzida para concentrar a composição. | Medir circulação e acesso ao balcão com pessoas; preservar a transparência da janela e confirmar zonas de stock. |
| [Minigolfe](reference/kenney-environment-expansion-v2/followup-minigolf.png) | Percurso modular, rampas, túnel, moinho, buracos, bandeira e bola são legíveis em conjunto. Pode oferecer campos como zonas distintas num caso temático. | Corrigir o pivô da bola, que fica 0,03492 u abaixo do chão, e validar pessoas e sobreposições. A disposição visual do percurso não deve criar regras de movimento. |

O catálogo atual já permite experimentar uma moradia, uma aldeia sazonal, um supermercado e um percurso de minigolfe sem alterar o sistema de puzzles. Os objetos apenas distinguem visualmente zonas. As pistas continuam limitadas às relações que o jogo já suporta.

As propostas para converter estas vinhetas em casos completos, com função de cada zona, mistura de pacotes e limites de escala, estão em [Casos possíveis a partir do laboratório Kenney](KENNEY_PRODUCTION_CASE_CONCEPTS.md). O minigolfe passa a ser pensado como um estabelecimento com bilheteira, oficina e dois percursos, em vez de uma amostra isolada de obstáculos.

## Limites técnicos e roteiro

Furniture Kit e Nature Kit são as únicas famílias da amostra sem mapas de cor. Os outros 14 pacotes usam texturas e `KHR_texture_transform`. A janela do Mini Market tem transparência e alguns conjuntos incluem superfícies semitransparentes. O laboratório ensaia o carregamento e os materiais à parte; o renderizador de produção ainda não conserva este fluxo. A integração de texturas na produção exige uma escalada de sistema e revisão própria. Cada família também precisa de regras explícitas de escala, pivô, contacto com o chão, superfície de apoio e sombra.

Próximos passos:

1. Desenvolver arquitetura suburbana e sazonal com escala suficiente para pessoas e pistas.
2. Experimentar uma planta jogável de supermercado, com corredores, balcão, stock e circulação verificável.
3. Prototipar um caso de minigolfe em que os campos sejam zonas reconhecíveis e as regras atuais se mantenham.
4. Explorar café, cemitério, oficina e Survival como experiências independentes.
5. Isolar Retro Urban até ser possível ligá-lo visualmente a Roads sem emendas ou mudança brusca de paleta.

Nenhum protótipo é um caso de produção. Não se alteraram a geometria de cenas existentes, as escolhas de modelos de puzzles, a câmara, o renderizador, a lógica, as pistas, o gerador ou o solucionador.
