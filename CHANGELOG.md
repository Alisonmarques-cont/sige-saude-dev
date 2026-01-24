Changelog

Todas as mudanças notáveis no projeto Sige Saúde serão documentadas neste arquivo.

[1.0.0] - 2024-05-20 (Versão Web Estável)

Adicionado

Arquitetura MVC: Implementação completa de padrão Model-View-Controller em PHP puro.

Roteador Personalizado: Sistema de rotas (Router.php) para URLs amigáveis e gestão de API.

Dashboard Dinâmico: Painel com resumo financeiro, saldos por conta bancária e alertas de contratos.

Módulo Financeiro:

Gestão de Empenhos (Despesas) com vínculo a contratos ou compra direta.

Gestão de Receitas por programa e conta bancária.

Consolidação de Compras Diretas por elemento de despesa.

Filtros de extrato por programa e período.

Módulo de Configurações:

Cadastro de Entidade com upload de logo (visual).

Gestão de Contas Bancárias da Entidade.

Cadastro de Programas/Fontes.

Cadastro de Fornecedores com múltiplas contas bancárias.

Módulo de Planejamento: Dashboard informativo com prazos legais do SUS (RAG, RDQA, PAS, PMS).

Relatórios: Geração de relatórios HTML (imprimíveis como PDF) para Extratos, Contratos e Notas de Empenho.

Alterado

Plataforma: Migração total de Desktop (Python/PyWebView) para Web (PHP 8.0+/MySQL).

Banco de Dados: Migração de SQLite para MySQL com relacionamentos e chaves estrangeiras (Foreign Keys).

Frontend: Substituição de chamadas pywebview por fetch API assíncrona.

Interface: Redesign completo com CSS moderno, Sidebar fixa e modais responsivos.

Removido

Dependência do Python e bibliotecas webview, sqlite3 (local).

Arquivos .py (main, data_manager, connection).

[0.5.0] - 2024-04-15 (Versão Desktop - Legado)

Funcionalidades

Aplicativo Windows rodando localmente.

Banco de dados SQLite único.

Geração de PDFs básicos via FPDF no Python.

Telas básicas de cadastro sem separação modular rígida.

# Changelog

Todas as mudanças notáveis no projeto Sige Saúde serão documentadas neste arquivo.

## [1.1.0] - 2025-12-14 (Refatoração Modular)

### Adicionado
- **Modularização de JavaScript:** Implementação de ES Modules nativos.
  - Criada camada `Core` (api.js, ui.js, utils.js) para funções globais.
  - Criada camada `Modules` (dashboard.js, financeiro.js, contratos.js, config.js) para lógica de negócio isolada.
- **Modularização de CSS:** Estrutura organizada em `base`, `layout`, `components` e `modules`, unificados via `main.css`.
- **Tratamento de Erros:** Mensagens amigáveis ao tentar excluir registros com dependências (ex: contas com saldo).
- **Campos:** Adicionado campo "Agência" no cadastro de contas bancárias de fornecedores.

### Alterado
- **Arquitetura de Views:** O arquivo monolítico `main.php` foi refatorado.
  - Criada pasta `Shared/Views` para componentes globais (Sidebar, Topbar).
  - Views específicas movidas para seus respectivos módulos (`Financeiro/Views`, `Contratos/Views`, etc.).
- **Frontend:** Substituição do `script.js` único por `main.js` modular.
- **Segurança:** Correção no hash de senha do usuário administrador padrão.

### Corrigido
- Bug que impedia a visualização correta de erros de SQL (Foreign Key Constraints) no frontend.
- Ajustes de layout na responsividade da sidebar.

---

## [1.0.0] - 2024-05-20 (Versão Web Estável)

### Adicionado
- Arquitetura MVC: Implementação completa de padrão Model-View-Controller em PHP puro.
- Roteador Personalizado: Sistema de rotas (`Router.php`) para URLs amigáveis e gestão de API.
- Dashboard Dinâmico: Painel com resumo financeiro, saldos por conta bancária e alertas de contratos.
- **Módulo Financeiro:**
  - Gestão de Empenhos e Receitas.
  - Consolidação de Compras Diretas.
- **Módulo de Configurações:** Cadastro de Entidade, Contas, Programas e Fornecedores.
- **Módulo de Planejamento:** Dashboard informativo (RAG, RDQA, PAS).
- Relatórios em HTML/PDF.

### Alterado
- Plataforma: Migração total de Desktop (Python) para Web (PHP/MySQL).
- Banco de Dados: Migração para MySQL com chaves estrangeiras.

## [0.5.0] - 2024-04-15 (Versão Desktop - Legado)
- Funcionalidades básicas em aplicação Windows local.