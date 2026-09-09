# Arquitetura residencial de vários pisos

Estado: projeto aprovado internamente em 09/09/2026; implementação e aprovação visual pendentes.
Base: `5e03c58ed7ee7c31bc74772254f035f551721b66`.
Ramo: `astra/multistorey-architecture-v2`.

## Diagnóstico e decisão arquitetónica

The Wrong Coat tem um rés-do-chão integralmente interior, de 8 × 8 células.
A conservatória sudeste não é um jardim. A pegada superior pode coincidir com
a inferior; uma retração artificial prejudicaria o programa e os objetos lógicos.
A regra de não construir sobre jardim será demonstrada numa configuração de
regressão independente, sem inventar exterior no caso existente.

O vão anterior `[2,0,4,2]` retira nove células e comprime o quarto. A escada
chega ao conjunto da secretária, sem um espaço de distribuição independente.
A divisão lógica «Landing» não prova que exista um patamar arquitetónico.

## Planta aprovada para desenvolvimento

Coordenadas x/z em unidades de célula, com limites geométricos exclusivos:

- Rés-do-chão: pegada construída `[0,0,8,8]`; conservar divisões e mobiliário.
- Piso superior: mesma pegada, descontando o vão; quarto a noroeste, estudo a
  nordeste, casa de banho a sudoeste e leitura a sudeste.
- Escada: preservar modelo, posição, subida para este e último degrau em x=5.
- Vão proposto: `[2.65,0,5,1.15]`. O lanço medido ocupa aproximadamente
  z=0,106–1,094; um vão de apenas uma fila lógica taparia parte da escada.
- Patamar: faixa norte a este da escada, com continuação para o corredor este.
- Corredor: margem este, largura bruta inicial de 1,2 células; medir a largura
  útil entre faces e móveis antes de aceitar a composição.
- Átrio transversal: a sul do estudo, com acesso ao quarto, estudo, casa de
  banho e leitura. Nenhum destes percursos atravessa um grupo de mobiliário.
- Guardas: acompanhar os limites oeste e sul do vão, deixando a chegada este
  aberta. A altura visível respeita o recorte da casa em miniatura.

```text
Escada → patamar norte → corredor este
                              ↓
Quarto ← átrio transversal ←───┘
               ↓       ↘
       casa de banho    leitura
               ↑
            estudo
```

O quarto conserva cama apoiada a oeste e mesa de cabeceira; a porta dá para o
átrio. O estudo conserva secretária e cadeira associadas às células lógicas,
mas recebe uma entrada própria a sul. A casa de banho conserva banheira,
lavatório e sanita, com acesso pelo átrio. A leitura agrupa cadeira, estante,
planta e consola no perímetro, mantendo a distribuição livre. As janelas
norte/oeste pertencem ao envelope real; a relação da luz com os espaços será
avaliada no navegador.

## SYSTEM ESCALATION — pegada, vão físico e circulação

Limitação concreta: o resolvedor presume pavimento em todo o quadrado lógico;
o único vazio é um retângulo de células inteiras. O validador compara escada e
vão, mas não demonstra apoio entre pisos nem uma chegada ligada a circulação
arquitetónica. O resultado atual é um vão excessivo e uma chegada junto à mesa.

Decisão do orquestrador Astra, após revisão independente: acrescentar uma
pegada explícita por piso, limites físicos fracionários para o vão e metadados
de patamar/circulação. Manter compatibilidade com cenas de um piso e com a
representação histórica, sem permitir declarações contraditórias.

Conservar apenas o sistema atual obrigaria a retirar pavimento útil por causa
da grelha ou a chamar «patamar» a uma área privada. Essa alternativa é rejeitada.
Não são introduzidos balanços estruturais, varandas, terceiro piso ou gerador
de casas. Jardim e pátio não constituem apoio para um piso interior superior.

Impacto previsto: esquema, resolução da laje/envelope, consumo da mesma laje
pelo renderizador ativo e fantasma, validação geométrica, testes e documentação.
A composição do piloto é uma unidade própria. A lógica do caso, o solucionador,
o gerador, a projeção, as medidas Kenney e os apoios em superfícies conservam-se.

## Condições para aprovação

Os testes deverão rejeitar pavimento superior sem apoio, chegada bloqueada,
vão incompatível, móveis ou tapetes sem laje e circulação declarada descontínua.
As verificações não substituem julgamento residencial: privacidade, proporções,
conforto, leitura das guardas e qualidade do mobiliário exigem imagens reais.

Antes de declarar esta referência pronta: inspecionar ambos os pisos, chegada,
corredor, portas e contactos em 1 440 × 1 100 e 390 × 844; testar contexto
fantasma, panorama explodido e interação; rever os três pilotos de um piso;
executar o controlo completo de produção. Esta decisão de projeto não é uma
aprovação visual e não altera o estado pendente indicado no início.

## Contrato editorial permanente

### Uma casa, dois pisos

Desenha os dois pisos em conjunto antes de mobilar. Identifica primeiro o
edifício real no rés-do-chão e todos os jardins, caminhos e pátios. A pegada
superior só pode ocupar área construída inferior. Uma retração retira parte
da pegada; não se representa como um jardim suspenso nem como um material de
pavimento diferente. Não existem balanços ou terraços implicitamente autorizados.

O vão pertence ao volume do edifício, mas não contém laje. Pavimento interior,
terreno exterior e ausência de piso são conceitos diferentes. Um relvado
inferior não recebe teto, paredes ou móveis superiores por ocupar células da
grelha. Janelas só pertencem a segmentos reais do envelope desse piso.

### Escada, patamar e circulação

Reserva o lanço medido, a aproximação inferior, a chegada superior e o percurso
até às divisões antes de colocar móveis. O patamar tem de permitir sair em
frente e escolher um percurso utilizável. Não pode ser apenas uma célula livre
no interior de um quarto ou entre uma secretária e a sua cadeira.

Num piso com várias divisões, um átrio, corredor ou galeria deve servir as
entradas. Declara espaços de circulação livres, com larguras medidas entre
faces acabadas; não uses uma linha abstrata que atravessa paredes ou móveis.
Cada entrada precisa de aproximação útil dos dois lados. A casa de banho não
pode funcionar como passagem obrigatória para chegar ao quarto.

As dimensões de circulação deste projeto servem a coerência da miniatura.
Não constituem certificação de acessibilidade ou cumprimento de normas de
construção de edifícios reais.

### Vão e proteção

O contorno do vão acompanha o volume do lanço e deixa a cabeça encontrar a
laje. Inspeciona os degraus reais, não apenas a caixa do modelo. Não há tapetes,
móveis, apoios de móveis ou soluções válidas sobre o vazio.

Protege todas as margens expostas que não sejam a própria chegada, com paredes
ou guardas coerentes. O recorte isométrico pode baixar a altura visível dessas
paredes, mas não pode apagar a intenção de proteção. Uma abertura escura sem
degraus reconhecíveis ou sem margens deliberadas falha a revisão visual.

### Divisões e mobiliário

Cada divisão deve possuir função, entrada e um conjunto de móveis relacionado:
cama com cabeceira e acesso lateral; secretária com cadeira; casa de banho com
equipamento e privacidade; leitura com assento e apoio. Relaciona esses grupos
com paredes e janelas. O espaço vazio serve circulação ou acesso; não se preenche
com cadeiras órfãs nem se deixa sem propósito por conveniência da grelha.

Os objetos pequenos apoiam-se em superfícies-pai declaradas. Os móveis mantêm
escala Kenney e contacto real com o pavimento. Uma pista não justifica colocar
um móvel no vão, na porta ou no patamar. Se não for possível conservar a
associação lógica e uma composição física válida, regista a incompatibilidade;
não alteres a pista, a solução ou as tolerâncias para a esconder.

### Separação da lógica

Linhas, colunas, pistas, solução e regiões lógicas continuam no modelo Murdoku.
Os nomes das divisões não definem circulação. «Study» pode conter parte de uma
galeria arquitetónica, mas isso não autoriza a chegada a atravessar o conjunto
de trabalho. A associação visual dos objetos lógicos mantém contacto com as
células correspondentes, conforme o contrato do validador.

### Revisão obrigatória no navegador

Antes de aceitar o caso, guarda vistas completas e pormenores sem recortar o
encontro que está em avaliação. Confirma: lanço inferior, chegada, patamar,
vão, guardas, corredor, cada porta, grupos de mobiliário e relação entre
pegadas. Repete com contexto fantasma, panorama explodido e interação ativa.
Usa aproximadamente 1 440 × 1 100 e 390 × 844 píxeis.

Testa seleção, colocação, conflito local e entre pisos, localização de pistas,
ajuda, troca de piso, teclado, desfazer/refazer e conclusão do caso. Depois de
uma alteração estrutural, abre também Midnight Delivery, The Empty Chair e
The Last Nightcap. Testes aprovados não são aprovação visual.

### Erros que obrigam a rejeição

- Dois quadrados completos sobrepostos sem decisão de pegada.
- Jardim coberto por piso interior superior.
- Escada que termina no conjunto de cama ou secretária.
- Patamar sem distribuição ou com passagem apertada e sem função residencial.
- Vão coberto por laje, tapete ou mobiliário.
- Abertura que parece geometria em falta e não uma escada deliberada.
- Divisões isoladas sem percurso humano entre elas.
- Móveis dispersos para preencher coordenadas de pistas.
- Janela sem parede exterior ou sobre uma zona sem piso superior.
- Validação afrouxada para aprovar uma composição impossível.

### Escalada futura

Uma necessidade de varanda, balanço, novo sistema de escadas ou outra forma de
apoio exige «SYSTEM ESCALATION»: descreve a limitação, mostra a falha concreta,
compara alternativas no sistema existente e propõe a menor abstração reutilizável.
Não cries indicadores específicos de um caso. A presente missão autoriza a
alteração descrita acima; essa autorização não se transfere automaticamente
para futuros lotes de produção.
