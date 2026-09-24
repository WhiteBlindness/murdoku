# Casos possíveis a partir do laboratório Kenney

> Propostas editoriais de 24/09/2026. São alvos para futuros casos completos, não puzzles implementados nem soluções validadas. O laboratório atual mostra apenas recursos e vinhetas.

## Contrato comum

Estes casos mantêm a câmara e a apresentação isométrica atuais: célula de 0,8 unidades Kenney, parede interior de 1,29, figuras à escala da referência e grelha invisível em repouso. Cada pessoa ocupa uma linha e uma coluna diferentes; só um suspeito partilha a divisão da vítima. As pistas usam exclusivamente os tipos existentes em `src/core/types.ts`. Os adereços de outros pacotes dão identidade ao lugar, mas só passam a ser alvos de pistas quando puderem ser associados, sem ambiguidade, a um tipo lógico já aprovado.

A arquitetura jogável deve continuar a ser uma casa de bonecas legível. Um edifício monolítico do City Kit (Suburban), com 0,83 unidades de altura na amostra medida, não pode substituir uma divisão onde uma figura de referência tem cerca de 0,95. Pode aparecer no fundo ou fornecer pormenores exteriores. Os módulos do Minigolf Kit medem aproximadamente 1,00 de lado, pelo que não devem ser forçados a coincidir com as células de 0,8. A cena compõe-os dentro de zonas maiores e mantém a grelha lógica independente.

## 1. O último buraco

**Situação:** o pequeno minigolfe de um bairro fecha depois de um torneio. O responsável pelo recinto é encontrado junto ao percurso do moinho. Estavam ainda presentes a funcionária da bilheteira, o técnico de manutenção, uma participante e o organizador. As pistas permitem reconstituir onde cada um estava no momento do crime. Não há regras de tacadas, movimento da bola ou percurso obrigatório.

**Formato proposto:** um piso, 8 × 8, cinco pessoas, perfil próximo de «Difícil». Quatro zonas lógicas amplas e retangulares, cada uma com 4 × 4 células: bilheteira e pequeno café no quadrante posterior esquerdo; oficina e arrecadação no posterior direito; percurso do moinho à frente à esquerda; percurso do túnel à frente à direita. O jogador vê uma entrada real, um balcão, o caminho pedonal entre os dois percursos e a pequena oficina. Os campos são locais, não a totalidade do cenário.

**Mistura de pacotes:** Minigolf Kit nos dois percursos (início, curvas, buracos, moinho, túnel, bandeira e uma bola por campo); Furniture Kit no balcão, mesa, cadeira, caixa e paredes da bilheteira; Nature Kit em grupos de arbustos e duas árvores na periferia; City Kit (Suburban) apenas em troços de vedação ou caminho cuja escala e união sejam verificadas. O moinho, com 1,56 de altura, fica no fundo do percurso para não esconder pessoas. As peças de minigolfe cabem em zonas de 3,2 × 3,2 unidades; o espaço restante tem de servir a circulação, não uma segunda linha de obstáculos.

**Dedução visual:** a vítima e o único suspeito na mesma zona estão no percurso do moinho. Uma caixa na oficina pode sustentar uma pista existente do tipo `besideFurniture`; um balcão na bilheteira pode sustentar `onFurniture` ou `besideFurniture` apenas depois de confirmada a associação física e lógica. Pistas sobre divisão, exclusão de divisão e direção entre pessoas podem ligar as duas metades do recinto. A posição de cada pessoa e a lista final de pistas ficam por escrever e provar com o solucionador; esta descrição não declara uma solução única.

**Critério de aprovação:** reconhecer de imediato o minigolfe como estabelecimento aberto ao público, com funcionários e zonas de serviço. Verificar que figuras, seleção e pistas continuam visíveis sobre os campos; corrigir o apoio da bola, cuja origem medida a deixa 0,03492 unidades abaixo do chão. Se os módulos taparem a passagem entre a bilheteira e a oficina, reduzir o número de módulos, não a escala das pessoas.

## 2. A casa depois da festa

**Situação:** numa moradia suburbana, a ceia de Natal terminou mal. Um convidado é encontrado no jardim junto à árvore iluminada. A cozinha ainda tem louça e a sala conserva as prendas. A disposição das pessoas, não a decoração, resolve o caso.

**Formato proposto:** um piso, 7 × 7, cinco pessoas, perfil «Médio». Quatro zonas: cozinha e copa atrás à esquerda; sala de jantar atrás à direita; entrada e estar à frente à esquerda; jardim e alpendre à frente à direita. A transição interior/exterior inclui fachada, soleira e terreno rebaixado segundo o manual. O alpendre dá uma saída plausível da casa para o jardim.

**Mistura de pacotes:** Furniture Kit constrói a casa, a mesa posta e a cozinha; Nature Kit forma o jardim; Holiday Kit fornece uma árvore decorada, um boneco de neve, uma lanterna e poucas prendas; City Kit (Suburban) fornece vedação e caminho de entrada, mas a casinha monolítica medida só pode aparecer fora da planta jogável, se ajudar o enquadramento. Um copo ou chávena do Food Kit pode ocupar uma superfície declarada depois de medido e adaptado; o bolo de 0,64 de largura não entra automaticamente numa mesa pequena. A árvore de Natal mede 2,29 de altura e fica no fundo do jardim, longe dos contornos de seleção.

**Dedução visual:** pistas de divisão, proximidade a mobiliário lógico e relações entre pessoas distinguem a sala, a entrada e o jardim. Uma prenda não passa a ser uma «caixa» lógica só por parecer uma caixa; essa associação exige teste de leitura e catálogo semântico explícito. A composição deve funcionar mesmo se as prendas forem puramente decorativas.

**Critério de aprovação:** a imagem tem de parecer uma casa habitada durante uma celebração, não uma aldeia de Natal pousada sobre a grelha. O jardim deve conservar um caminho claro, e os objetos altos não podem encobrir a vítima nem a pessoa que partilha a sua zona.

## 3. Fecho de caixa

**Situação:** uma loja de bairro está a fechar. A gerente é encontrada na zona de carga; três clientes e um empregado ainda não saíram. Há um cesto abandonado perto da caixa e produtos por arrumar. O jogador reconstrói os últimos lugares ocupados por cada pessoa.

**Formato proposto:** um piso, 8 × 8, cinco pessoas, perfil «Médio» ou «Difícil» a confirmar pelas métricas. Quatro zonas de 4 × 4 células: corredor de mercearia atrás à esquerda, armazém atrás à direita, entrada e caixas à frente à esquerda, zona de carga exterior à frente à direita. Portas ligam entrada, loja e armazém; uma segunda abertura serve a carga. A circulação deve permitir passar junto das prateleiras e do balcão sem atravessar volumes.

**Mistura de pacotes:** Furniture Kit dá o envelope, portas e superfície de balcão; Mini Market dá prateleiras, expositor de fruta, arca, cesto e carrinho; Nature Kit e City Kit (Suburban) podem dar uma árvore e pavimento exterior discretos na zona de carga. A personagem estática do Mini Market mede 0,72 de altura, abaixo da referência humana de 0,95, e por isso não substitui as figuras Murdoku. A caixa registadora amostrada tem 0,85 de largura e 0,59 de altura; não deve ser colocada sobre um balcão canónico sem medição de apoio.

**Dedução visual:** `besideFurniture` pode referir uma caixa lógica no armazém; `room`, `notRoom` e `direction` relacionam empregados e clientes. Os produtos e as prateleiras são adereços até haver associação semântica inequívoca. O carrinho não implica deslocação nem uma nova regra de pista.

**Critério de aprovação:** o jogador deve distinguir loja, caixa, armazém e carga à primeira vista. As prateleiras de 0,85 de altura ficam junto das paredes do fundo e não podem formar um ecrã opaco à frente das pessoas. Confirmar em 390 px que a zona de carga é jogável e que a janela conserva a transparência.

## Ordem de produção proposta

1. **O último buraco:** melhor oportunidade de criar um lugar novo com os recursos já medidos. O protótipo atual precisa de arquitetura e narrativa, não de mais obstáculos.
2. **Fecho de caixa:** mistura de pacotes contida e função de cada área muito clara. Exige sobretudo circulação e apoio correto das peças grandes.
3. **A casa depois da festa:** maior potencial visual sazonal, mas a árvore, o telhado e a escala da arquitetura exigem mais prova de oclusão.

Antes de converter qualquer proposta em caso, criar um lote `opus/*` a partir de um SHA de produção aprovado. Escrever solução e cadeia dedutiva, provar unicidade, completar a cena com modelos medidos e validar a jogabilidade. A passagem dos materiais texturados dos novos pacotes ao renderizador de produção ainda exige uma «SYSTEM ESCALATION» separada; este documento não a autoriza. Nenhuma cena existente deve ser alterada para demonstrar estes conceitos.
