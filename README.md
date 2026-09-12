# Angular Enterprise Dashboard

Dashboard administrativo corporativo construído como projeto de portfólio, demonstrando uma arquitetura Angular moderna, escalável e alinhada a práticas usadas em times de frontend enterprise.

## Visão geral

Aplicação de gestão de usuários com autenticação, autorização baseada em papéis (RBAC), indicadores visuais e uma tabela de dados completa (busca, filtros, ordenação e paginação server-side simulada). Toda a camada de API é consumida via `HttpClient`, com uma **API REST simulada** (interceptor) para que o projeto rode de forma independente, sem exigir um backend real.

## Tecnologias

| Categoria | Stack |
| --- | --- |
| Framework | Angular 20 (standalone components, lazy loading por rota) |
| Linguagem | TypeScript (modo `strict`) |
| UI | Angular Material (Material 3 theming, light/dark) |
| Estado & reatividade | Signals + RxJS (`combineLatest`, `switchMap`, `toSignal`) |
| Formulários | Reactive Forms com validação |
| Autenticação | JWT simulado (decodificado no client), sessão persistida em `localStorage` |
| Autorização | Guards funcionais (`authGuard`, `roleGuard`) baseados em `route.data.roles` |
| HTTP | Interceptors funcionais: anexar token, tratamento global de erros, mock da API REST |
| Gráficos | Chart.js |
| Testes | Jest + jest-preset-angular |

## Funcionalidades

- **Login** com formulário reativo, validação e contas de demonstração (um clique preenche o formulário).
- **Sessão JWT**: token decodificado no cliente, expiração verificada e logout automático em `401`.
- **RBAC**: três papéis (`ADMIN`, `MANAGER`, `VIEWER`) controlam o menu lateral, as rotas (`configuracoes` é exclusiva de `ADMIN`) e as ações de CRUD na tela de usuários (criar/editar exigem `ADMIN`/`MANAGER`; remover exige `ADMIN`).
- **Dashboard**: cartões de indicadores e gráficos (linha e rosca) alimentados por uma API mock.
- **Usuários**: tabela com busca por nome/e-mail, filtro por papel e status, ordenação por coluna e paginação — tudo delegado à "API" (parâmetros de query), como em um backend real.
- **Tratamento global de erros**: interceptor centraliza mensagens de erro (`401`, `403`, erros genéricos) exibidas via `MatSnackBar`.
- **Tema claro/escuro**: alternância persistida em `localStorage`, usando os tokens de sistema do Material 3 (`--mat-sys-*`), garantindo contraste correto de textos e ícones em ambos os temas.

## Contas de demonstração

| Papel | E-mail | Senha |
| --- | --- | --- |
| Admin | `admin@dashboard.com` | `admin123` |
| Gestor | `gestor@dashboard.com` | `gestor123` |
| Visitante | `visitante@dashboard.com` | `visitante123` |

## API simulada

Não há backend real: um `HttpInterceptor` funcional (`mock-api.interceptor.ts`) intercepta chamadas para `/api/**`, aplica latência artificial e reproduz o comportamento de uma API REST (autenticação, paginação, filtros, ordenação, RBAC em escrita/remoção, códigos de erro HTTP). Isso mantém os serviços (`AuthService`, `UserService`, `DashboardService`) e os componentes exatamente como seriam contra uma API real — trocar o mock por um backend HTTP de verdade não exige alterar a camada de serviços.

## Como rodar

```bash
npm install
npm start        # http://localhost:4200
npm run build    # build de produção em dist/
npm test         # testes unitários (Jest)
npm run test:coverage
```

## Estrutura

```
src/app/
├── core/            # models, services, guards, interceptors, mocks e utilitários
├── layout/shell/     # casca do dashboard (sidenav, topbar, tema, menu do usuário)
├── shared/components # stat-card, chart-card, confirm-dialog (reuso entre features)
└── features/
    ├── auth/login
    ├── dashboard/{overview,users,settings}
    └── errors/{forbidden,not-found}
```
