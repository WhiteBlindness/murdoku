# Dois pisos e escadas — decisão implementada

Estado confirmado em 07/09/2026: a solução descrita neste documento está implementada no caso de referência `hard-1`. Uma relação lógica entre linhas ou colunas pode associar posições correspondentes entre pisos através das pistas `above`, `below` e `floor` e do bloqueio cruzado em `useGame`. A apresentação torna essa associação simultaneamente visível e não interfere com a interação.

## 1. Recursos

### Furniture Kit, já presente no projeto

O pacote fornece quatro escadas medidas a partir da geometria em `catalog.generated.ts`:

| Modelo | Dimensões l × a × p, em unidades Kenney | Notas |
| --- | --- | --- |
| `stairs` | 1,82 × 1,34 × 0,79 | lanço reto, laterais fechadas |
| `stairsOpen` | 1,82 × 1,34 × 0,79 | lanço reto, degraus abertos |
| `stairsOpenSingle` | 1,82 × 1,34 × 0,79 | lanço aberto, uma longarina |
| `stairsCorner` | 1,77 × 1,34 × 1,43 | patamar com quarto de volta |

Facto principal: **a subida de 1,34 aproxima-se da parede de 1,29**. Um lanço reto sobe um piso. Ocupa 1,82 × 0,79 unidades, ou seja, 2,3 × 1,0 células com `CELL = 0.8`; a escada de canto ocupa 2,2 × 1,8 células. Esta pegada é grande numa grelha de 6 × 6 e adequada à grelha de 8 × 8 do piloto.

O pacote também fornece `floorFull` (1 × 0,05) para a laje superior e os modelos `wall`, `wallHalf`, `wallCorner`, `wallWindow`, `wallDoorway` e `paneling` para o envelope.

### Building Kit e Modular Buildings

Estes pacotes destinam-se a arquitetura exterior. Fornecem paredes, telhados, janelas, portas, escadas e alpendres numa escala própria. Podem vir a fornecer telhados, varandas e escadas exteriores, mas não são necessários para os pisos interiores: a Furniture Kit já cobre escada, laje e envelope.

A medição recuperada mostrou que a Building Kit usa paredes de 2,40 unidades e a Modular Buildings usa módulos de piso com cerca de 0,60. Por isso, ambas exigem um adaptador de envelope e não podem ser misturadas diretamente com a parede interior de 1,29. A decisão completa consta de `docs/KENNEY_PACK_SURVEY.md`.

## 2. Geometria implementada

- A distância entre pisos é `STOREY_HEIGHT = WALL_HEIGHT + FLOOR_THICKNESS`.
- Cada piso possui uma `SceneSpec` própria, com `floor: 0 | 1`, resolvida e validada contra a topologia e o mobiliário lógico desse piso.
- O rés-do-chão declara `stairs`; o piso superior declara um `stairwell` coincidente.
- O resolvedor retira a laje na abertura, coloca a escada à altura física e reserva as respetivas células.
- O validador confirma a correspondência entre a escada e o vão, a subida, os limites, os patamares livres e a inexistência de laje na abertura.

## 3. Apresentação escolhida

| Opção | Resultado | Decisão |
| --- | --- | --- |
| **Casa empilhada** | o piso superior oculta o rés-do-chão | rejeitada |
| **Pisos explodidos** | mostra os dois pisos com distância adicional | implementada como panorama opcional |
| **Piso ativo e contexto fantasma** | preserva a leitura do piso ativo e mostra a estrutura do outro | implementada como vista predefinida |
| **Transição de câmara** | depende da memória do movimento e não mostra a relação simultânea | rejeitada |

Na vista predefinida, o piso ativo mantém opacidade e interação completas. O outro surge à altura real, com laje e paredes translúcidas, sem mobiliário. O contexto fantasma não possui polígonos de interação. O realce de uma célula inclui a posição correspondente no outro piso e os bloqueios de linhas e colunas.

O botão de panorama ativa a vista explodida. A câmara não muda e não existe animação obrigatória, por isso o comportamento respeita a redução de movimento. Os botões de piso trocam os papéis ativo e fantasma.

## 4. Decisões de produto

1. O contexto fantasma mostra apenas a estrutura, a escada e o vão; o mobiliário fantasma foi excluído para reduzir ruído.
2. O panorama explodido existe como modo opcional, incluindo em ecrãs estreitos.
3. A escada continua a ser circulação física, não um tipo de mobiliário ou alvo de pista.
4. `hard-1` é o caso de referência obrigatório para regressão visual, interação entre pisos e validação física.
