# Ajustes à interface após a avaliação do proprietário

## Direção visual

O invólucro do jogo tem agora dois temas completos. No escuro, o fundo passa gradualmente do azul-noite ao violeta e regressa a um tom escuro neutro. No claro, passa do papel quente a um cinzento-violeta subtil e a um verde-azulado muito suave. O coral e o verde-petróleo continuam a assinalar ações e progresso. Estes tons acompanham a madeira, as paredes quentes e a vegetação dos cenários Kenney, sem lhes disputar a atenção.

A referência visual enviada pelo proprietário serviu para avaliar contraste, escala e simplicidade. Não foram copiados componentes, ilustrações ou uma disposição de página alheia.

## Alterações

- A imagem da casa na capa passou a ter transparência e deixou de aparecer dentro de um retângulo bege. O recorte foi criado a partir da imagem de apresentação que já existia no projeto. É apenas uma imagem de capa; não substitui o canvas de nenhum puzzle.
- Os fundos e textos da capa, da lista de casos, do espaço de jogo e do ecrã de conclusão respondem ao tema escolhido. A preferência do sistema continua a funcionar na ausência de uma escolha explícita.
- É possível mudar de tema na capa, na lista de casos, no cabeçalho do jogo em computador, no menu do jogo em telemóvel e no ecrã de conclusão.
- Os controlos dos pisos, as opções de visualização e as legendas junto dos suspeitos usam cores legíveis nos dois temas.
- O recorte da capa adapta-se ao espaço disponível sem criar deslocamento horizontal. Os alvos interativos mantêm pelo menos 44 px de altura.

## Verificação

Inspeção visual em 390 × 844, 430 × 932, 768 × 1024, 1280 × 800, 1440 × 1100 e 1920 × 1080. Foram observados a capa, a lista de casos, um puzzle de um piso e um puzzle de dois pisos, nos temas claro e escuro. Nos tamanhos inspecionados, não se verificou deslocamento horizontal da página. A cena continua a ser o elemento mais forte no espaço de jogo.

`npm run build`, `npm run lint` e 50 testes focados na capa, no jogo, nos controlos de pisos e no ecrã de conclusão passaram. O `src/scene3d/`, a geometria dos casos, as pistas, o solucionador e o gerador não fazem parte desta alteração. O canvas conserva a sua geometria e os seus materiais; o fundo da página visível à sua volta acompanha o tema.

As capturas da primeira versão do redesenho e a comparação do canvas com a referência aprovada estão em `docs/reference/site-redesign-v1/`. Esta revisão foi inspecionada novamente no browser em ambos os temas.
