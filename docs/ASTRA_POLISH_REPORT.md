# Revisão Astra antes da produção

Data: 08/09/2026. Base: `sol/isometric-system-hardening`, commit `2d1ec76`.
Ramo autorizado: `astra/two-storey-and-interaction-polish`.

## SYSTEM ESCALATION — direção física da escada

A geometria medida de `stairsOpen.glb` sobe no eixo +X. O resolvedor atribuía
90° a sul, mas a rotação positiva sobre Y usada pelo Three transforma +X em −Z,
isto é, norte. O validador e a imagem discordavam nos lanços norte/sul.

A correção limita-se à tabela de rotação em `src/scene3d/resolve.ts`: sul usa
270° e norte usa 90°. Não altera a câmara, o esquema, o solucionador, as pistas
ou os validadores. O teste das quatro direções transforma o vetor de subida com
a mesma operação do Three: falhou para norte/sul antes da correção.

Alternativa considerada: restringir a autoria a lanços este/oeste. Rejeitada
porque deixaria um erro real numa capacidade já declarada pelo sistema. A tarefa
Astra autoriza correções fundamentais necessárias e justificadas; esta correção
é isolada num commit próprio, antes da nova composição.

## Estado da revisão

Em curso. Este documento ainda não aprova o ramo como referência de produção.
