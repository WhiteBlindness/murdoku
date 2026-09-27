# Murdoku

Puzzle de dedução criminal: usa as pistas para colocar suspeitos e vítima numa planta da casa, e identifica quem fica a sós com a vítima.

**Estado:** *Live*. A demonstração publicada apresenta o nome **Alibi**; o repositório continua a chamar-se Murdoku.

[**Abrir a demonstração**](https://murdoku-seven.vercel.app) · [**Consultar o código**](https://github.com/WhiteBlindness/murdoku)

## Porque existe

O jogo transforma pistas textuais e relações espaciais num problema de lógica verificável. Cada pessoa ocupa uma linha e uma coluna; as pistas restringem as posições até existir uma única disposição válida. O jogador marca células impossíveis, testa hipóteses e apresenta uma acusação.

## Como funciona

O catálogo define 60 casos em seis níveis de dificuldade, desde grelhas de 6×6 até cenários com dois pisos. O motor pode gerar casos de forma determinística a partir de uma semente ou carregar casos escritos à mão. Antes de apresentar um puzzle, o solver verifica se a solução é única.

## Destaques de engenharia

- **Motor separado da interface:** tipos, pistas, geração, solver e catálogo vivem em TypeScript puro em `src/core`; React apresenta o estado do jogo.
- **Geração validada:** o gerador constrói uma solução, cria pistas verdadeiras e usa um solver de retrocesso para rejeitar puzzles ambíguos.
- **Catálogo estável:** sementes e identificadores consistentes permitem guardar o progresso e reutilizar puzzles após recarregar a página.
- **Jogo offline:** a aplicação é instalável como PWA e guarda o progresso no dispositivo.

## Arquitectura

```text
src/core/       tipos, motor de pistas, solver, gerador e catálogo
src/hooks/      estado do jogo e tema
src/components/ grelha, pistas, suspeitos e ecrãs do jogo
src/styles/     variáveis e temas visuais
```

A interface React consome o motor sem conter as regras de dedução. Esta separação permite testar a lógica sem renderizar componentes.

## Tecnologias

TypeScript · React · Vite · Vitest · Vite PWA

## Executar localmente

Requer Node.js e npm.

```bash
npm install
npm run dev
```

Para criar a versão de produção e pré-visualizá-la localmente:

```bash
npm run build
npm run preview
```

## Testes

```bash
npm test
npm run test:coverage
npm run lint
```

O teste dedicado ao catálogo é `npm run verify`.
