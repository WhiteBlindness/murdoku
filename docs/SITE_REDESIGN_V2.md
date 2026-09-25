# Redesenho do produto, versão 2

Ramo `sol/site-redesign-v2`, criado diretamente de `a2d8d167db626470ea942fa9e59efcb6269beab0`. Esta V2 altera apenas a interface à volta das cenas. Revisão de 25/09/2026.

## Crítica dirigida à V1

Inspecionei a V1 no navegador e comparei as referências guardadas em `docs/reference/site-redesign-v1/`. A estrutura já melhorou face ao site antigo: a maquete real aparece na entrada, as pistas são mais legíveis, as notas recolhem e o fecho do caso tem uma hierarquia clara. A V2 precisa de uma composição própria, não apenas de trocar cores.

- **Entrada:** o título tem presença, mas o resto é um bloco de texto ao lado de uma imagem encaixada num cartão. A maquete aparece como ilustração de uma ficha, quando poderia ser o objeto que dá forma à primeira página. O gradiente violeta quase não se percebe; a cor concentra-se num botão turquesa e num filete coral.
- **Biblioteca:** os modos e a lista funcionam, mas oito linhas idênticas parecem um índice administrativo. O caso seguinte só se distingue por um fundo ligeiramente diferente. Faltam ritmo, progressão e uma razão visual para abrir outro processo.
- **Jogo:** a cena é o elemento mais forte. O painel claro à direita repete a pessoa ativa na sequência e no cartão; quatro cartões com a mesma moldura comprimem a leitura. O cabeçalho e a sequência consomem altura antes da cena, especialmente no telemóvel. As notas recolhidas já têm o peso certo, mas o rótulo e os comandos continuam a parecer módulos separados.
- **Cor e atmosfera:** papel, violeta, dourado, coral e turquesa coexistem sem uma hierarquia suficientemente estável. O papel torna a leitura confortável e combina com a madeira Kenney; o fundo escuro enquadra a maquete. A aplicação ainda não decide quando a cor serve ação, perigo, pista ou ambiente. Algumas áreas parecem planas apesar da paleta numerosa.
- **Tipografia:** Barlow Condensed dá personalidade aos títulos, mas os metadados em maiúsculas e tipo monoespaçado aparecem demasiadas vezes. A pista deve continuar a ser texto corrente de leitura fácil. Uma mudança de escala e de peso produzirá mais efeito do que outra moldura.
- **Telemóvel:** a maquete aparece cedo e as ações seguem-na, o que funciona. A sequência ocupa uma linha completa, as ferramentas ocupam três linhas e as pistas ficam depois; a ida da pista à cena exige demasiada deslocação. A V2 deve tornar a pessoa ativa e a sua pista acessíveis junto da cena sem tapá-la.
- **Conclusão:** o veredicto é claro e a próxima ação está presente, mas a folha isolada num fundo quase vazio ainda se aproxima de um formulário de confirmação. Falta a sensação de ter reconstruído um caso, com o resultado e a continuação unidos numa só composição.

## Duas direções a testar

**A. V1 intensificada:** conserva a entrada em duas colunas, a biblioteca em lista e o jogo com cena à esquerda e dossiê à direita. Usa tinta mais profunda, luz turquesa controlada, papel menos bege, títulos maiores e menos filetes. É a opção de menor risco, mas pode manter a sensação de painel.

**B. Palco de investigação:** a entrada coloca a maquete sem moldura no centro de uma composição editorial com título maior, gradiente atmosférico e uma chamada de ação inequívoca. A biblioteca distingue o próximo caso e usa um índice mais ritmado. No jogo, a cena ocupa um palco próprio; uma faixa compacta apresenta as pessoas e a pista da pessoa ativa, enquanto o dossiê completo fica disponível sem duplicar tudo. Cor intensa aparece em pontos de decisão, não em cada cartão. O fecho usa o veredicto como acontecimento principal.

Comparei as duas propostas no navegador a 1 440 × 1 100 e a direção B também a 390 × 844. Escolhi **B, palco de investigação**. Na A, a maquete continuava presa a um retângulo e o grande espaço entre o título e a cena deixava a página fragmentada. Na B, o recorte transparente cria uma entrada reconhecível; o processo seguinte liga-se visualmente à maquete e a zona de jogo pode dar mais área à cena. A versão móvel precisa de ajustar a escala do título e manter o processo seguinte visível depois da maquete. O protótipo temporário será retirado antes do resultado final.

Capturas dos protótipos: [direção A, computador](reference/site-redesign-v2/direction-a-1440.png), [direção B, computador](reference/site-redesign-v2/direction-b-1440.png) e [direção B, telemóvel](reference/site-redesign-v2/direction-b-390.png).

O sistema cromático distingue quatro funções: âmbar para a ação principal e a progressão, turquesa para a pessoa selecionada, coral para perigo ou conflito e tons de papel para leitura longa. O fundo combina tinta violeta e azul profundo num gradiente discreto que não compete com as madeiras quentes da cena. A versão clara usa papel frio, tinta escura e os mesmos papéis funcionais da cor.

## Sistema escolhido

A entrada usa a maquete recortada e sem cartão de fundo, um título editorial grande, um gradiente de tinta azul-violeta e um único convite principal para abrir o arquivo. A imagem é um recurso de apresentação derivado do trabalho já existente; não substitui modelos dentro dos casos. A biblioteca apresenta a progressão dos 60 processos por dificuldade, destaca o caso seguinte e mostra o melhor tempo quando já existe. A lista mantém pesquisa, modos e indicação de processos concluídos.

No jogo, a sequência passou a uma faixa compacta de pessoas. A pessoa ativa aparece uma vez como dossiê legível, ligado às suas pistas, enquanto a cena ocupa a maior parte do espaço. As ferramentas mantêm Place, Mark, Undo, Redo, Clear, Hint e Decorate; Accuse mantém a sua função e ganha contexto com o número de pessoas colocadas. As notas continuam guardadas no mesmo armazenamento local e recolhidas por defeito. Os controlos de piso continuam externos à cena e identificam-se como vistas. O fecho reúne veredicto, vítima, local, tempo, ajudas e próximos passos numa composição de recompensa; a revisão das pistas permanece disponível.

Os estilos usam variáveis semânticas em `site-system.css`. No tema escuro, `--site-shell-gradient` combina `#1d1b2b`, `#1b2635` e luzes difusas violeta e turquesa; `--site-shell-text` é `#fff8ee`, `--site-accent` é `#f1b766`, `--site-highlight` é `#65d1c9` e `--site-danger` é `#ef8270`. No tema claro, o fundo passa a `#fbf7ef` e `#e7edf0`, a tinta principal a `#222534`, a ação a `#8e4c24`, a seleção a `#116f70` e o perigo a `#a22d41`. Os nomes e pistas usam Hanken Grotesk para leitura prolongada; Barlow Condensed fica reservado aos títulos; Courier Prime surge apenas em dados curtos. A escolha de tema persiste e respeita a preferência do sistema quando não há escolha explícita.

O trabalho manteve o vocabulário de investigação sem copiar símbolos, personagens ou composição de outra obra. Rejeitei o cartão de imagem da direção A, a repetição de cartões completos para todas as pessoas e efeitos de movimento sobre a maquete. O fundo escuro enquadra as madeiras Kenney; os acentos saturados identificam decisões e estados, em vez de pintar toda a interface.

## Comportamento adaptável e acessibilidade

Verifiquei a entrada, o arquivo e o jogo a 390 × 844, 430 × 932, 768 × 1 024, 1 280 × 800, 1 440 × 1 100 e 1 920 × 1 080. No telemóvel, o título e a maquete mantêm presença sem empurrar o início do arquivo para uma sequência de painéis; no jogo, a faixa de pessoas precede a cena, as ferramentas ficam a seguir à cena e o dossiê ativo mantém a pista legível. Não encontrei transbordamento horizontal não intencional nas larguras inspecionadas. A 390 píxeis, o documento mede 375 píxeis de largura útil, devido à barra de deslocamento, e não excede a janela de 390 píxeis.

Botões e estados mantêm nomes acessíveis, foco visível e alvos táteis de pelo menos 44 píxeis nos controlos principais. Estado de vítima, conflito, próximo caso e conclusão inclui texto, para não depender só da cor. A preferência por movimento reduzido elimina as transições decorativas. Verifiquei a navegação por teclado e as operações do jogo no navegador. A pista longa continua a exigir deslocação em telemóveis pequenos; é uma limitação de espaço, não uma perda de conteúdo.

## Provas visuais

| Estado | Antes, V1 | Depois, V2 |
| --- | --- | --- |
| Entrada, 1 440 × 1 100 | [V1](reference/site-redesign-v1/site-v1-after-home-1440x1100.png) | [V2](reference/site-redesign-v2/v2-home-1440x1100.png) |
| Biblioteca, 1 440 × 1 100 | [V1](reference/site-redesign-v1/site-v1-after-library-1440x1100.png) | [V2](reference/site-redesign-v2/v2-library-1440x1100.png) |
| Jogo, 1 440 × 1 100 | [V1](reference/site-redesign-v1/site-v1-after-puzzle-1440x1100.png) | [V2](reference/site-redesign-v2/v2-puzzle-idle-1440x1100.png) |
| Dois pisos, vista inicial | [V1](reference/site-redesign-v1/site-v1-after-multistorey-1440x1100.png) | [V2](reference/site-redesign-v2/v2-multistorey-idle-1440x1100.png) |
| Dois pisos, vista superior e separada | [V1](reference/site-redesign-v1/site-v1-after-exploded-1440x1100.png) | [V2 superior](reference/site-redesign-v2/v2-multistorey-upstairs-1440x1100.png), [V2 separada](reference/site-redesign-v2/v2-multistorey-exploded-1440x1100.png) |
| Cena isolada | [V1](reference/site-redesign-v1/site-v1-after-canvas-1440x1100.png) | [V2](reference/site-redesign-v2/v2-after-canvas-1440.png) |
| Caso concluído | [V1](reference/site-redesign-v1/site-v1-after-case-closed-1440x1100.png) | [V2](reference/site-redesign-v2/v2-case-closed-1440x1100.png) |
| Caso concluído, 390 × 844 | [V1](reference/site-redesign-v1/site-v1-after-case-closed-390x844.png) | [V2](reference/site-redesign-v2/v2-case-closed-390x844.png) |

O índice completo de capturas desta V2 está em [reference/site-redesign-v2](reference/site-redesign-v2). Inclui entrada, biblioteca e jogo em seis larguras; pessoa selecionada, ocupação, conflito, localizador de pistas, ajuda, notas, temas claro e escuro, revisão de pistas e caso concluído. As duas capturas do caso concluído foram feitas depois de resolver *Midnight Delivery* na aplicação, não apenas com dados simulados.

O recorte isolado foi retirado do canvas de *Midnight Delivery* a 1 440 × 1 100. A área atribuída ao canvas é diferente na V2, por isso uma comparação píxel a píxel sem normalização não seria válida. A maquete mostra as mesmas divisões, móveis e ângulo; a verificação decisiva é que a diferença Git face ao SHA de origem não contém qualquer ficheiro de `src/scene3d/`, `src/data/cases/`, modelos Kenney, solucionador, gerador, pistas ou soluções.

## Verificação funcional

No navegador, testei a abertura de casos, seleção de pessoas, colocação, marcação, anulação, repetição, limpeza, ajuda, conflito, localizador de pistas, notas e respetiva persistência, alternância de pisos, contexto fantasma, vista explodida, submissão incompleta, submissão correta, fecho, revisão de pistas e abertura do caso seguinte. O teste da conclusão resolveu *Midnight Delivery* e confirmou Priya como culpada, Owen como vítima, Living Room como local, 01:20 de tempo e três ajudas usadas. A pesquisa, os modos de jogo e a alternância entre temas também foram verificados.

O conjunto automático terminou com 445 testes aprovados, cinco ignorados e nenhum erro. `npm run lint`, `npm run build`, `npm run validate:production` e `git diff --check` passaram. A compilação executa `tsc -b`, que é a verificação de tipos deste projeto; não existe uma tarefa autónoma chamada `typecheck`. A validação de produção aceita os 60 casos, as cenas 3D e os modelos catalogados.

## Limites atuais

A interface continua a mostrar termos ingleses porque o produto original usa inglês. A maquete da entrada é uma imagem estática recortada, não uma pré-visualização interativa. A revisão visual cobriu os tamanhos pedidos, mas não todos os dispositivos físicos nem todas as combinações de ampliação do navegador. A comparação da cena prova a imutabilidade do código e a coerência visual; não promete identidade de píxeis após mudar o tamanho do canvas.
