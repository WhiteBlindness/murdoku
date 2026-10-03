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

## Auditoria da dependência entre pisos

A contagem de pisos não foi inferida da dificuldade. Foram construídos os 60 casos a partir da versão determinística do catálogo e inspecionadas as pistas, a solução, as divisões e o mobiliário. Nos 30 casos atualmente com dois pisos, a solução coloca pessoas nos dois. Cada um contém também quatro divisões e 9 a 19 peças lógicas no piso superior. Retirar esse piso, mesmo nos seis casos sem uma pista vertical literal, altera o espaço de posições, a identidade das divisões e a solução matemática. Por isso, os 26 casos ainda por produzir deste grupo exigem arquitetura de dois pisos se a lógica permanecer intacta.

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
| `hard-5` | The Cold Kettle | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-6` | A Name in Pencil | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-7` | The Unlit Lamp | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-8` | Three Empty Glasses | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-9` | The Late Arrival | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-10` | A Story Rehearsed | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-11` | The Missing Hour | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-12` | Nothing Was Taken | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-1` | The Open Window | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-2` | A Witness Recants | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `expert-3` | The Locked Pantry | Expert | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
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

**Cenas procedimentais ainda ativas: 26.**
