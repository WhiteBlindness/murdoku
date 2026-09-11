# Projeto residencial do piso superior V3

Data: 11/09/2026. Estado: proposta em revisão, sem aprovação visual.
Base: `bb2e8413129e52412d2ad77558025849e2fc1a9c`.
Ramo autorizado: `astra/multistorey-residential-design-v3`.

## Diagnóstico da imagem V2

A inspeção de `reference/multistorey-v2/v2-release-upper-rooms.png` confirma
que a guarda do vão expõe a cama, o escritório parece um cubículo, a casa de
banho tem área excessiva e a planta ocupa a frente utilizável da poltrona.
O percurso descrito nos dados não basta para dar hierarquia residencial à planta.

## Primeira proposta Astra

As coordenadas seguintes são hipóteses de autoria, em células, com máximos
exclusivos. A segunda passagem crítica e a medição física precedem a implementação.

1. **Funções e utilizadores:** quarto de um casal, escritório para trabalho
   individual, casa de banho partilhada, leitura e arrumação doméstica.
2. **Adjacências:** a escada chega a um patamar; um corredor a sul serve o
   átrio transversal; deste partem acessos independentes ao quarto, escritório,
   banho e leitura. Nenhuma divisão privada serve de passagem.
3. **Percurso:** preservar escada e vão `[2.65,0,5,2.6]`; estudar patamar
   `[5,0.05,5.85,1.1]`, corredor `[5.05,1.1,5.85,3.7]` e átrio
   `[0.05,3.7,7.95,4.65]`. Medir larguras entre faces acabadas.
4. **Portas:** usar a abertura com aro `kind: 'door'`. Entrada sul do quarto
   perto de x=1,8; entrada sul do escritório perto de x=6,9; entrada do banho
   a nordeste, por resolver na crítica; entrada norte da leitura perto de x=5,2.
5. **Privacidade:** parede opaca a este do quarto, prolongada até à sua parede
   sul. Paredes norte e este do banho interrompem a vista da chegada para os
   equipamentos. Verificar vários pontos do patamar e os limites completos
   da cama, banheira e sanita, sem assumir uma porta fechada.
6. **Proporções:** estudar quarto `[0,0,2.35,3.35]`, escritório
   `[5.9,0,8,3.65]`, banho `[0,5.2,3.15,8]` e leitura
   `[3.15,4.7,8,8]`. O banho passaria de cerca de 12,9 para 8,8 células².
7. **Banho:** banheira a oeste, sanita a sul e lavatório a norte; centro livre
   para utilização. A entrada não aponta diretamente para os equipamentos.
8. **Quarto:** cabeceira a oeste, acesso aos lados e aos pés da cama, uma mesa
   de cabeceira a norte e janela na fachada norte. Ajustar a cama só depois
   de fixar paredes e folgas; conservar as associações lógicas existentes.
9. **Escritório:** divisão fechada no canto nordeste; janela norte, secretária
   contra a parede oeste, cadeira voltada para a secretária e arrumação baixa.
10. **Leitura e arrumação:** poltrona voltada para o interior do conjunto,
    planta ao lado ou atrás, estante e apoio acessíveis. A faixa recuperada
    junto ao banho recebe arrumação de roupa, se houver profundidade útil.
11. **Áreas abertas:** apenas circulação, aproximações às portas e acesso
    ao mobiliário. Não mobilar o corredor nem preencher folgas com decoração.
12. **Pegada:** conservar a laje existente. Os equipamentos lógicos nos
    extremos sudoeste e sudeste não justificam uma retração artificial.

## Questões para a segunda passagem Astra

- Resolver a inconsistência da primeira proposta entre porta norte e porta
  este do banho, com prova de privacidade e percurso contínuo.
- Confirmar contacto da secretária com a célula lógica na coluna 5.
- Confirmar que a parede oeste do escritório não oculta a chegada da escada.
- Medir folgas da cama e da mesa de cabeceira, sem sacrificar conforto aos testes.
- Alinhar o revestimento do banho com o perímetro arquitetónico.
- Verificar posições jogáveis atrás das paredes completas.

Os testes aprovados da V2 são a referência técnica inicial: 18 testes de
composição e escadas passaram antes de qualquer alteração da cena.
O solucionador, gerador, esquema, renderizador e validadores estão protegidos.

## Segunda passagem Astra e decisão de protótipo

A crítica independente não aprovou a primeira planta como resultado final.
Uma simulação em memória isolou os volumes e encontrou 18 posições ocultas.
A parede completa do escritório também pode interceptar o raio da câmara
para o último degrau. Essa simulação não incluía a circulação e não foi
apresentada como validação integral.

O estudo seguinte fica autorizado apenas para medição e inspeção:

- Quarto com paredes este em x=2,4 e sul em z=3,4; cama em z=2,05 e mesa de
  cabeceira em z=1,1. A folga física nos pés aproxima-se de 0,71 unidades.
- Escritório com quatro limites e porta sul. A parede oeste usa o recorte
  isométrico normal, com 0,6 unidades, para testar a leitura da escada. A
  secretária fica apoiada a oeste; a cadeira deve alinhar com o posto de trabalho.
- Banho de 3 × 3 células, com revestimento coincidente, entrada norte e três
  equipamentos. Medir ocultações e linhas de visão antes de aceitar as paredes.
- Leitura aberta ao átrio, sem inventar outra divisão fechada. A planta fica
  lateral ao assento. Não prometer um roupeiro numa faixa sem profundidade.
- Guarda este do vão independente da parede do escritório. Preservar a
  proteção junto à cabeça da escada e a sua aproximação física.

Antes da alteração da cena, os três testes novos de privacidade falharam na V2,
como esperado: cama, banheira e sanita têm vistas diretas da chegada. O ensaio
usa vários pontos no patamar, duas alturas e nove alvos por equipamento. Mede
paredes visíveis, incluindo os intervalos das guardas, e não presume portas
fechadas. Este ensaio complementa a inspeção das imagens; não a substitui.
