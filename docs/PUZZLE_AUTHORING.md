# Guia de autoria de casos

Este documento define o contrato editorial e lógico para criar casos Murdoku. O objetivo é permitir que o Opus produza conteúdo novo sem alterar o motor, o solucionador, o gerador ou as regras fundamentais.

O relatório de referência encontra-se em `docs/reports/puzzle-catalog.json`. O comando `npm run report:puzzles` volta a medi-lo a partir do catálogo real. O ficheiro é determinístico: se o catálogo não mudar, a diferença deve ficar vazia.

## Regra de publicação

Um caso só pode seguir para produção quando cumprir todos os pontos seguintes:

1. `validatePuzzleForProduction` não devolve erros;
2. existe exatamente uma solução derivável das pistas apresentadas ao jogador;
3. o assassino calculado pelo motor coincide com `murdererId`;
4. todas as referências a pessoas, divisões, mobiliário e pisos existem;
5. a cena consegue representar todo o mobiliário lógico;
6. as advertências de qualidade foram revistas por uma pessoa ou agente responsável;
7. a pré-validação, os testes e a análise visual passaram.

Não se deve enfraquecer um validador para aprovar um caso existente. Deve corrigir-se a causa no gerador, nos dados ou no motor. Se a regra de produto não for inequívoca, deve registar-se a dúvida e parar.

## Erros e advertências

Os erros são bloqueios objetivos: estrutura inválida, solução inexistente ou múltipla, contradição, referência desconhecida, semântica de piso inválida ou representação visual impossível.

As advertências exigem juízo editorial. Incluem pistas redundantes, revelação demasiado direta, desalinhamento com o perfil de dificuldade, nome de divisão fora do vocabulário e falta de espaço provável para escadas. Uma advertência não deve ser tratada como verdade estética automática.

Qualquer erro novo do catálogo deve receber uma destas classificações antes de se alterar código:

1. erro real do motor de jogo;
2. erro real de um caso gerado ou escrito à mão;
3. falso positivo do validador;
4. regra de produto ambígua que exige decisão.

O relatório mantém cada erro sem classificação como `UNCLASSIFIED`; a pré-validação deve falhar enquanto existir um.

## Modelo de dificuldade

Murdoku não usa uma pontuação única de dificuldade. Os níveis são perfis multidimensionais observados, não limiares matemáticos absolutos. Uma contagem isolada não basta para promover ou despromover um caso.

As métricas têm estas leituras:

- `startingCandidateEntropy`: dispersão média dos candidatos após as pistas unárias, em bits; um valor maior indica mais possibilidades iniciais;
- `forcedAtStart`: pessoas com uma única célula legal antes de qualquer colocação;
- `forcedBySingles`: pessoas resolvidas pela propagação repetida de candidatos únicos e exclusão de linhas e colunas;
- `propagationRounds`: passagens determinísticas necessárias até essa propagação parar;
- `needsSearch`: pessoas que permanecem por resolver nesse modelo simples; significa que é necessária lógica relacional ou procura, não que o jogador tenha de adivinhar;
- `relationalClues`: pistas entre pessoas;
- `crossFloorClues`: pistas de piso, acima ou abaixo;
- `redundantClues`: pistas removíveis sem perder unicidade, desde que a pessoa mantenha outra pista;
- `meanDirectness`: média da escala ordinal usada pelo gerador; serve para comparação interna;
- `meanCandidates`: média de células permitidas pelas pistas unárias.

Estas métricas não medem, por si só, elegância, clareza da redação, satisfação da cadeia dedutiva ou legibilidade visual.

## Perfil observado em 02/09/2026

Os intervalos seguintes provêm dos 60 casos publicados no relatório. São referências de revisão, não metas para ajustar artificialmente.

| Nível | Pessoas | Pistas | Entropia inicial | Resolvidas por candidatos únicos | Por resolver | Pistas relacionais | Pistas entre pisos |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Very Easy | 4 | 5–7 | 0,2500–1,5425 | 2–4 | 0–2 | 0 | 0 |
| Easy | 4 | 4–8 | 0,2500–1,0000 | 0–4 | 0–4 | 0 | 0 |
| Medium | 5 | 6–9 | 0,4000–1,5814 | 0–5 | 0–5 | 0–1 | 0 |
| Hard | 5 | 6–11 | 0,4000–1,8458 | 0–5 | 0–5 | 0–1 | 0–2 |
| Expert | 6 | 9–11 | 0,9153–1,8023 | 0–6 | 0–6 | 0 | 0–3 |
| Master | 6 | 9–13 | 0,5000–1,6258 | 1–6 | 0–5 | 0–1 | 0–3 |

O catálogo atual tem zero erros rígidos. Tem 20 advertências em 19 casos: três pistas colocam diretamente um suspeito na divisão da vítima, quinze casos têm uma pista redundante e um caso gera duas advertências de perfil de dificuldade. Estas advertências formam uma lista editorial conhecida; não foram ocultadas nem convertidas em erros sem uma decisão de produto.

## Processo para criar um caso

1. Escolher o nível, o tamanho, o número de pessoas e o número de pisos a partir de um perfil observado.
2. Escrever a solução completa antes das pistas.
3. Confirmar linhas e colunas únicas em todos os pisos.
4. Garantir que apenas o assassino partilha a divisão da vítima.
5. Criar pistas verdadeiras para essa solução. Uma pista entre pisos deve usar uma relação suportada pelo motor.
6. Provar unicidade com o solucionador.
7. Executar o validador de produção e rever todas as advertências.
8. Comparar as métricas com vários casos do mesmo nível. Não ajustar para uma única média.
9. Construir a cena segundo `docs/ISOMETRIC_SCENE_SYSTEM.md`.
10. Executar `npm run validate:production`, os testes relevantes e a verificação no navegador.
11. Rever a diferença, criar um commit descritivo e publicar apenas no ramo de produção autorizado.

## Quando parar

O autor deve parar e pedir uma decisão quando precisar de:

- criar um novo tipo de pista;
- alterar a exclusividade global de linhas ou colunas;
- mudar a definição de assassino;
- aumentar o número de pisos suportados;
- acrescentar escala ou deslocamentos arbitrários à cena;
- ignorar um erro do validador;
- modificar o solucionador apenas para aprovar o caso em curso;
- usar uma relação física entre pisos que o validador de escadas não consegue provar.

Nestes casos, o trabalho deixou de ser produção de conteúdo e passou a ser alteração de arquitetura.
