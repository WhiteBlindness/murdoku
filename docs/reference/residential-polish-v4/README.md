# Referência visual residencial V4

Capturas de referência do resultado V3, recolhidas em 19/09/2026 antes das
alterações de polimento arquitetónico. A aplicação foi executada a partir do
ramo `astra/residential-architectural-polish-v4`, ainda no SHA V3
`1e78316f024c60bac98239ed0104c1f44b4d43bf`. As imagens foram capturadas no
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
| Escada e patamar | `x=300`, `y=180`, `300 × 250` px |

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

## Cenas de referência douradas

Estas três capturas preservam os *canvas* das cenas de regressão indicadas. Os
casos `very-easy-1`, `very-easy-2` e `easy-1` são cenas de um só piso e, por
isso, não têm o controlo «Upstairs».

| Caso | Imagem |
| --- | --- |
| `very-easy-1` | [Referência](v3-before-golden-very-easy-1.png) |
| `very-easy-2` | [Referência](v3-before-golden-very-easy-2.png) |
| `easy-1` | [Referência](v3-before-golden-easy-1.png) |
