<div align="center">
	<img src="./src/assets/logo.svg" alt="CloudDrill" width="96" />

	# CloudDrill

	Simulador de quiz para preparação da certificacao AWS Certified Cloud Practitioner (CLF-C02).
</div>

CloudDrill e uma aplicacao web em React + TypeScript para treinar com perguntas de certificacao AWS, filtrando dominios e acompanhando desempenho por sessao.

> [!NOTE]
> O foco atual do projeto e o exame CLF-C02, com dataset local e execucao 100% no navegador.

## Destaques

- Sessao de pratica configuravel por quantidade de questoes (10, 20, 40 ou 65).
- Filtro por dominio do exame com distribuicao proporcional de perguntas.
- Feedback imediato por questao no modo pratica.
- Resultado final com score, tempo total e breakdown por dominio.
- Persistencia local (zustand + localStorage) para sessao e ultimo resultado.
- Testes de unidade e de componentes com Vitest e Testing Library.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand (estado global + persistencia)
- React Router 7
- Vitest + Testing Library

## Comecando Rapido

### Pre-requisitos

- Node.js 20+
- pnpm

### Instalacao

```bash
pnpm install
```

### Executar em desenvolvimento

```bash
pnpm dev
```

Aplicacao disponivel em `http://localhost:5173`.

## Scripts

```bash
pnpm dev            # inicia o servidor Vite
pnpm build          # type-check incremental + build de producao
pnpm preview        # preview do build local
pnpm lint           # analise com ESLint
pnpm format         # formatacao com Prettier
pnpm typecheck      # checagem de tipos sem emitir arquivos
pnpm test           # Vitest (modo interativo/watch)
pnpm test:watch     # Vitest em watch explicito
pnpm test:coverage  # gera cobertura (texto + lcov)
```

> [!TIP]
> Para execucao unica de testes em CI/local sem watch, use `pnpm vitest run`.

## Fluxo da Aplicacao

1. Usuario inicia em `/` e abre o modal de configuracao.
2. Seleciona quantidade de questoes e dominios desejados.
3. O app carrega perguntas de `CLF_002`, aplica filtro por dominio e sorteia o quiz.
4. Durante a sessao em `/quiz`, respostas sao registradas e validadas.
5. Ao finalizar, o resultado e calculado e exibido em `/resultado`.

## Estrutura do Projeto

```
src/
├──components/                 # componentes compartilhados (layout/ui/modal)
│  └──features/
│     ├──quiz/                 # UI e store da sessao do quiz
│     └──result/               # UI e store de resultado
├──data/                       # base local de perguntas (JSON)
│  └──clf_002_questions.json
├──lib/                        # funcoes de dominio (selecao, score, utilitarios)
├──routes/                     # roteamento principal da aplicacao
├──types/                      # contratos tipados de dominio
└──test/                       # testes de unidade e componentes
```

## Qualidade e Testes

- Cobertura configurada via `@vitest/coverage-v8`.
- Relatorio lcov gerado em `coverage/lcov-report/index.html`.
- Ambiente de teste: `jsdom` com setup em `test/setup.ts`.

## Estado Atual e Proximos Passos

- Exame suportado: CLF-C02.
- Banco local atual: 200 questoes em `src/data/clf_002_questions.json`.
- Modo simulado aparece como "Em breve" na UI inicial.

> [!IMPORTANT]
> Este projeto e uma ferramenta de estudo e nao substitui a documentacao oficial da AWS nem a prova oficial.
