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
