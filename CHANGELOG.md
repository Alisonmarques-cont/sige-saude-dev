# Changelog - Sige Saúde Modular

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.
O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [0.1.0-alpha] - Planeamento de Migração (Atual)
### Adicionado
- **Nova Arquitetura Padrão Ouro:** Decisão técnica de migrar o *core* do sistema para Laravel 11 (Backend) e React.js + Inertia.js (Frontend).
- **Redução de Escopo (MVP):** A versão 0.1 focar-se-á exclusivamente na refatoração e entrega dos módulos: `Dashboard`, `Financeiro` e `Configurações`. Outros módulos serão temporariamente removidos/congelados para garantir a excelência técnica.
- **Padrão Modular:** Adoção do pacote `nWidart/laravel-modules` para manter a separação por Domínios (DDD) no Backend.

## [0.0.5] - Fim do Ciclo Vanilla PHP (Legado Recente)
### Adicionado
- **Módulo Planeamento (Instrumentos de Gestão):** CRUD completo implementado com padrão de Responsabilidade Única (SRP).
- **Controladores Isolados:** Criação do `InstrumentosGestaoController` isolando a lógica da API REST do controlador principal da página.
- **UI/UX Aprimorada:** Implementação de Modal em Tela Cheia (Fullscreen Overlay) com CSS puro (BEM) para melhorar a usabilidade em ecrãs complexos.
- **JavaScript Reativo:** Módulo isolado `instrumentosgestao.js` utilizando Fetch API para renderização assíncrona, eliminando *refreshes* de página (SPA feeling).
- **Filtros Dinâmicos:** Adicionado filtro de ano com recarregamento em tempo real do Grid de *Cards*.

### Corrigido
- Correção de conflitos de rota na `apiFetch` (remoção da duplicação `/api/api`).
- Ajuste no envio de formulários via `FormData` nativo para garantir a correta leitura no PHP (`$_POST`).

