# Redesenho de habitabilidade do catálogo

Registo de progresso durável. Serve para retomar o trabalho depois de uma interrupção sem repetir casos já feitos.

## Critério

Pergunta de aceitação para cada piso: **«Isto lê-se como um edifício plausível e habitado?»** Uma cena válida, jogável e sem colisões não chega, se as divisões não fizerem sentido arquitetónico ou doméstico.

Rubrica partilhada (11 pontos, igual para todos os operadores):

1. **Função da divisão:** cada divisão parece aquilo que diz ser. Não está vazia nem atulhada ao acaso.
2. **Casas de banho:**
   - fechadas, com porta;
   - sanita, lavatório e banheira ou duche encostados às paredes;
   - sem circulação através das peças sanitárias.
3. **Cozinhas:**
   - zona de trabalho coerente, com frigorífico, fogão, lava-loiça e bancadas em linha, em L ou em triângulo;
   - ligação lógica à sala de jantar ou à zona de serviço.
4. **Quartos:**
   - cama com a cabeceira contra uma parede;
   - mesa de cabeceira, se o vocabulário o permitir;
   - circulação à volta da cama;
   - nenhuma cama solta no meio da divisão.
5. **Salas de estar:** os assentos viram-se para um foco (televisão ou tapete). O conjunto lê-se como zona de conversa.
6. **Salas de jantar:**
   - mesa com cadeiras utilizáveis, viradas para a mesa;
   - relação com a cozinha.
7. **Escritórios:**
   - secretária com cadeira, se o vocabulário o permitir;
   - zona de leitura nos escritórios grandes;
   - nunca uma secretária isolada num espaço enorme.
8. **Circulação:**
   - as portas levam a sítios sensatos;
   - nada bloqueia portas nem percursos;
   - nenhum objeto decorativo esconde células do tabuleiro.
9. **Zonamento:**
   - zonas públicas, de serviço e privadas coerentes;
   - acesso plausível às casas de banho.
10. **Divisões grandes:** salas de 16 a 24 células não ficam com 3 a 6 peças soltas.
11. **Semântica do puzzle (obrigatório):**
    - nunca mudar culpado, vítima, pistas, solução, divisões lógicas ou peças `logic`;
    - nunca acrescentar decoração cujo modelo possa representar um tipo do vocabulário de pistas do caso;
    - as exceções ficam documentadas no relatório do caso.

## Controlos por caso

- **Validador de cenas:** 0 erros em todos os pisos. Os avisos `cell-hidden` não aumentam face à base, e nenhuma célula da solução fica escondida.
- **Verificação de semântica:**
  - compara as peças `logic` de cada cena com o commit aprovado `db52ce4` e exige o mesmo conjunto;
  - recusa decoração nova de um tipo presente no vocabulário de pistas do caso.
- **Revisão visual pelo responsável:** imagem da casa sem pessoas e com a solução colocada, julgada pelos 11 pontos.

## Ordem final

Redesenho de habitabilidade → testes, lint, build e validação de produção completos → captura nova dos 60 casos (computador e telemóvel) → revisão independente em contexto limpo (dois revisores) → correções → nova captura das cenas afetadas → segunda revisão final → `FINAL_VISUAL_AUDIT.md` → arquivo e manifesto → Notion → descrição do PR.

As capturas `__after` anteriores a este redesenho são apenas histórico. Não servem de prova final.

## Estado por caso

Legenda:

| Estado | Significado |
| --- | --- |
| feito | Redesenho concluído, sem erros e com a semântica a passar. |
| em curso | Alterações parciais. |
| pendente | Ainda não foi iniciado. |
| commit | Integrado no ramo e publicado. |

| Nível | Caso | Estado | Notas |
| --- | --- | --- | --- |
| Very Easy | very-easy-1 a very-easy-8 | commit | Revisto. Exceções de vocabulário: very-easy-6 e very-easy-8 (`chair`). very-easy-1 e very-easy-2 são referências douradas; as imagens de referência têm de ser refeitas na captura final |
| Easy | easy-1 a easy-10 | commit | Revisto. Exceções de vocabulário: easy-1 sem mesa de pequeno-almoço, easy-10 com banco estofado. easy-1 é referência dourada |
| Medium | medium-1, medium-2 | feito | Revisto; medium-1: sala de jantar escassa porque `chair` é vocabulário de pista |
| Medium | medium-3 | em curso | |
| Medium | medium-4 a medium-12 | pendente | |
| Hard | hard-1 | feito | Revisto; a sanita encosta à parede sul, rebaixada pela câmara |
| Hard | hard-2 | em curso | |
| Hard | hard-3 a hard-12 | pendente | |
| Expert | expert-1 | feito | Revisão do responsável pendente |
| Expert | expert-2, expert-3 | em curso | |
| Expert | expert-4 a expert-10 | pendente | |
| Master | master-1, master-2 | em curso | |
| Master | master-3 a master-8 | pendente | |

Atualizado em 08/10/2026.
