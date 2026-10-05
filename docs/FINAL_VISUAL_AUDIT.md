# Auditoria visual final do catálogo

Data: 05/10/2026. Parecer visual: **PASS**.

O catálogo contém 60 casos com cenas 3D escritas à mão, correspondentes a 90 pisos. Não há cenas procedimentais no catálogo. As pistas, soluções, vítimas e culpados mantêm-se intactos.

## Âmbito e método

Revisão independente com GPT-6.1 Sol High, através de capturas novas e sessões interativas em Chromium. O primeiro passe cobriu os 60 casos em seis lotes de cerca de dez, antes das correções e sem consultar pareceres visuais anteriores.

Cada caso foi inspecionado em computador a 1 600 × 1 200, em telemóvel a 390 × 844 e com as posições da solução colocadas. Nos 30 casos com dois pisos, foram também inspecionados o piso superior, o panorama explodido e o contexto fantasma normal. A revisão incluiu arquitetura, apoio físico, escala, composição, leitura das pistas, oclusão, seleção de células e consistência entre níveis.

Além da inspeção visual, as 60 soluções foram introduzidas e aceites com rato e com toque. A confirmação posterior verificou a pré-visualização nos 30 casos com dois pisos, a cena corrigida e uma amostra de quatro cenas sem alterações.

## Cobertura e provas

| Nível do catálogo | Casos | Capturas iniciais | Capturas posteriores |
| --- | ---: | ---: | ---: |
| Very Easy | 8 | 32 | 9 |
| Easy | 10 | 40 | 2 |
| Medium | 12 | 48 | 2 |
| Hard | 12 | 108 | 25 |
| Expert | 10 | 90 | 14 |
| Master | 8 | 72 | 14 |
| Total | 60 | 390 | 66 |

As **456 capturas** incluem 353 vistas de computador e 103 de telemóvel: 130 vistas normais, 92 vistas da solução, 90 vistas adicionais de pisos ou panorama explodido e 144 vistas de interação com pistas. As 66 provas posteriores incluem 16 interações independentes do revisor.

## Achados e correções

| Gravidade | Primeiro passe | Por resolver |
| --- | ---: | ---: |
| BLOCKER | 0 | 0 |
| MAJOR | 1 | 0 |
| MINOR | 1 | 0 |
| POLISH | 2 | 2 opcionais |

Os dois achados obrigatórios tinham confiança elevada e foram explicitamente aceites após a correção.

- **MUR-VIS-VE08-001, Very Easy 8:** o tapete circular deixava a posição correta de Marco visualmente fora do tapete. Um tapete retangular existente, centrado na mesma área lógica e com as dimensões nativas, cobre agora os centros das quatro células. A solução e a pista foram preservadas.
- **MUR-VIS-UI-001, pré-visualização entre pisos:** a interface podia destacar alvos no piso errado ou não mostrar um objeto situado apenas no outro piso. A pré-visualização seleciona agora o piso indicado pelas pistas, pela divisão ou pelo conjunto de candidatos de mobiliário quando existe num único piso. Suprime destaques num piso incompatível. Quando há candidatos nos dois pisos, mantém o piso selecionado. Nunca consulta a solução nem coloca uma pessoa.

O arquivo inclui exemplos anteriores e posteriores de Very Easy 8 e das pistas de Hard 1, Hard 2 e Hard 4, com nomes determinísticos associados aos achados no manifesto.

## Telemóvel, estrutura e oclusão

A inspeção a 390 × 844 e as 60 soluções introduzidas por toque não revelaram transbordo horizontal nem posições corretas impossíveis de selecionar. A cena corrigida e seis casos com dois pisos têm provas posteriores adicionais em telemóvel.

As ligações entre pisos, escadas, patamares, aberturas e apoios exteriores foram inspecionados nos 30 casos aplicáveis. O sistema partilhado de apoios exteriores, incluindo `exteriorSupportBays`, mantém a estrutura legível. Não foi identificado qualquer problema estrutural ou oclusão grave por resolver.

A linguagem Kenney, a escala e os materiais mantêm-se coerentes nos seis níveis. Permanecem duas sugestões de acabamento: reduzir áreas vazias e repetição em algumas cenas iniciais; equilibrar o peso visual das vigas em alguns exteriores com dois pisos. São melhorias opcionais de composição.

## Validação final

| Controlo | Resultado |
| --- | --- |
| Testes completos | 43 ficheiros; 554 aprovados, 5 ignorados, 559 no total |
| `npm run validate:production` | 7/7 |
| `npm run verify` | 64/64 |
| `npm run lint` | Aprovado |
| `npm run build` | Aprovado |
| `node scripts/measure-puzzles.mjs --check` | 60 casos, relatório atual |
| `npm run report:puzzles` | 60 casos |
| `npm run test:coverage` | 91,66% de instruções; 84,94% de ramos; 95,90% de linhas |

A cobertura corresponde ao conjunto de ficheiros configurado em `vitest.config.ts`. Foram acrescentados oito testes de regressão para a seleção de piso, a independência da colocação de pessoas e a cobertura visual do tapete.

O módulo do renderizador mantém 610,67 kB minimizados e 155,27 kB comprimidos. O módulo principal passou de 104,46 para 104,71 kB comprimidos. Não foram observadas regressões nas interações verificadas; estes valores não constituem uma medição de desempenho em dispositivos físicos.

A análise de dependências de execução indica zero vulnerabilidades. A análise completa identifica dez avisos nas ferramentas de desenvolvimento do ficheiro de dependências existente: seis de gravidade elevada e quatro moderada. A atualização dessas ferramentas exige uma intervenção própria, incluindo a compatibilidade do Tailwind e do Vitest.

## Aceitação e arquivo externo

O revisor aceitou explicitamente as duas correções, a amostra sem alterações e a consistência global. Não há achados BLOCKER, MAJOR ou MINOR por resolver. O catálogo passa a auditoria visual de computador e telemóvel.

As provas completas, a matriz de achados, o manifesto pesquisável e os pareceres estão no arquivo privado **Murdoku / Visual Audits / 2026-10-05 - Final Catalogue Audit**, organizado pelos seis níveis e por exemplos anteriores e posteriores. O Notion serve de índice. O arquivo de imagens, os caminhos locais e os endereços privados não fazem parte deste repositório.
