# Auditoria da interface anterior ao redesenho

Data: 24/09/2026  
Base aprovada: `aa384c2f69ab6168786abccf04f713ad3ae24a58`  
Ramo: `sol/site-redesign-v1`

## Âmbito e método

Inspecionei a aplicação real no navegador, com o renderizador 3D ativo, antes de alterar código. Percorri a entrada, a biblioteca, casos de um e dois pisos, seleção, ocupação, conflito, pista, localização de indícios, notas, mudança de piso, vista fantasma, vista explodida e fecho de caso. Comparei 1 440 × 1 100 e 390 × 844. As capturas originais estão em [`reference/site-redesign-v1/`](reference/site-redesign-v1/).

A cena 3D é o melhor elemento visual do produto. A nova interface deve enquadrá-la e tornar mais fácil o raciocínio do jogador. A grelha plana usada na pré-visualização da página inicial pertence a uma apresentação anterior do jogo e não serve de referência estética para as cenas atuais.

## Problemas observados

| Área | Observação no navegador | Consequência |
| --- | --- | --- |
| Página inicial | A pré-visualização plana ocupa a zona de maior destaque; o texto introdutório e o caso do dia ficam pequenos. | O jogador recebe uma promessa visual diferente da experiência 3D real. |
| Biblioteca | O seletor de modo, a pesquisa e uma grelha de cartões semelhantes ocupam toda a largura; sobra muito espaço vazio em baixo. | É difícil distinguir o caso seguinte, o progresso e os casos concluídos. |
| Cabeçalho do caso | Título, dificuldade e progresso têm pouca escala; a barra de continuidade usa quase toda a largura logo antes da cena. | A hierarquia começa por elementos secundários e atrasa a chegada à cena. |
| Cena e painel lateral | A cena é forte, mas cartões de suspeitos com rasgos de papel, notas permanentes, várias molduras e um botão amarelo largo disputam a atenção. | A interface parece uma coleção de módulos em vez de um espaço de investigação. |
| Tipografia | Texto de pistas e comandos usa frequentemente 10 a 11 px e espaçamento de letras excessivo. | A leitura prolongada exige esforço, sobretudo em ecrãs pequenos. |
| Continuidade | A barra superior repete estados já presentes nos cartões; em 390 px passa a uma faixa horizontal extensa. | Consome altura e não torna imediatamente clara a pista da pessoa selecionada. |
| Ferramentas | Colocar, marcar, desfazer, refazer, limpar, pista, decorar e submeter aparecem em grupos de peso semelhante; submeter é o elemento mais forte mesmo com 0/4. | As ações de uso frequente perdem prioridade e o botão final sugere prematuramente que o caso está pronto. |
| Notas | A caixa de notas permanece aberta, mesmo vazia, antes das ações no fluxo móvel. | Ocupa espaço sem ajudar a próxima decisão; o texto guardado precisa de continuar visível quando o utilizador abrir o caderno. |
| Dois pisos | Piso térreo e andar superior têm botões de meia largura; vistas fantasma e explodida têm texto muito menor. | Os quatro comandos parecem ter naturezas diferentes e a distinção entre piso e modo de visualização não é suficientemente clara. |
| Telemóvel | A cena surge cedo, mas a continuidade, todos os suspeitos e as notas empurram as ferramentas para várias deslocações abaixo. | Selecionar, atuar e voltar à cena torna-se cansativo. |
| Caso encerrado | Resultado e ações surgem numa coluna de cerca de 320 px, isolada no centro de um ecrã largo. | O fecho não tem a presença nem a clareza de uma recompensa editorial. |
| Acessibilidade | Existem alvos táteis e controlos semânticos, mas alguns metadados e pistas são demasiado pequenos; os estados desativados e o foco precisam de verificação visual sistemática. | A estética prevalece por vezes sobre leitura e descoberta da ação. |

## Estados e comportamento já verificados

A seleção de suspeitos, colocação, marcação X, desfazer, refazer, limpar com confirmação, pistas, avisos de conflito, localização de indícios, persistência local das notas, mudança de piso, vistas fantasma e explodida, submissão incompleta, fecho de caso e passagem ao caso seguinte funcionam na base. A navegação por setas e Enter/Espaço no tabuleiro também funciona. Estas são regressões a vigiar durante o redesenho, não funcionalidades a reinventar.

## Direções a comparar

**A. Evolução do arquivo:** mantém a mesa escura e o âmbar atuais; reduz rasgos, caixas e texto decorativo. É a mudança mais segura, mas pode conservar a sensação de painel de protótipo.

**B. Mesa de investigação editorial:** mantém o fundo escuro junto da maquete e usa uma folha clara, contínua e legível apenas para pessoas e pistas. O progresso torna-se compacto; a sequência, as ferramentas e o caderno passam a ter posições e pesos definidos pela tarefa. A página inicial mostra uma imagem da maquete real. Tem maior potencial para unir identidade e clareza.

**C. Arquivo claro integral:** coloca toda a aplicação num fundo de papel. Facilita leitura, mas enfraquece a transição para o fundo escuro da cena e exige mais molduras à volta do tabuleiro. Só vale explorar se A e B falharem visualmente.

Vou comparar A e B em ecrãs reais, incluindo um telemóvel, e escolher pela leitura das pistas, destaque da cena e facilidade de ação. Nenhuma direção altera `src/scene3d/`, a câmara ou os dados dos casos.
