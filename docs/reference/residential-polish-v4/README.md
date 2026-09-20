# Referência visual residencial V4

Capturas de referência do resultado V3, recolhidas em 19/09/2026 antes das
alterações de polimento arquitetónico, a partir do SHA V3
`1e78316f024c60bac98239ed0104c1f44b4d43bf`. As capturas posteriores foram
repetidas em 20/09/2026, no ramo `astra/residential-architectural-polish-v4`,
sobre `c21adf7` com a correção das portas ainda por guardar num commit.
A geometria estava congelada, incluindo a transmissão de `cut.head` ao
resolvedor do aro. As imagens foram capturadas no
Chromium real através do endereço `http://127.0.0.1:5173/?env=1&case=hard-1`,
com janela de conteúdo de 1440 × 1100 e DPR 1.

## Enquadramento

Na cena residencial V3, o *canvas* ocupa `x=161`, `y=345`, `697,984 × 629,984`
px. Os recortes abaixo usam coordenadas relativas ao *canvas*, para que as
capturas AFTER mantenham exatamente o mesmo enquadramento:

| Zona | Recorte relativo ao *canvas* |
| --- | --- |
| Porta do quarto | `x=185`, `y=110`, `160 × 165` px |
| Porta da casa de banho | `x=0`, `y=180`, `260 × 250` px |
| Escritório/estudo | `x=410`, `y=125`, `285 × 255` px |
| Porta da leitura | `x=300`, `y=260`, `240 × 220` px |
| Escada e patamar | `x=300`, `y=180`, `300 × 250` px |

As capturas AFTER foram recolhidas no mesmo endereço, viewport e coordenadas,
depois das alterações de geometria das portas feitas a seguir ao commit
`c21adf7`. A captura final inclui a passagem de `cut.head` para o cálculo da
guarnição. Na altura da captura, as alterações ainda estavam na árvore de
trabalho e incluíam `src/scene3d/doorGeometry.ts`, `resolve.ts`, `renderer.ts`,
`schema.ts` e `tests/doorGeometry.test.ts`.

## Baseline V3

| Vista | Imagem |
| --- | --- |
| Piso superior completo, página | [Página](v3-before-upper-page-1440x1100.png) |
| Piso superior, apenas *canvas* | [Piso superior](v3-before-upper-canvas.png) |
| Porta do quarto | [Quarto](v3-before-bedroom-door.png) |
| Porta da casa de banho | [Casa de banho](v3-before-bathroom-door.png) |
| Escritório/estudo | [Escritório](v3-before-office.png) |
| Escada e patamar | [Patamar](v3-before-stair-landing.png) |
| Rés-do-chão com contexto superior fantasma, página | [Página fantasma](v3-before-ground-upper-ghost-page-1440x1100.png) |
| Rés-do-chão com contexto superior fantasma, *canvas* | [Canvas fantasma](v3-before-ground-upper-ghost-canvas.png) |

## Portas após a correção

As quatro entradas superiores ficam cobertas pelas mesmas guarnições
procedurais: quarto, casa de banho, escritório/estudo e leitura. A imagem da
leitura usa o recorte adicional `x=300`, `y=260`, `240 × 220` px.

| Vista | Imagem |
| --- | --- |
| Piso superior completo, página | [Página](v4-after-upper-page-1440x1100.png) |
| Piso superior, apenas *canvas* | [Piso superior](v4-after-upper-canvas.png) |
| Porta do quarto | [Quarto](v4-after-bedroom-door.png) |
| Porta da casa de banho | [Casa de banho](v4-after-bathroom-door.png) |
| Porta do escritório/estudo | [Escritório](v4-after-office-door.png) |
| Porta da leitura | [Leitura](v4-after-reading-door.png) |
| Escada e patamar | [Patamar](v4-after-stair-landing.png) |
| Rés-do-chão com contexto superior fantasma, página | [Página fantasma](v4-after-ground-upper-ghost-page-1440x1100.png) |
| Rés-do-chão com contexto superior fantasma, *canvas* | [Canvas fantasma](v4-after-ground-upper-ghost-canvas.png) |

As três cenas douradas foram repetidas depois da alteração partilhada das
portas. Os casos continuam a ser cenas de um só piso.

| Caso | Imagem |
| --- | --- |
| `very-easy-1` | [AFTER](v4-after-golden-very-easy-1.png) |
| `very-easy-2` | [AFTER](v4-after-golden-very-easy-2.png) |
| `easy-1` | [AFTER](v4-after-golden-easy-1.png) |

## Cenas douradas V3

Estas três capturas preservam os *canvas* das cenas de regressão indicadas. Os
casos `very-easy-1`, `very-easy-2` e `easy-1` são cenas de um só piso e, por
isso, não têm o controlo «Upstairs».

| Caso | Imagem |
| --- | --- |
| `very-easy-1` | [Referência](v3-before-golden-very-easy-1.png) |
| `very-easy-2` | [Referência](v3-before-golden-very-easy-2.png) |
| `easy-1` | [Referência](v3-before-golden-easy-1.png) |
