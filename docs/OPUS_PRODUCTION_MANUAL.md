# Manual obrigatório de produção do Opus

Este é o contrato canónico para produzir casos e cenas Murdoku. Lê-o na íntegra antes de alterar dados de um caso, uma cena 3D, o catálogo de recursos ou imagens de referência.

O Opus é um trabalhador de produção. Não é o arquiteto do motor. Um lote normal cria conteúdo dentro do sistema aprovado; não redefine pistas, projeção, física, escala, renderização, validadores ou regras do jogo.

## 1. Fontes de verdade

Segue esta ordem:

1. `AGENTS.md` e a autorização da tarefa;
2. este manual;
3. `docs/PUZZLE_AUTHORING.md`;
4. `docs/ISOMETRIC_SCENE_SYSTEM.md`;
5. `docs/KENNEY_PACK_SURVEY.md`;
6. `src/core/types.ts` e `src/scene3d/schema.ts`;
7. os validadores e testes;
8. Midnight Delivery como referência visual.

Se duas fontes entrarem em conflito, para e pede uma decisão. Não inventes uma regra intermédia.

## 2. Política de ramos

Quando esta linha Sol tiver sido aprovada como referência dourada, cada lote deve começar no SHA aprovado:

```text
git switch --detach <sha-aprovado>
git switch -c opus/scene-batch-01
```

Regras:

- nunca trabalhar diretamente em `main`;
- nunca trabalhar diretamente no ramo protegido de referência dourada;
- nunca alterar `checkpoint/fable-5.1-interrupted-2026-09-02`;
- não fazer *force-push*, rebase destrutivo, *amend* de commits publicados ou *squash* destrutivo;
- uma unidade lógica concluída implica validação, revisão da diferença, commit descritivo e publicação no ramo `opus/*` autorizado;
- o lote só pode partir do SHA que o responsável aprovou, não do ramo local «mais recente».

## 3. Limites de ficheiros

Produção normal pode alterar:

- `src/data/cases/<slug>.ts`;
- `src/data/cases/index.ts`;
- `src/scene3d/scenes/<slug>.ts` e o índice das cenas;
- imagens finais em `docs/reference/`;
- documentação específica do caso.

Alterações condicionais, que devem formar uma unidade própria:

- `src/core/catalog.ts`, apenas para um novo lugar no catálogo, título e versão de cache;
- `public/kenney3d/`, apenas para modelos medidos e usados;
- `src/scene3d/catalog.generated.ts` e `src/scene3d/catalog.ts`, apenas para o respetivo catálogo físico e semântico.

Ficheiros restritos numa tarefa de produção:

- `src/core/engine.ts`, `generate.ts`, `puzzleValidate.ts` e `types.ts`;
- `src/scene3d/schema.ts`, `resolve.ts`, `renderer.ts`, `units.ts` e `validate.ts`;
- `src/hooks/useGame.ts` e a semântica de interação entre pisos.

Se um caso exigir a alteração de um ficheiro restrito, aplica-se «SYSTEM ESCALATION».

## 4. Criar um caso

### 4.1 Escolher o lugar e o perfil

Decide primeiro o `slug`, o nível, o tamanho, o número de pessoas e os pisos. Usa os intervalos observados em `docs/PUZZLE_AUTHORING.md`; não inventes uma pontuação única. Um caso com dois pisos deve usar um tamanho suportado e pessoas nos dois pisos.

Se substituíres um lugar gerado já planeado, usa o `slug` exato desse lugar. Se aumentares o catálogo, acrescenta o lugar, um título único e aumenta a versão de cache.

### 4.2 Definir divisões

Cada divisão escrita à mão é um retângulo inclusivo com nome, cor e piso. Os identificadores são atribuídos pela ordem do vetor. Mantém nomes únicos em toda a casa, incluindo pisos diferentes. Cada célula deve pertencer exatamente a uma divisão lógica desse piso.

A topologia lógica não dita as paredes. Uma linha pode atravessar várias divisões, e uma divisão pode ter uma abertura ampla na cena.

### 4.3 Definir pessoas e solução

- usa no máximo tantas pessoas como linhas ou colunas;
- marca exatamente uma vítima;
- atribui uma célula completa a cada pessoa;
- não repitas linhas nem colunas, mesmo entre pisos;
- coloca pessoas nos dois pisos quando `floors: 2`;
- confirma que exatamente um suspeito partilha a divisão da vítima;
- não escolhas `murdererId` manualmente para contrariar o motor.

### 4.4 Definir mobiliário lógico

O mobiliário pertence à lógica das pistas. Cada peça precisa de posição, piso e, quando aplicável, `w`, `h` e rotação coerentes. Uma peça não pode sair da grelha, atravessar divisões ou sobrepor outra. Cada divisão deve conservar pelo menos uma célula livre.

O tipo lógico não escolhe automaticamente a composição visual. A cena deve associá-lo explicitamente através de `logic: 'tipo@linha,coluna'`.

### 4.5 Definir pistas

Usa apenas os tipos declarados em `src/core/types.ts`. Todas as pistas têm de ser literalmente verdadeiras na solução. As relações `above`, `below` e `floor` só pertencem a casos de dois pisos. As relações entre linhas e colunas são globais aos pisos.

Usa `requiredClues` para preservar intenção narrativa ou espacial durante a poda. Não uses uma pista que identifique diretamente o suspeito que está com a vítima. Constrói o caso duas vezes após sementes diferentes se alterares a seleção de pistas; o resultado escrito à mão tem de ser idêntico.

### 4.6 Validar o caso

Executa:

```text
npm test -- tests/authoredCases.test.ts tests/puzzleValidate.test.ts tests/puzzles.test.ts
npm run report:puzzles
npm run validate:production
```

Revê os erros e todas as advertências. Não removas uma advertência sem compreender a sua causa. O relatório `docs/reports/puzzle-catalog.json` tem de ficar sincronizado.

## 5. Avaliar a dificuldade

Usa o perfil multidimensional do guia de autoria:

- entropia inicial dos candidatos;
- candidatos únicos no início e após propagação;
- passagens de propagação;
- pessoas que exigem lógica relacional ou procura;
- pistas relacionais e entre pisos;
- redundância;
- franqueza média das pistas.

Compara com vários casos do mesmo nível. Uma métrica fora do intervalo é um pedido de revisão, não uma ordem para adicionar pistas até acertar num número.

## 6. Construir a cena visual

### 6.1 Separar as topologias

O caso possui divisões, células, mobiliário lógico e solução. A `SceneSpec` possui envelope, paredes, aberturas, materiais, circulação e composição. Não desenhes uma parede em cada fronteira lógica e não alteres o caso para acomodar um objeto visual.

### 6.2 Unidades e projeção

- uma célula Murdoku mede `CELL = 0.8` unidades Kenney;
- um piso Kenney mede 1,00 × 1,00;
- a parede interior canónica tem 1,29 de altura;
- a câmara é ortográfica, com azimute de 45° e elevação de 32°;
- os modelos usam o tamanho real medido;
- não existe escala por objeto, elevação livre ou deslocamento em píxeis.

### 6.3 Escolher modelos

Consulta `src/scene3d/catalog.ts` e `docs/KENNEY_PACK_SURVEY.md`. Um modelo só pode representar os tipos declarados nos metadados. Não importes um pacote inteiro. Mede cada GLB novo e regenera o catálogo físico.

### 6.4 Colocar objetos

- `against`: camas, sofás, secretárias, bancadas e estantes em contacto com uma face acabada de parede;
- `on`: candeeiros, livros, micro-ondas, televisores e pequenos adereços numa superfície-pai declarada;
- `at`: mesas, cadeiras, plantas e objetos soltos no pavimento;
- `yaw`: apenas para adereços soltos e elementos naturais que o catálogo permite.

O limite físico completo não pode penetrar a espessura da parede. A pegada lógica não substitui a colisão 3D.

### 6.5 Paredes, portas e janelas

Mantém uma única espessura estrutural. Uma janela é uma abertura real nessa parede, com moldura e vidro inseridos. Uma porta também ocupa uma abertura real. Não uses uma laje `wallWindow` mais grossa como parede alternativa.

As paredes norte e oeste formam o fundo alto. As paredes sul e este são o recorte baixo. As divisórias são baixas por omissão; usa parede completa apenas quando não ocultar células jogáveis. Todas as extremidades devem tocar noutra parede, no envelope ou estar declaradas como livres.

### 6.6 Interior, exterior e pátio

- `interior`: pavimento acabado a `y = 0`, dentro do envelope;
- `exterior`: terreno mais baixo, sem parede do envelope no limite exposto, com fundação e soleira na transição;
- `courtyard`: terreno mais baixo dentro do envelope, mantendo a parede exterior.

Usa `wood`, `tile`, `stone`, `grass` e `dirt` por zonas. Uma zona exterior não é um retângulo verde decorativo dentro da sala. A paisagem deve formar grupos naturais e preservar legibilidade; não alinhes arbustos nos centros das células.

### 6.7 Circulação e visibilidade

Todas as divisões precisam de acesso desde a entrada ou o patamar. Mantém portas, passagens e patamares livres. Coloca objetos altos no fundo norte/oeste ou prova que não ocultam células. Usa o modo de diagnóstico para confirmar colisões e volumes.

### 6.8 Dois pisos e escadas

Cria uma cena por piso. O rés-do-chão declara `stairs`; o piso superior declara um `stairwell` coincidente. A escada deve subir `STOREY_HEIGHT`, a abertura não pode conter laje e ambos os patamares devem estar livres e acessíveis.

A vista predefinida mostra o piso ativo e o outro como contexto fantasma à altura real. A vista explodida serve de panorama. O piso fantasma nunca recebe eventos e não mostra mobiliário que distraia.

### 6.9 Iluminação e sombras

O renderizador converte materiais Kenney sem iluminação em Lambert, usa uma luz principal e sombras reais. Não cries sombras falsas por objeto nem alteres luzes para esconder problemas de contacto.

## 7. Exemplos históricos: mau e bom

Mau:

```text
offsetCol: -0.15
```

Bom: a face traseira de folga toca fisicamente a face acabada da parede.

Mau:

```text
lift: 20
```

Bom: o micro-ondas usa uma superfície declarada da bancada como pai.

Mau: a pegada verde não atravessa a linha central da parede.

Bom: o volume físico completo não penetra a espessura da parede.

Mau: a janela é uma laje de parede diferente.

Bom: a parede conserva a mesma espessura, contém uma abertura real e recebe moldura e vidro.

Mau: seis arbustos idênticos nos centros das células lógicas.

Bom: a associação lógica mantém-se, mas a paisagem visual forma grupos naturais.

## 8. Pré-validação rápida

Executa antes de cada commit de produção:

```text
npm run validate:production
node scripts/measure-puzzles.mjs --check
```

Este controlo verifica tipagem, 60 casos, erros rígidos, cenas escritas à mão, associação lógica/visual, recursos GLB, consistência entre pisos e escadas.

## 9. Controlo visual no navegador

Para cada cena:

1. abre `/?env=1&case=<id>` e verifica apenas o ambiente;
2. abre `/?env=1&diag=1&case=<id>` e confirma volumes, aberturas e apoios;
3. abre `/?case=<id>` e testa repouso, foco, seleção, colocação válida, colocação inválida, marcação, desfazer, limpar e acusação;
4. num caso de dois pisos, testa ambos os pisos, o contexto fantasma, o panorama explodido e os bloqueios cruzados;
5. repete em ecrã de secretária e a 390 px de largura;
6. conclui o caso e confirma a vitória, a progressão e a persistência;
7. guarda as imagens finais deliberadas em `docs/reference/`.

Não aproves uma imagem apenas porque o validador passou. Procura objetos suspensos, penetrações, paredes sem função, grelha visível, mobiliário escondido, zonas exteriores planas, escadas sem patamar e hierarquia fraca.

## 10. Controlo completo do lote

Antes de pedir aprovação:

```text
npm test
npm run validate:production
node scripts/measure-puzzles.mjs --check
npm run lint
npm run build
```

Além disso, conclui o controlo visual de secretária e telemóvel, a jogabilidade do princípio ao fim e a regressão das referências douradas: Midnight Delivery, The Empty Chair, The Last Nightcap e o caso-piloto de dois pisos.

## 11. Quando não modificar o sistema

> A production scene failing validation is normally fixed in the SceneSpec, puzzle spec, asset choice or composition. Do not edit the validator merely to make the production case pass.

> If a production case appears to require renderer/schema/solver/generator foundational changes, STOP. This is a SYSTEM ESCALATION, not ordinary production work.

Regista a escalada quando surgir uma nova semântica de pista, um terceiro piso, uma nova regra de assassino, uma incompatibilidade de escala, uma necessidade de escala ou elevação por objeto, uma alteração da câmara, um tipo de abertura não representável ou um falso positivo plausível do validador.

Uma escalada deve indicar: o caso, a regra bloqueada, a prova, os ficheiros fundamentais que seriam afetados, alternativas dentro do sistema e a decisão necessária. Não contornes o bloqueio.
