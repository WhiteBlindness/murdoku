# Evidência visual da expansão Kenney V3

Estas imagens foram capturadas no navegador em 26/09/2026. O coordenador reviu pessoalmente os três pilotos. Os ficheiros com «first» ou «review» no nome documentam versões intermédias; os ficheiros indicados nas tabelas são a evidência final.

O relatório [Expansão dos ambientes Kenney V3](../../KENNEY_ENVIRONMENT_EXPANSION_V3.md) descreve as cenas, os recursos, os limites de pistas e o estado de cada validação.

## Café

O café foi aprovado como candidato condicional. Os adereços Food Kit continuam pequenos em telemóvel.

| Estado | Vista do tabuleiro | Detalhe |
| --- | --- | --- |
| Repouso | [cafe-final-idle-desktop.png](cafe-final-idle-desktop.png) | [cafe-idle-desktop-closeup.png](cafe-idle-desktop-closeup.png) |
| Célula selecionada | [cafe-selected-desktop.png](cafe-selected-desktop.png) | A seleção também mostra a linha e a coluna. |
| Pessoa colocada | [cafe-person-placed-desktop.png](cafe-person-placed-desktop.png) | [cafe-person-placed-desktop-closeup.png](cafe-person-placed-desktop-closeup.png) |
| Conflito | [cafe-conflict-desktop.png](cafe-conflict-desktop.png) | [cafe-conflict-desktop-closeup.png](cafe-conflict-desktop-closeup.png) |
| Localizador de pistas | [cafe-clue-locator-desktop.png](cafe-clue-locator-desktop.png) | [cafe-clue-locator-desktop-closeup.png](cafe-clue-locator-desktop-closeup.png) |
| Dica | [cafe-hint-desktop.png](cafe-hint-desktop.png) | [cafe-hint-desktop-closeup.png](cafe-hint-desktop-closeup.png) |
| Sobreposição de linha/coluna | [cafe-row-column-overlay-desktop.png](cafe-row-column-overlay-desktop.png) | [cafe-row-column-overlay-desktop-closeup.png](cafe-row-column-overlay-desktop-closeup.png) |
| Dica em telemóvel | [cafe-hint-mobile.png](cafe-hint-mobile.png) | [cafe-hint-mobile-closeup.png](cafe-hint-mobile-closeup.png) |

As imagens de seleção e de linha/coluna têm conteúdo idêntico porque a seleção ativa essa sobreposição. [Vista móvel em repouso](cafe-idle-mobile.png), [pessoa colocada](cafe-person-placed-mobile.png), [conflito](cafe-conflict-mobile.png), [localizador](cafe-clue-locator-mobile.png) e [dica](cafe-hint-mobile.png) completam a amostra móvel.

## Cemitério

O jazigo final usa escala 0,90×. A série mostra pessoas, conflitos e pistas com o monumento na posição validada.

| Estado | Captura |
| --- | --- |
| Repouso | [cemetery-idle-final.png](cemetery-idle-final.png) e [detalhe](cemetery-idle-detail.png) |
| Célula selecionada e pessoa colocada | [cemetery-placed-final.png](cemetery-placed-final.png) |
| Conflito | [cemetery-conflict-final.png](cemetery-conflict-final.png) |
| Localizador de pistas | [cemetery-clue-final.png](cemetery-clue-final.png) |
| Dica | [cemetery-hint-final.png](cemetery-hint-final.png) |
| Linha e coluna | [cemetery-row-column-final.png](cemetery-row-column-final.png) |

## Loja de bairro

| Estado | Captura geral | Detalhe |
| --- | --- | --- |
| Repouso | [final-shop-idle-desktop.png](final-shop-idle-desktop.png) | [detalhe](final-shop-idle-desktop-closeup.png) |
| Célula selecionada e linha/coluna | [final-shop-selected-row-column-overlay-desktop.png](final-shop-selected-row-column-overlay-desktop.png) | [detalhe](final-shop-selected-row-column-overlay-desktop-closeup.png) |
| Pessoa colocada | [final-shop-person-placed-desktop.png](final-shop-person-placed-desktop.png) | [detalhe](final-shop-person-placed-desktop-closeup.png) |
| Conflito | [final-shop-conflict-desktop.png](final-shop-conflict-desktop.png) | [detalhe](final-shop-conflict-desktop-closeup.png) |
| Localizador de pistas | [final-shop-clue-locator-desktop.png](final-shop-clue-locator-desktop.png) | [detalhe](final-shop-clue-locator-desktop-closeup.png) |
| Dica | [final-shop-hint-desktop.png](final-shop-hint-desktop.png) | [detalhe](final-shop-hint-desktop-closeup.png) |

Há também [repouso](shop-idle-mobile.png), [pessoa colocada](shop-person-placed-mobile.png), [conflito](shop-conflict-mobile.png), [localizador](shop-clue-locator-mobile.png), [dica](shop-hint-mobile.png) e [linha/coluna](shop-row-column-overlay-mobile.png) em telemóvel.

## Regressão

As duas imagens seguintes comparam Midnight Delivery antes e depois da integração. Os restantes casos protegidos foram abrangidos pelos validadores de produção, sem alterações aos seus ficheiros.

| Antes | Depois |
| --- | --- |
| [regression-midnight-before.png](regression-midnight-before.png) | [regression-midnight-after.png](regression-midnight-after.png) |

## Limites desta evidência

- As capturas mostram pilotos jogáveis de desenvolvimento, ainda sem casos oficiais.
- O cemitério foi inspecionado em computador; a amostra móvel cobre a loja e o café.
- As imagens complementam os testes de geometria, recursos e regressão; não os substituem.
