# Evidência visual da expansão Kenney v2

Capturas reais do laboratório de desenvolvimento, obtidas em 24/09/2026. O ramo parte de `aa384c2f69ab6168786abccf04f713ad3ae24a58`. As imagens mostram modelos oficiais em composições experimentais. Nenhuma vinheta é um caso de produção ou uma aprovação automática dos recursos.

O laboratório usa uma cena Three.js isolada com a mesma família de câmara ortográfica, ângulo de 32°, luz hemisférica e direcional, sombras PCF e ausência de mapeamento tonal do jogo. O adaptador de materiais conserva os mapas de cor para os novos pacotes. Por isso, estas capturas demonstram o aspeto no laboratório, mas não provam que o renderizador de produção, que hoje descarta esses mapas, produz os mesmos píxeis.

| Captura | O que mostra | Leitura visual |
| --- | --- | --- |
| [Referências canónicas](kenney-v2-references.png) | Furniture Kit, Nature Kit, figura e bolo do Food Kit à escala nativa. | O bolo ocupa uma fração excessiva da mesa canónica. |
| [Comparador Food Kit](kenney-v2-comparator-food.png) | Dois plintos de medida, original e adaptação experimental, com régua e figura. | A escala precisa de ser decidida por família e por superfície de apoio. |
| [Casa suburbana](kenney-v2-suburban.png) | Casa, caminho, vedação e Nature Kit. | Terreno e vegetação coerentes; edifício demasiado pequeno para a figura. |
| [Café nativo](kenney-v2-cafe-native.png) | Food Kit a 1,00× sobre mobília Furniture Kit. | Bolo e louça grandes demais; composição pouco convincente como café completo. |
| [Café adaptado](kenney-v2-cafe-adapted.png) | Food Kit a 0,30×, com o resto da cena intacto. | Os adereços passam a caber nas mesas; a família precisa de um adaptador de escala documentado. |
| [Loja de bairro](kenney-v2-market.png) | Duas prateleiras, arca e caixa registadora Mini Market. | Mobiliário legível; faltam balcão de apoio, paredes e prova de circulação com pessoas. |
| [Cemitério](kenney-v2-graveyard.png) | Jazigo, quatro campas, caminho, vedação e vegetação. | A vinheta exterior mais coerente; monumentos altos exigem revisão de oclusão. |
| [Fábrica](kenney-v2-industrial.png) | Factory Kit junto de City Kit (Industrial). | A grua domina a cena e oculta área jogável; edifício e maquinaria não partilham escala útil. |
| [Fachada comercial](kenney-v2-commercial.png) | Edifício completo e passeio. | Volume pequeno perante a figura, sem interior em corte. Serve, no máximo, como contexto distante. |
| [Estrada](kenney-v2-roads.png) | City Kit (Roads) junto de Retro Urban Kit. | As peças e texturas não formam uma frente urbana contínua. Combinação rejeitada. |
| [Acampamento](kenney-v2-survival.png) | Tenda, cama de campanha e fogueira Survival Kit. | A tenda é pequena perante a figura; faltam abrigo e vegetação para uma cena de caso. |
| [Cabana sazonal](kenney-v2-holiday.png) | Componentes Holiday Kit e boneco de neve. | A cabana montada não tem volume credível e o boneco de neve compete com a figura. |
| [Building + Modular](kenney-v2-building-modular.png) | Dois sistemas de edifício no mesmo plano. | A parede Building Kit é desproporcional perante a casa Modular; não devem ser combinados sem arquitetura própria. |
| [Cemitério móvel, 390 × 844](kenney-v2-mobile-cemetery.png) | A mesma vinheta num telemóvel. | Formas principais reconhecíveis, mas detalhes pequenos; a aprovação de um caso exigiria prova com pessoas e sobreposições. |
| [Café móvel, 390 × 844](kenney-v2-mobile-cafe-adapted.png) | Food Kit adaptado no telemóvel. | A cena cabe, mas a leitura dos adereços é limitada nesta largura. |

Os nomes dos modelos, dimensões, hashes e fichas oficiais constam do [relatório de medição](../../reports/kenney-lab-measurements.json) e do [manifesto do laboratório](../../../src/lab/data.json). O [relatório principal](../../KENNEY_ENVIRONMENT_EXPANSION_V2.md) contém a classificação final e as restrições de produção.
