# Acabamentos arquitetónicos residenciais V4

Início: 17/09/2026. Estado: diagnóstico e comparação visual em curso.
Origem local e remota verificada após `git fetch origin`:
`astra/multistorey-residential-design-v3`,
`1e78316f024c60bac98239ed0104c1f44b4d43bf`.
Árvore de trabalho limpa na partida. Trabalho isolado em
`astra/residential-architectural-polish-v4`; o ramo V3 permanece intacto.

## Diagnóstico antes de alterar código

As imagens V3 mostram separação lateral entre os aros e as paredes no quarto,
na casa de banho e no escritório. O resolvedor recorta a largura declarada
do vão, mas insere sempre o mesmo modelo rígido `doorwayOpen`. As quatro portas
superiores declaram uma célula, equivalente a 0,8 unidades. O aro catalogado
mede cerca de 0,486 unidades de largura. Isto deixa cerca de 0,157 unidades
de espaço lateral em cada lado. A largura explícita substitui `DOOR_GAP`;
alterar apenas essa constante não corrigiria as portas V3.

Mesmo sem largura explícita, `DOOR_GAP` acrescenta 0,02 à largura exterior
do modelo. Existe, portanto, uma folga de montagem que não recebe acabamento.
As janelas já têm membros procedimentais que cobrem a junta; as divisórias
com porta não têm esses membros. A medição direta das malhas determinará
a secção do aro, a profundidade e a sobreposição necessária. Não há motivo
para deslocar o centro das portas ou mover mobiliário.

A hierarquia atual tem envelope posterior de 1,29, recorte exterior de 0,12,
divisória `full` de 1,29, `low` de 0,6 e `half` de 0,35. As guardas usam
`half` com tratamento aberto. O quarto a este e o banho a norte/nordeste
usam `full`; todas as entradas, o escritório e a leitura usam `low`.
O nome `low` descreve uma altura, mas não distingue a intenção de recorte
de uma verdadeira divisória baixa. A aparência de cubículo no escritório
é visível e não se resolve subindo as guardas.

Há ainda uma restrição física a considerar: o intervalo entre pisos é 1,34,
composto por parede de 1,29 e laje de 0,05. Subir indiscriminadamente paredes
completas para além dessa cota faria-as atravessar a laje do piso seguinte.
A comparação visual deve preservar essa relação, a escada e a leitura do
envelope. Serão comparadas a referência e duas intensidades de apresentação,
antes da escolha final da hierarquia.

## Âmbito da autorização de sistema

O pedido V4 autoriza expressamente uma correção reutilizável do encontro
entre porta e parede e a separação semântica das alturas. Esta autorização
cobre esquema, resolução, desenho e testes estritamente necessários a esses
contratos. Não autoriza alterações ao caso, à solução, às pistas, ao gerador,
à câmara, às escadas ou aos limiares dos validadores. Qualquer necessidade
adicional será identificada separadamente.

## Medição e decisão do encontro das portas

A leitura dos 48 vértices de `doorwayOpen.glb` confirma largura exterior
0,485999972, altura 1,009531736 e profundidade 0,089099996. As ombreiras e
a travessa têm secção 0,02835. O interior livre mede 0,4293 de largura e
0,981181736 de altura. Há apenas um aro retangular, sem guarnição que cubra
a parede. O recentramento do carregador está correto; a rotação de 90°
conserva as mesmas folgas. A causa é incompatibilidade de largura e ausência
de acabamento, não um erro de origem ou de orientação.

| Porta superior | Eixo | Vão estrutural | Aro V3 | Folga por lado |
| --- | --- | --- | --- | --- |
| Quarto | x | 0,8 | 0,486 | 0,157 |
| Escritório | x | 0,8 | 0,486 | 0,157 |
| Casa de banho | z | 0,8 | 0,486 | 0,157 |
| Leitura | x | 0,8 | 0,486 | 0,157 |

Decisão Astra: resolver as portas interiores por membros procedimentais
de secção medida, adaptados ao vão estrutural declarado. Não esticar o GLB
nem disfarçar 0,157 de vazio com uma guarnição desproporcionada. Conservar
centros, larguras dos vãos e altura útil do aro. A folga de montagem mantém
0,01 por lado; a guarnição cobre-a e sobrepõe a parede em meia secção de
ombreira, 0,014175. Projeta-se 0,01 para fora de cada face da parede,
conforme o acabamento de janela existente. Não haverá travessa no pavimento.

O vão superior de 0,8 terá passagem acabada de 0,7233, depois das duas
folgas e duas ombreiras. O vão por omissão de 0,506 conservará a passagem
medida de 0,4293. A entrada exterior conserva a folha Kenney e recebe apenas
a guarnição que cobre a junta. As janelas conservam o sistema atual, que já
sobrepõe os limites do vão em 0,03 de cada lado.

## Ensaios preliminares de altura

Uma simulação da geometria resolvida, sem alterar ficheiros de execução,
comparou as paredes completas V3 de 1,29 com 1,419 (+10 %) e 1,4835 (+15 %).
Ambas as subidas ocultam seis posições à altura das peças de jogo:
`0,1`, `1,1`, `2,1`, `4,0`, `4,1` e `4,2`. Além disso, ultrapassam a cota
de encaixe na laje seguinte. Estes resultados justificam rejeitar uma subida
global, mas não substituem a comparação visual pedida.

No escritório, elevar apenas a parede oeste de 0,6 para 0,66 ou 0,69 não
produziu erros nem posições ocultas na mesma simulação. Convertê-la inteira
para 1,29 oculta três posições junto à chegada. As alternativas visuais irão
distinguir uma divisória de divisão apresentada em recorte de uma meia-parede
real e de um recorte do lado da câmara. A escada, o envelope e as guardas
conservam as cotas existentes.
