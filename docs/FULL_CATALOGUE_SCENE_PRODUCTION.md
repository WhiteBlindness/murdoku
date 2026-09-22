# Produção das cenas do catálogo completo

Ramo autorizado para esta missão: `sol/full-catalogue-scene-production-v1`.
Este nome constitui uma exceção expressa do proprietário à convenção histórica `opus/*`.
Referência de origem: `aa384c2f69ab6168786abccf04f713ad3ae24a58`.

Inventário inicial: 60 casos, 4 cenas protegidas e 56 cenas por produzir.

## Auditoria da dependência entre pisos

A contagem de pisos não foi inferida da dificuldade. Foram construídos os 60 casos a partir da versão determinística do catálogo e inspecionadas as pistas, a solução, as divisões e o mobiliário. Nos 30 casos atualmente com dois pisos, a solução coloca pessoas nos dois. Cada um contém também quatro divisões e 9 a 19 peças lógicas no piso superior. Retirar esse piso, mesmo nos seis casos sem uma pista vertical literal, altera o espaço de posições, a identidade das divisões e a solução matemática. Por isso, os 29 casos por produzir deste grupo exigem arquitetura de dois pisos se a lógica permanecer intacta.

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
| `very-easy-3` | A Fatal Rehearsal | Very Easy | 6×6 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `very-easy-4` | Checkmate | Very Easy | 6×6 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `very-easy-5` | The Broken Vase | Very Easy | 6×6 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `very-easy-6` | The Locked Study | Very Easy | 6×6 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `very-easy-7` | The Uninvited | Very Easy | 6×6 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `very-easy-8` | A Cold Reception | Very Easy | 6×6 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-1` | The Last Nightcap | Easy | 7×7 | PROTECTED / EXISTING | Residência | Interior | 1 | V4 aprovado | `aa384c2` (base) | n/a | Referência protegida; não redesenhar. |
| `easy-2` | Death Before Dinner | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-3` | The Silent Guest | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-4` | No Way Out | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-5` | The Final Curtain | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-6` | A Grave Mistake | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-7` | The Vanishing Act | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-8` | The Missing Key | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-9` | Ashes in the Study | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `easy-10` | The Seventh Guest | Easy | 7×7 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-1` | A Toast to Murder | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-2` | The Torn Letter | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-3` | Shadows in the Hall | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-4` | The Poisoned Pen | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-5` | One Last Waltz | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-6` | The Butler’s Secret | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-7` | Whispers Upstairs | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-8` | The Cracked Mirror | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-9` | A Debt Repaid | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-10` | The Second Shot | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-11` | Nobody Left | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `medium-12` | A Quiet Alibi | Medium | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 1 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-1` | The Wrong Coat | Hard | 8×8 | PROTECTED / EXISTING | Moradia de 2 pisos | Interior | 2 | V4 aprovado | `aa384c2` (base) | n/a | Referência protegida; não redesenhar. |
| `hard-2` | Ashes at Midnight | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-3` | The Last Train | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
| `hard-4` | Room Without a Door | Hard | 8×8 | PENDING / FALLBACK | Por definir | Por decidir | 2 | Pendente | - | I:[ ] V:[ ] B:[ ] C:[ ] P:[ ] | Autoria, validação e inspeção visual por fazer. |
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

**Cenas procedimentais ainda ativas: 56.**
