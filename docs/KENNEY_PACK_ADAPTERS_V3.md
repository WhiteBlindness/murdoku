# Adaptadores dos pacotes Kenney V3

Este lote incorpora dez modelos já medidos no laboratório V2. O adaptador copia apenas estes GLBs e as respetivas texturas para `public/kenney3d/`. A transformação de escala fica no nó raiz do GLB; o `SceneSpec` continua a usar o tamanho físico do catálogo. O renderizador mantém o pivô existente, que centra a pegada e assenta os pés em `y = 0`.

| Origem medida | Modelo de produção | Escala incorporada | Dimensões medidas [x, y, z] |
| --- | --- | ---: | ---: |
| `graveyard-kit--crypt-small` | `graveyard_cryptSmall` | 1,00 | [1,350; 1,000; 1,400] |
| `graveyard-kit--grave` | `graveyard_grave` | 1,00 | [0,724; 0,114; 1,241] |
| `graveyard-kit--gravestone-cross` | `graveyard_gravestoneCross` | 1,00 | [0,450; 0,915; 0,330] |
| `mini-market--shelf-boxes` | `miniMarket_shelfBoxes` | 1,00 | [0,800; 0,850; 0,700] |
| `mini-market--freezer` | `miniMarket_freezer` | 1,00 | [0,800; 0,350; 0,600] |
| `mini-market--cash-register` | `miniMarket_cashRegister` | 0,50 | [0,425; 0,297; 0,425] |
| `food-kit--cake` | `food_cake` | 0,30 | [0,192; 0,082; 0,192] |
| `food-kit--plate-dinner` | `food_plateDinner` | 0,30 | [0,268; 0,066; 0,268] |
| `food-kit--cup-coffee` | `food_cupCoffee` | 0,30 | [0,065; 0,042; 0,086] |
| `food-kit--glass-wine` | `food_glassWine` | 0,30 | [0,068; 0,150; 0,059] |

As dez medições mantêm `min[1] = 0`. Os modelos de comida usam `support: 'surface'` e aceitam superfícies `table` ou `counter`. A caixa registadora também usa `support: 'surface'`, com `counter` como requisito. Os restantes modelos ficam como objetos de pavimento sem associação a mobiliário lógico.

O conversor preserva as texturas e os parâmetros de `KHR_texture_transform`. Também mantém o canal alfa, a opacidade e o modo de faces. A conversão para Lambert é exclusiva dos nomes declarados em `PACK_ADAPTERS`; os modelos de Furniture e Nature continuam no ramo legado do renderizador.

## decisão de sistema

**SYSTEM ESCALATION, autorizada no lote V3.** O manual de produção reserva `renderer.ts` para alterações fundamentais do sistema. A conversão existente reconstrói materiais sem conservar os mapas de textura, e o esquema não admite escala por objeto. A autorização V3 permite uma extensão delimitada para estes pacotes medidos.

- **Regra bloqueada:** os mapas e as transformações UV dos novos modelos não chegam ao ecrã através do conversor legado. A escala de produção também não pode ser expressa em `FurnitureSpec`.
- **Prova:** os dez registos no relatório V2 identificam texturas externas de cor base; todos declaram `KHR_texture_transform`, e todos têm contacto medido com o pavimento.
- **Ficheiros fundamentais afetados:** `renderer.ts` ganha apenas uma chamada condicional para os nomes em `PACK_ADAPTERS`; `packAdapters.ts` converte esses materiais. O esquema, o solucionador, os validadores e a conversão legada não mudam.
- **Alternativas dentro do sistema:** não adaptar estes modelos ou perder as texturas no conversor atual. Para a escala, a alternativa seria acrescentar escala por objeto ao esquema, resolução, validação e renderização.
- **Decisão:** aplicar as escalas na raiz dos GLBs durante a adaptação e conservar a conversão legada para todos os outros modelos. Uma futura alteração fora deste âmbito exige nova autorização de sistema.

Para regenerar os ficheiros, executa `node scripts/kenney-pack-adapt.mjs`. O script confirma que cada fonte pertence ao conjunto selecionado e medido no relatório V2, copia as texturas referenciadas, gera `catalog.generated.ts` e compara as dimensões finais com as medições de origem e as escalas declaradas.
