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

## SYSTEM ESCALATION — volume de visibilidade da escada

O teste de visibilidade tratava todo o lanço como um bloco de 1,34 unidades,
incluindo o pé. Um raio à altura da personagem intersectava essa caixa, mas
passava acima dos primeiros degraus reais. Deslocar a escada para contornar
esse falso positivo impedia o contacto exato entre o último degrau e a laje.

`stairVisibility.ts` usa onze volumes conservadores medidos nos três GLB retos.
Os intervalos incluem a sobreposição real dos degraus e arredondam para fora.
O teste recorta todos os triângulos das malhas por faixa e prova que os volumes
contêm a superfície inteira; confirma ainda pé livre e topo obstruído nas
quatro direções. A escada de canto mantém a caixa completa.

A única aplicação em `validate.ts` é a oclusão de células (`cell-hidden`).
Colisões, circulação, dimensões, vãos, patamares e associação entre pisos
conservam os controlos anteriores. Nenhuma escada é ignorada pelo validador.
Esta correção resolve uma aproximação geométrica incorreta, sem dispensar uma
regra de produção. A revisão independente não encontrou bloqueadores.

## SYSTEM ESCALATION — apresentação do piso acompanhante

As caixas fantasma passam a mostrar arestas arquitetónicas, sem diagonais de
triangulação. A escada acompanhante fica opaca à altura real, com escrita de
profundidade: a laje ativa oculta-a fisicamente e o vão revela o lanço. Na vista
explodida mantém opacidade de 0,48. Câmara, separação entre pisos e interação
não mudam. A alteração limita-se ao tratamento visual em `renderer.ts`.

## Estado da revisão

Em curso. Este documento ainda não aprova o ramo como referência de produção.
