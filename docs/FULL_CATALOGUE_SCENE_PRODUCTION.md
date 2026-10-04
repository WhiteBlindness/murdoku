# Produção das cenas do catálogo completo

Ramo autorizado para esta missão: `sol/full-catalogue-scene-production-v1`.
Este nome constitui uma exceção expressa do proprietário à convenção histórica `opus/*`.
Referência de origem: `aa384c2f69ab6168786abccf04f713ad3ae24a58`.

Inventário inicial: 60 casos, 4 cenas protegidas e 56 cenas por produzir.

## Lote 1: decisão arquitetónica

As seis cenas conservam as divisões, o mobiliário lógico, as pistas e as soluções geradas pelo catálogo. A arquitetura visual separa funções e percursos sem transformar cada fronteira lógica numa parede.

| Caso | Ambiente aprovado | Organização e razão |
|---|---|---|
| `very-easy-3` | Anexo de serviço e ensaio no jardim | A despensa ocupa o canto sudoeste; o jardim fica a noroeste e o espaço de ensaio ao ar livre estende-se a este. Mesa, cadeiras e coluna de som identificam a zona de ensaio. |
| `very-easy-4` | Cozinha de clube com jardim | Duas zonas de preparação tornam plausíveis os dois fogões e os dois frigoríficos lógicos; a ala oriental comunica com a entrada pavimentada e o jardim. |
| `very-easy-5` | Escritório, alpendre e jardim murado | O jardim ocupa um pátio rebaixado. Portas e passagens ligam o escritório e o alpendre ao pátio, com canteiros em grupos naturais. Não existe um modelo de jarra partida aprovado para representar literalmente o título. |
| `very-easy-6` | Residência com pátio de entrada e alcova de estudo | O pátio é murado e rebaixado; a sala de jantar inclui uma alcova de trabalho que evoca o estudo do título sem criar outra divisão lógica. A despensa ocupa o canto sudoeste. |
| `very-easy-7` | Casa urbana inteiramente interior | Três faixas dão lugar à sala de jantar, à cozinha estreita e à galeria de entrada. A circulação atravessa duas passagens legíveis. |
| `very-easy-8` | Sala de jantar, escritório e varanda exterior | A varanda aberta ocupa o canto noroeste. O tapete lógico permanece na sala de jantar, associado à sua pegada de duas por duas células. |

A referência Kenney V3 permanece separada deste ramo. Os dez modelos novos estão classificados como condicionais, e nenhum é necessário para representar as pistas deste lote.

## Lote 1: implementação e revisão visual

As seis cenas foram escritas à mão e registadas no catálogo. As divisões, o mobiliário lógico, as pistas e as soluções dos quebra-cabeças foram preservados. GPT-6 Luna reviu as capturas de computador e telemóvel; GPT-6 Sol inspecionou pessoalmente as cenas renderizadas e aceitou o lote.

O lote 1 foi publicado em `sol/full-catalogue-scene-production-v1` no *commit* `76dd586`.

## Lote 2: implementação e revisão visual

Foram concluídas seis cenas escritas à mão, de `easy-2` a `easy-7`. As cinco cenas novas foram registadas no catálogo, e a cena existente de `easy-2` foi corrigida para mostrar as células `(3,5)` e `(5,4)`. A lógica dos casos permaneceu intacta. As seis cenas foram abertas no navegador e revistas em computador (1440×900) e telemóvel (390×844). GPT-6 Luna fez a primeira revisão visual; GPT-6 Sol inspecionou os resultados renderizados e aceitou o lote.

O lote 2 está registado no *commit* `f64a54b` e foi publicado em `sol/full-catalogue-scene-production-v1`.

`npm test -- tests/IsoBoard.test.tsx --reporter=dot` passou 51 testes. `npm run validate:production` passou os seis controlos de pré-produção. `npm run lint` e `npm run build` passaram. A bateria completa passou 453 testes e ignorou 5.

## Lote 3: implementação e revisão visual

Foram concluídas seis cenas escritas à mão, de `easy-8` a `medium-3`. O lote combina casas com pátio, casa de jantar com cozinha, moradia estreita com salas separadas e uma galeria com salão central aberto. GPT-6 Luna preparou e reviu as propostas arquitetónicas; GPT-6 Sol reviu o lote em conjunto e inspecionou pessoalmente as cenas finais.

As seis cenas foram abertas no navegador e revistas em computador (1440×900), telemóvel (390×844) e vista de diagnóstico. A lógica dos casos e todas as células de mobiliário lógico foram preservadas. Nos casos com relógio, o modelo Kenney V3 `radio` representa visualmente o objeto lógico `clock`, porque o conjunto aprovado não inclui um modelo de relógio.

O lote 3 foi publicado em `sol/full-catalogue-scene-production-v1` no *commit* `f292eb1`. `npm test -- --reporter=dot` passou 459 testes e ignorou 5; `npm run validate:production`, `npm run lint`, `npm run build` e `node scripts/measure-puzzles.mjs --check` passaram.

## Lote 4: decisão arquitetónica

As seis propostas mantêm um só piso e respeitam as divisões, as peças lógicas e as respetivas células. A arquitetura varia entre uma moradia de campo com galeria de jantar e jardim murado (`medium-4`), uma moradia estreita com galeria de entrada, pátio frontal e jardim (`medium-5`), uma residência de serviço organizada em quadrantes (`medium-6`), uma casa térrea em L com ala de jantar e cozinha de serviço (`medium-7`), um bungalow com gabinete, alpendre e jardim traseiro (`medium-8`) e uma moradia estreita com sala, corredor e jardim lateral (`medium-9`).

Os objetos lógicos `clock` são representados por rádios Kenney V3 nas células previstas, pois o conjunto aprovado não contém um relógio. O título `Whispers Upstairs` não justifica um segundo piso: a solução de `medium-7` é térrea. Também não foi acrescentado um espelho partido literal a `medium-8`, porque esse objeto não faz parte do conjunto aprovado.

## Lote 4: implementação e revisão visual

As seis cenas foram escritas à mão e registadas no catálogo. GPT-6 Luna reviu as vistas de computador e não pediu correções. GPT-6 Sol inspecionou pessoalmente as seis cenas renderizadas em computador (1440×1000) e telemóvel (390×844), reviu também as vistas de diagnóstico e aceitou o lote. As cenas preservam as células e a semântica dos casos.

O lote 4 está registado no *commit* `466cd39`. `npm run validate:production` passou os seis controlos; `npm test -- tests/IsoBoard.test.tsx --reporter=dot` passou 63 testes. A bateria completa passou 465 testes e ignorou 5. `npm run lint`, `npm run build` e `node scripts/measure-puzzles.mjs --check` passaram.

## Lote 4: ambientes aprovados

| Caso | Ambiente | Organização e razão |
|---|---|---|
| `medium-4` | Moradia de campo, galeria de jantar e jardim murado | O corredor a sul recebe as pistas de relógio; o jardim de entrada e o jardim murado distinguem chegada e zona privada. |
| `medium-5` | Moradia estreita com galeria, pátio frontal e jardim | O percurso longitudinal acomoda a sequência de quatro relógios no corredor, sem os misturar com a faixa de jantar. |
| `medium-6` | Residência de serviço com escritório e dois pátios | A organização em quadrantes separa o escritório e a sala de jantar, com pátio de chegada e jardim murado. |
| `medium-7` | Casa térrea em L com corredor, sala de jantar e cozinha de serviço | O jardim frontal acompanha a ala de jantar; o corredor transversal liga as divisões sem escadas nem piso superior. |
| `medium-8` | Bungalow com gabinete, alpendre e jardim traseiro | O gabinete e o corredor cruzado estruturam o interior; o jardim traseiro completa a planta sem introduzir um adereço que não existe no catálogo. |
| `medium-9` | Moradia estreita com sala, alpendre e jardim lateral | A sala e o corredor mantêm as células de relógio nos espaços definidos pela lógica; o alpendre e o jardim dão variedade à fachada. |

## Lote 5: decisão arquitetónica

O lote combina três moradias térreas com plantas distintas e três casas de dois pisos. Os pisos superiores preservam a dependência lógica dos casos. Nos três casos difíceis, cada ligação entre pisos tem uma função clara.

| Caso | Ambiente | Organização e razão |
|---|---|---|
| `medium-10` | Moradia urbana com galeria central e cozinha de serviço | A galeria organiza a circulação e separa as funções domésticas. |
| `medium-11` | Casa entre um pátio verde e um jardim de chegada | Os espaços exteriores distinguem a área privada da entrada. |
| `medium-12` | Moradia térrea com loggia, galeria central e escritório | A galeria liga as divisões; a loggia e o espaço exterior completam a planta. |
| `hard-2` | Moradia de dois pisos com alpendre, pátio frontal e galeria exterior | O `Front Yard` mantém-se exterior; a galeria aberta do piso superior acompanha a casa e tem guarda nas margens expostas. |
| `hard-3` | Moradia de dois pisos com alpendre e jardim envidraçado | A zona de jardim e o alpendre estruturam o piso térreo; o piso superior distribui quarto, estudo, casa de banho e circulação. |
| `hard-4` | Moradia de dois pisos com pátio de entrada plantado | A entrada e o escritório ficam no piso térreo; o piso superior acomoda estudo, cozinha, casa de banho e quarto. |

## Lote 5: implementação e revisão visual

As seis cenas foram escritas à mão e registadas no catálogo. Foram abertas no Microsoft Edge e revistas em computador a 1600×1200. GPT-6 Luna fez a primeira revisão das 12 vistas. GPT-6 Sol inspecionou os resultados renderizados e aceitou os seis casos.

Depois de a revisão detetar que o `Front Yard` de `hard-2` aparecia como interior, a cena passou a mostrar um pátio exterior e uma galeria aberta no piso superior. A Luna reviu novamente as capturas corrigidas, incluindo a vista fantasma, e aceitou a integração da galeria. Não foram alteradas as pistas, as soluções, as divisões lógicas nem o esquema da cena.

O lote 5 foi registado nos *commits* `2cf8b5c` e `14ce9e2`. `npm run validate:production` passou os seis controlos; `npm test -- --reporter=dot` passou 474 testes e ignorou 5. `npm run lint`, `npm run build` e `node scripts/measure-puzzles.mjs --check` passaram. O lote foi publicado em `sol/full-catalogue-scene-production-v1`.

## Lote 6: hard-7 implementado e validado

A cena de `hard-7` foi escrita à mão nos dois pisos, sem alterar as pistas, as divisões lógicas, as peças de mobiliário ou a solução. O piso térreo organiza a sala, o vestíbulo de entrada, o átrio e a cozinha. No piso superior, o estudo, o quarto, a casa de banho e o escritório ligam-se por galerias secas ao patamar da escada. O vestíbulo fechado dá apoio ao piso superior sem colocar lajes sobre jardins ou outras áreas exteriores.

A circulação, a leitura das pistas, as guardas da abertura da escada, a casa de banho e a apresentação em telemóvel foram revistas. A passagem junto ao candeeiro lógico mede 0,672 m; as peças da casa de banho não colidem com as portas. A interação foi testada até à acusação correta e à persistência local do caso resolvido.

As provas visuais incluem [piso térreo](reference/sol-catalogue/hard-7-ground-environment.png), [piso superior](reference/sol-catalogue/hard-7-upper-environment.png), [vista explodida](reference/sol-catalogue/hard-7-exploded-overview.png), [diagnóstico do piso térreo](reference/sol-catalogue/hard-7-ground-diagnostic.png), [diagnóstico do piso superior](reference/sol-catalogue/hard-7-upper-diagnostic.png), [vista de telemóvel do piso térreo](reference/sol-catalogue/hard-7-mobile-ground.png) e [vista de telemóvel do piso superior](reference/sol-catalogue/hard-7-mobile-upper.png). O lote 6 passou os seis controlos de produção, 476 testes (5 ignorados), o lint, a compilação e a verificação de atualidade do relatório dos quebra-cabeças.

## Lote 7: apoio exterior e cinco cenas de dois pisos

### Modelo de apoio estrutural

O bloqueio era comum aos cinco casos: o esquema representava o piso navegável e as zonas de terreno, mas não tinha uma estrutura portante independente. O validador só aceitava células interiores do piso inferior como apoio da laje superior. Os casos mantêm as soluções canónicas; o terreno exterior continua exterior e não ganha piso navegável.

`exteriorSupportBays` declara módulos retangulares de apoio no piso térreo. Cada módulo cobre até três células por lado e gera pilares assentes na cota real do terreno, vigas perimetrais e barrotes. O validador verifica que a projeção coincide com o piso interior superior, que os pilares têm terreno sob as bases, que os elementos formam um caminho de carga contínuo, que a estrutura não atravessa o vão da escada e que não existem módulos sobrepostos, órfãos ou declarados em pisos superiores. Os pilares também entram nas verificações de colisão, circulação e espaço livre nas posições solucionadas. Esta estrutura não altera `floorPresent`, `zoneKind` nem a navegação do exterior.

O renderizador cria os elementos determinísticos durante a preparação da cena, fora do ciclo de animação. As vigas e os pilares usam geometria e materiais Kenney compatíveis com a linguagem isométrica existente.

### Geometria dos cinco casos

A interseção foi recalculada a partir das cenas resolvidas, contando células interiores superiores diretamente sobre zonas não interiores no piso térreo. O valor anteriormente registado, 113, omitia nove células do alpendre coberto de `hard-5`; o total verificado é 122.

| Caso | Células superiores sobre exterior | Sobreposição física |
|---|---:|---|
| `hard-5` | 29 | 20 células do `Front Yard` e 9 do alpendre coberto; jardim e alpendre recebem apoios separados. |
| `hard-6` | 15 | Casa de banho superior sobre o `Front Yard`. |
| `hard-8` | 15 | Quarto e casa de banho superiores sobre o `Garden`. |
| `hard-9` | 15 | Estudo e sala superiores sobre o `Front Yard`. |
| `hard-10` | 48 | Estudo, casa de banho, cozinha e quarto sobre o `Front Yard`, o `Garden` e o `Porch`. |
| **Total** | **122** | As zonas exteriores continuam separadas do piso navegável. |

As cinco cenas foram escritas à mão e registadas no catálogo. A geometria lógica, as pistas, as posições solucionadas e as respostas permanecem inalteradas. Cada caso foi aberto no Microsoft Edge, revisto nos dois pisos em computador (1600×1200) e telemóvel (390×844), e jogado até à resolução correta. Não foram observados erros de consola, posições solucionadas obstruídas nem falhas de circulação.

O validador mantém os avisos de linha de visão 3D. Para estes cinco edifícios, os 42 avisos observados em dez vistas de piso têm expectativas exatas por célula e bloqueador; vistas ghost e exploded são comparadas separadamente. Qualquer aviso novo ou alteração da parede, do móvel, da escada ou do pilar que bloqueia uma célula reprova o teste. A camada interativa do tabuleiro mantém os marcadores visíveis e selecionáveis sobre a cena 3D, o que foi confirmado durante as cinco resoluções.

| Caso | Vistas e prova de resolução |
|---|---|
| `hard-5` | [piso térreo](reference/sol-catalogue/hard-5-ground-environment.jpg), [piso superior](reference/sol-catalogue/hard-5-upper-environment.jpg), [vista explodida](reference/sol-catalogue/hard-5-exploded-overview.jpg), [telemóvel: térreo](reference/sol-catalogue/hard-5-mobile-ground.jpg), [telemóvel: superior](reference/sol-catalogue/hard-5-mobile-upper.jpg), [solução no térreo](reference/sol-catalogue/hard-5-solved-ground.jpg), [solução no piso superior](reference/sol-catalogue/hard-5-solved-upper.jpg). |
| `hard-6` | [piso térreo](reference/sol-catalogue/hard-6-ground-environment.jpg), [piso superior](reference/sol-catalogue/hard-6-upper-environment.jpg), [vista explodida](reference/sol-catalogue/hard-6-exploded-overview.jpg), [telemóvel: térreo](reference/sol-catalogue/hard-6-mobile-ground.jpg), [telemóvel: superior](reference/sol-catalogue/hard-6-mobile-upper.jpg), [solução no térreo](reference/sol-catalogue/hard-6-solved-ground.jpg), [solução no piso superior](reference/sol-catalogue/hard-6-solved-upper.jpg). |
| `hard-8` | [piso térreo](reference/sol-catalogue/hard-8-ground-environment.jpg), [piso superior](reference/sol-catalogue/hard-8-upper-environment.jpg), [vista explodida](reference/sol-catalogue/hard-8-exploded-overview.jpg), [telemóvel: térreo](reference/sol-catalogue/hard-8-mobile-ground.jpg), [telemóvel: superior](reference/sol-catalogue/hard-8-mobile-upper.jpg), [solução no térreo](reference/sol-catalogue/hard-8-solved-ground.jpg), [solução no piso superior](reference/sol-catalogue/hard-8-solved-upper.jpg). |
| `hard-9` | [piso térreo](reference/sol-catalogue/hard-9-ground-environment.jpg), [piso superior](reference/sol-catalogue/hard-9-upper-environment.jpg), [vista explodida](reference/sol-catalogue/hard-9-exploded-overview.jpg), [telemóvel: térreo](reference/sol-catalogue/hard-9-mobile-ground.jpg), [telemóvel: superior](reference/sol-catalogue/hard-9-mobile-upper.jpg), [solução no térreo](reference/sol-catalogue/hard-9-solved-ground.jpg), [solução no piso superior](reference/sol-catalogue/hard-9-solved-upper.jpg). |
| `hard-10` | [piso térreo](reference/sol-catalogue/hard-10-ground-environment.jpg), [piso superior](reference/sol-catalogue/hard-10-upper-environment.jpg), [vista explodida](reference/sol-catalogue/hard-10-exploded-overview.jpg), [telemóvel: térreo](reference/sol-catalogue/hard-10-mobile-ground.jpg), [telemóvel: superior](reference/sol-catalogue/hard-10-mobile-upper.jpg), [solução no térreo](reference/sol-catalogue/hard-10-solved-ground.jpg), [solução no piso superior](reference/sol-catalogue/hard-10-solved-upper.jpg). |

### Evidências visuais adicionais

As capturas seguintes mostram os pisos, as vistas explodidas, a colocação da solução e a resolução correta em computador e telemóvel.

| Caso | Vistas e prova de resolução |
|---|---|
| `hard-11` | [rés-do-chão](reference/sol-catalogue/hard-11-ground-environment.jpeg), [piso superior](reference/sol-catalogue/hard-11-upper-environment.jpeg), [explodida](reference/sol-catalogue/hard-11-exploded-overview.jpeg), [solução térrea](reference/sol-catalogue/hard-11-solution-ground.jpeg), [solução superior](reference/sol-catalogue/hard-11-solution-upper.jpeg), [telemóvel térreo](reference/sol-catalogue/hard-11-mobile-ground.jpeg), [telemóvel superior](reference/sol-catalogue/hard-11-mobile-upper.jpeg), [resolução](reference/sol-catalogue/hard-11-case-closed.jpeg). |
| `hard-12` | [rés-do-chão](reference/sol-catalogue/hard-12-ground-environment.jpeg), [piso superior](reference/sol-catalogue/hard-12-upper-environment.jpeg), [explodida](reference/sol-catalogue/hard-12-exploded-overview.jpeg), [solução térrea](reference/sol-catalogue/hard-12-solution-ground.jpeg), [solução superior](reference/sol-catalogue/hard-12-solution-upper.jpeg), [telemóvel térreo](reference/sol-catalogue/hard-12-mobile-ground.jpeg), [telemóvel superior](reference/sol-catalogue/hard-12-mobile-upper.jpeg), [resolução](reference/sol-catalogue/hard-12-case-closed.jpeg). |
| `expert-1` | [rés-do-chão](reference/sol-catalogue/expert-1-ground-environment.jpeg), [piso superior](reference/sol-catalogue/expert-1-upper-environment.jpeg), [explodida](reference/sol-catalogue/expert-1-exploded-overview.jpeg), [solução térrea](reference/sol-catalogue/expert-1-solution-ground.jpeg), [solução superior](reference/sol-catalogue/expert-1-solution-upper.jpeg), [telemóvel térreo](reference/sol-catalogue/expert-1-mobile-ground.jpeg), [telemóvel superior](reference/sol-catalogue/expert-1-mobile-upper.jpeg), [resolução](reference/sol-catalogue/expert-1-case-closed.jpeg). |
| `expert-2` | [rés-do-chão](reference/sol-catalogue/expert-2-ground-environment.jpeg), [piso superior](reference/sol-catalogue/expert-2-upper-environment.jpeg), [explodida](reference/sol-catalogue/expert-2-exploded-overview.jpeg), [solução térrea](reference/sol-catalogue/expert-2-solution-ground.jpeg), [solução superior](reference/sol-catalogue/expert-2-solution-upper.jpeg), [telemóvel térreo](reference/sol-catalogue/expert-2-mobile-ground.jpeg), [telemóvel superior](reference/sol-catalogue/expert-2-mobile-upper.jpeg), [resolução](reference/sol-catalogue/expert-2-case-closed.jpeg). |
| `expert-3` | [rés-do-chão](reference/sol-catalogue/expert-3-ground-environment.jpeg), [piso superior](reference/sol-catalogue/expert-3-upper-environment.jpeg), [explodida](reference/sol-catalogue/expert-3-exploded-overview.jpeg), [solução térrea](reference/sol-catalogue/expert-3-solution-ground-correct.jpeg), [solução superior](reference/sol-catalogue/expert-3-solution-upper.jpeg), [telemóvel térreo](reference/sol-catalogue/expert-3-mobile-ground.jpeg), [telemóvel superior](reference/sol-catalogue/expert-3-mobile-upper.jpeg), [resolução](reference/sol-catalogue/expert-3-case-closed.jpeg). |

O lote 7 não altera o solucionador, o gerador de casos nem a semântica dos quebra-cabeças. A validação estrutural inclui testes positivos e negativos para terreno sem apoio, balanço excessivo, módulos órfãos ou sobrepostos, fundações sem terreno, colisões e metadados de navegação inválidos.

O modelo de apoio e a respetiva validação estão no *commit* `979d100`; as dez cenas e o registo dos cinco casos estão no *commit* `6826f06`.

Na verificação final, `npm test -- --reporter=dot` passou 506 testes e ignorou 5 (511 no total). `npm run validate:production` passou os sete controlos; `npm run verify` passou 64 testes. Também passaram `npm run lint`, `npm run build` e `node scripts/measure-puzzles.mjs --check`. `npm run report:puzzles` gerou o relatório atual dos 60 casos. A derivação dos 126 elementos de apoio das cinco cenas demora entre 0,018 e 0,062 ms por cena, em média numa amostra de 2 000 iterações; o renderizador cria a geometria ao preparar a cena, sem cálculos por fotograma.

## Auditoria da dependência entre pisos

A contagem de pisos não foi inferida da dificuldade. Foram construídos os 60 casos a partir da versão determinística do catálogo e inspecionadas as pistas, a solução, as divisões e o mobiliário. Nos 30 casos atualmente com dois pisos, a solução coloca pessoas nos dois. Cada um contém também quatro divisões e 9 a 19 peças lógicas no piso superior. Retirar esse piso, mesmo nos seis casos sem uma pista vertical literal, altera o espaço de posições, a identidade das divisões e a solução matemática. Na auditoria inicial, 26 casos deste grupo ainda não tinham cena autorada. Os lotes 6 e 7 concluíram `hard-7` e os cinco casos com apoio exterior; o lote atual acrescentou `hard-11`, `hard-12` e `expert-1` a `expert-3`. Restam 15 casos de vários pisos por produzir.

Na coluna das pistas, «não explícitas» significa apenas ausência dos tipos `floor`, `above` e `below`. As pistas sobre divisões e mobiliário continuam a ser avaliadas no piso da posição candidata.

| Caso | Dificuldade | Pisos atuais | Pistas dependentes do piso? | Semântica da solução dependente do piso? | Exige vários pisos? | Arquitetura recomendada | Motivo |
|---|---|---:|---|---|---|---|---|
| `hard-1` | Hard | 2 | Sim (`floor + above`) | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `hard-2` | Hard | 2 | Sim (`floor`) | Sim (3 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `hard-3` | Hard | 2 | Não explícitas | Sim (1 pessoa no piso 1) | SIM | Habitação de 2 pisos | Sem pista vertical literal, mas posições, divisões e mobiliário do piso 1 integram a solução. |
| `hard-4` | Hard | 2 | Sim (`floor`) | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `hard-5` | Hard | 2 | Sim (`floor + floor`) | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `hard-6` | Hard | 2 | Sim (`floor + below`) | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `hard-7` | Hard | 2 | Não explícitas | Sim (3 pessoas no piso 1) | SIM | Habitação de 2 pisos | Sem pista vertical literal, mas posições, divisões e mobiliário do piso 1 integram a solução. |
| `hard-8` | Hard | 2 | Não explícitas | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Sem pista vertical literal, mas posições, divisões e mobiliário do piso 1 integram a solução. |
| `hard-9` | Hard | 2 | Sim (`below`) | Sim (3 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `hard-10` | Hard | 2 | Sim (`below`) | Sim (1 pessoa no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `hard-11` | Hard | 2 | Sim (`above`) | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `hard-12` | Hard | 2 | Sim (`below`) | Sim (3 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `expert-1` | Expert | 2 | Sim (`floor + floor + above`) | Sim (3 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `expert-2` | Expert | 2 | Sim (`floor`) | Sim (5 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `expert-3` | Expert | 2 | Sim (`below`) | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `expert-4` | Expert | 2 | Sim (`above`) | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `expert-5` | Expert | 2 | Sim (`below`) | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `expert-6` | Expert | 2 | Não explícitas | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Sem pista vertical literal, mas posições, divisões e mobiliário do piso 1 integram a solução. |
| `expert-7` | Expert | 2 | Sim (`floor + below`) | Sim (3 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `expert-8` | Expert | 2 | Sim (`floor + floor`) | Sim (1 pessoa no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `expert-9` | Expert | 2 | Não explícitas | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Sem pista vertical literal, mas posições, divisões e mobiliário do piso 1 integram a solução. |
| `expert-10` | Expert | 2 | Sim (`floor + floor`) | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `master-1` | Master | 2 | Sim (`below`) | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `master-2` | Master | 2 | Sim (`floor + floor + below`) | Sim (4 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `master-3` | Master | 2 | Sim (`floor + above + above`) | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `master-4` | Master | 2 | Sim (`floor + floor + below`) | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `master-5` | Master | 2 | Não explícitas | Sim (3 pessoas no piso 1) | SIM | Habitação de 2 pisos | Sem pista vertical literal, mas posições, divisões e mobiliário do piso 1 integram a solução. |
| `master-6` | Master | 2 | Sim (`floor + floor + below`) | Sim (3 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `master-7` | Master | 2 | Sim (`floor`) | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |
| `master-8` | Master | 2 | Sim (`above`) | Sim (2 pessoas no piso 1) | SIM | Habitação de 2 pisos | Pista vertical literal; solução e divisões em ambos os pisos. |

## Registo de produção

Legenda da lista de controlo: I = implementação; V = validador; B = inspeção no navegador; C = commit; P = publicação. Uma célula `[ ]` só passa a `[x]` quando a etapa estiver concluída e verificada. Os ambientes dos casos pendentes serão definidos a partir das respetivas pistas e divisões antes da autoria.

| ID | Título | Dificuldade | Grelha | Estado da cena | Ambiente | Interior/exterior | Pisos | QA visual | SHA do commit | Lista de controlo | Notas |
|---|---|---|---:|---|---|---|---:|---|---|---|---|
| `very-easy-1` | Midnight Delivery | Very Easy | 6×6 | PROTECTED / EXISTING | Apartamento urbano | Interior | 1 | V4 aprovado | `aa384c2` (base) | n/a | Referência protegida; não redesenhar. |
| `very-easy-2` | The Empty Chair | Very Easy | 6×6 | PROTECTED / EXISTING | Casa com jardim | Interior + exterior | 1 | V4 aprovado | `aa384c2` (base) | n/a | Referência protegida; não redesenhar. |
| `very-easy-3` | A Fatal Rehearsal | Very Easy | 6×6 | IMPLEMENTED / HAND-AUTHORED | Anexo e jardim de ensaio | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `76dd586` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `very-easy-4` | Checkmate | Very Easy | 6×6 | IMPLEMENTED / HAND-AUTHORED | Cozinha de clube com jardim | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `76dd586` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `very-easy-5` | The Broken Vase | Very Easy | 6×6 | IMPLEMENTED / HAND-AUTHORED | Escritório, alpendre e pátio murado | Interior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `76dd586` | I:[x] V:[x] B:[x] C:[x] P:[x] | Sem modelo aprovado de jarra partida. |
| `very-easy-6` | The Locked Study | Very Easy | 6×6 | IMPLEMENTED / HAND-AUTHORED | Residência com pátio e alcova de estudo | Interior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `76dd586` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `very-easy-7` | The Uninvited | Very Easy | 6×6 | IMPLEMENTED / HAND-AUTHORED | Casa urbana com cozinha estreita | Interior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `76dd586` | I:[x] V:[x] B:[x] C:[x] P:[x] | Frigorífico compacto mantém a célula visível. |
| `very-easy-8` | A Cold Reception | Very Easy | 6×6 | IMPLEMENTED / HAND-AUTHORED | Sala de jantar, escritório e alpendre | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `76dd586` | I:[x] V:[x] B:[x] C:[x] P:[x] | Tapete lógico sob a mesa da sala de jantar. |
| `easy-1` | The Last Nightcap | Easy | 7×7 | PROTECTED / EXISTING | Residência | Interior | 1 | V4 aprovado | `aa384c2` (base) | n/a | Referência protegida; não redesenhar. |
| `easy-2` | Death Before Dinner | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Casa com despensa, cozinha e jardim lateral | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f64a54b` | I:[x] V:[x] B:[x] C:[x] P:[x] | O lava-loiça e a cadeira foram deslocados para mostrar as células `(3,5)` e `(5,4)`. |
| `easy-3` | The Silent Guest | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Casa de receção com quatro divisões | Interior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f64a54b` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `easy-4` | No Way Out | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Casa com corredor, jardim frontal e jardim lateral | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f64a54b` | I:[x] V:[x] B:[x] C:[x] P:[x] | Dois espaços exteriores distintos. |
| `easy-5` | The Final Curtain | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Casa com corredor, pátio central murado e alpendre | Interior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f64a54b` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `easy-6` | A Grave Mistake | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Casa em L com jardim exterior a norte | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f64a54b` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `easy-7` | The Vanishing Act | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Casa organizada em quatro zonas com pátio central | Interior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f64a54b` | I:[x] V:[x] B:[x] C:[x] P:[x] | O jardim frontal funciona como pátio da casa. |
| `easy-8` | The Missing Key | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Moradia compacta com pátio de entrada, despensa, escritório e alpendre | Interior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f292eb1` | I:[x] V:[x] B:[x] C:[x] P:[x] | Rádio Kenney V3 representa o relógio lógico; célula preservada. |
| `easy-9` | Ashes in the Study | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Casa com escritório, cozinha de serviço e jardim interior | Interior + exterior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f292eb1` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `easy-10` | The Seventh Guest | Easy | 7×7 | IMPLEMENTED / HAND-AUTHORED | Casa de convidados com pátio, cozinha e sala de jantar | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f292eb1` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `medium-1` | A Toast to Murder | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Casa de receção com escritório, sala de jantar e jardim frontal | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f292eb1` | I:[x] V:[x] B:[x] C:[x] P:[x] | Mesa e cadeiras agrupadas na sala de jantar. |
| `medium-2` | The Torn Letter | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia estreita com corredor, cozinha, sala de jantar e escritório | Interior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f292eb1` | I:[x] V:[x] B:[x] C:[x] P:[x] | Três rádios representam as três células de relógio lógico. |
| `medium-3` | Shadows in the Hall | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Galeria de entrada, salão central, alpendre e jardim | Interior + pátio + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna | `f292eb1` | I:[x] V:[x] B:[x] C:[x] P:[x] | Salão central aberto mantém o percurso legível. |
| `medium-4` | The Poisoned Pen | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de campo, galeria de jantar e jardim murado | Interior + exterior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (computador) | `466cd39` | I:[x] V:[x] B:[x] C:[x] P:[x] | Rádio Kenney V3 representa o relógio lógico na célula prevista. |
| `medium-5` | One Last Waltz | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia estreita com galeria, pátio frontal e jardim | Interior + exterior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (computador) | `466cd39` | I:[x] V:[x] B:[x] C:[x] P:[x] | Quatro rádios representam os relógios lógicos no corredor. |
| `medium-6` | The Butler’s Secret | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Residência de serviço com escritório e dois pátios | Interior + exterior + pátio | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (computador) | `466cd39` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `medium-7` | Whispers Upstairs | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Casa térrea em L com corredor, jantar e cozinha de serviço | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (computador) | `466cd39` | I:[x] V:[x] B:[x] C:[x] P:[x] | A planta térrea respeita o modelo lógico de um piso. |
| `medium-8` | The Cracked Mirror | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Bungalow com gabinete, alpendre e jardim traseiro | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (computador) | `466cd39` | I:[x] V:[x] B:[x] C:[x] P:[x] | Não existe modelo aprovado de espelho partido. |
| `medium-9` | A Debt Repaid | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia estreita com sala, alpendre e jardim lateral | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (computador) | `466cd39` | I:[x] V:[x] B:[x] C:[x] P:[x] | Rádios representam os relógios lógicos nas células previstas. |
| `medium-10` | The Second Shot | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia urbana com galeria central e cozinha de serviço | Interior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (Edge, 1600×1200) | `2cf8b5c` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `medium-11` | Nobody Left | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Casa entre um pátio verde e um jardim de chegada | Interior + pátio + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (Edge, 1600×1200) | `2cf8b5c` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `medium-12` | A Quiet Alibi | Medium | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia térrea com loggia, galeria central e escritório | Interior + exterior | 1 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (Edge, 1600×1200) | `2cf8b5c` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `hard-1` | The Wrong Coat | Hard | 8×8 | PROTECTED / EXISTING | Moradia de 2 pisos | Interior | 2 | V4 aprovado | `aa384c2` (base) | n/a | Referência protegida; não redesenhar. |
| `hard-2` | Ashes at Midnight | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com alpendre, pátio frontal e galeria exterior | Interior + exterior | 2 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (Edge, 1600×1200) | `2cf8b5c`, `14ce9e2` | I:[x] V:[x] B:[x] C:[x] P:[x] | `Front Yard` exterior; galeria aberta com guardas nas margens expostas. |
| `hard-3` | The Last Train | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com alpendre e jardim envidraçado | Interior + exterior | 2 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (Edge, 1600×1200) | `2cf8b5c` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `hard-4` | Room Without a Door | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com pátio de entrada plantado | Interior + pátio | 2 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (Edge, 1600×1200) | `2cf8b5c` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica do caso preservada. |
| `hard-5` | The Cold Kettle | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com jardim frontal e alpendre coberto apoiados | Interior + exterior | 2 | Aceite por GPT-6 Sol; revista por GPT-6 Luna; Microsoft Edge, 1600×1200 e 390×844 | `6826f06` | I:[x] V:[x] B:[x] C:[x] P:[x] | 29 células superiores sobre exterior; lógica preservada. |
| `hard-6` | A Name in Pencil | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com pátio frontal e galeria | Interior + exterior | 2 | Aceite por GPT-6 Sol; revista por GPT-6 Luna; Microsoft Edge, 1600×1200 e 390×844 | `6826f06` | I:[x] V:[x] B:[x] C:[x] P:[x] | 15 células superiores apoiadas sobre o `Front Yard`; lógica preservada. |
| `hard-7` | The Unlit Lamp | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com vestíbulo de entrada fechado | Interior | 2 | Aceite por GPT-6 Sol; revisto por GPT-6 Luna (Edge, 1600×1200 e 390×844) | `2b2f69c`, `fffc82a` | I:[x] V:[x] B:[x] C:[x] P:[x] | Lógica preservada; vistas finais em `docs/reference/sol-catalogue/hard-7-*.png`. |
| `hard-8` | Three Empty Glasses | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com jardim e pérgula estrutural | Interior + exterior | 2 | Aceite por GPT-6 Sol; revista por GPT-6 Luna; Microsoft Edge, 1600×1200 e 390×844 | `6826f06` | I:[x] V:[x] B:[x] C:[x] P:[x] | 15 células do quarto e da casa de banho sobre o `Garden`; lógica preservada. |
| `hard-9` | The Late Arrival | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com jardim frontal apoiado | Interior + exterior | 2 | Aceite por GPT-6 Sol; revista por GPT-6 Luna; Microsoft Edge, 1600×1200 e 390×844 | `6826f06` | I:[x] V:[x] B:[x] C:[x] P:[x] | 15 células do estudo e da sala sobre o `Front Yard`; lógica preservada. |
| `hard-10` | A Story Rehearsed | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com jardim e alpendre estruturais | Interior + exterior | 2 | Aceite por GPT-6 Sol; revista por GPT-6 Luna; Microsoft Edge, 1600×1200 e 390×844 | `6826f06` | I:[x] V:[x] B:[x] C:[x] P:[x] | 48 células superiores apoiadas sobre zonas exteriores; lógica preservada. |
| `hard-11` | The Missing Hour | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com escada central e galeria interior | Interior | 2 | Edge: 1600×1200 e 390×844; solução confirmada: Yuki, vítima Evangeline, Hallway | `6fc5d4c` | I:[x] V:[x] B:[x] C:[x] P:[x] | Escada central e percurso legíveis; lógica preservada. |
| `hard-12` | Nothing Was Taken | Hard | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com jardim e pérgula apoiada | Interior + exterior | 2 | Edge: 1600×1200 e 390×844; solução confirmada: Bella, vítima Evangeline, Kitchen | `6fc5d4c` | I:[x] V:[x] B:[x] C:[x] P:[x] | A pérgula deixa o jardim como espaço exterior; pilares e vigas assentam no terreno. |
| `expert-1` | The Open Window | Expert | 8×8 | IMPLEMENTED / HAND-AUTHORED | Casa de dois pisos com jardim frontal e pérgula | Interior + exterior | 2 | Edge: 1600×1200 e 390×844; solução confirmada: Nadia, vítima Alexander, Bedroom | `6fc5d4c` | I:[x] V:[x] B:[x] C:[x] P:[x] | 16 células exteriores apoiadas por três baias; o marcador sobre a planta continua visível. |
| `expert-2` | A Witness Recants | Expert | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com pátio e pérgula aberta | Interior + exterior | 2 | Edge: 1600×1200 e 390×844; solução confirmada: Dalia, vítima Marco, Bedroom | `6fc5d4c` | I:[x] V:[x] B:[x] C:[x] P:[x] | 24 células de jardim recebem apoio explícito; relvado e plantas continuam exteriores. |
| `expert-3` | The Locked Pantry | Expert | 8×8 | IMPLEMENTED / HAND-AUTHORED | Moradia de dois pisos com pérgula compacta no jardim | Interior + exterior | 2 | Edge: 1600×1200 e 390×844; solução confirmada: Marco, vítima Carol, Garden | `6fc5d4c` | I:[x] V:[x] B:[x] C:[x] P:[x] | 12 células superiores sobre exterior apoiadas; marcadores e pistas permanecem visíveis. |
| `expert-4` | Dust on the Sill | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-5` | The Borrowed Knife | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-6` | A Clock Stopped | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-7` | The Second Study | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-8` | No One Heard | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-9` | The Spare Key | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-10` | A Quiet Confession | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `master-1` | The Torn Ledger | Master | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `master-2` | Shadows at the Door | Master | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `master-3` | The Last Guest | Master | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `master-4` | A Debt Unsettled | Master | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `master-5` | The Silent Kitchen | Master | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `master-6` | Two Sets of Prints | Master | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `master-7` | The Final Alibi | Master | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `master-8` | Nobody Was Home | Master | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |

**Cenas procedimentais ainda ativas: 15.**
