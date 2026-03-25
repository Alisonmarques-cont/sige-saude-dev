# Changelog - Sige Saúde

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.
O formato baseia-se no [Keep a Changelog](https://keepachangelog.com/).

## [v0.2.0] - Março 2026
### Adicionado
- **Landing Page (Welcome.jsx):** Nova página inicial moderna com apresentação do sistema e links para Login/Registo.
- **Módulo Financeiro - Lançamentos:** Reformulação completa da criação de Lançamentos de Modal para uma Tela Cheia (`Create.jsx`) dividida em abas lógicas (Dados Básicos, Gestão/Empenho, Financeiro, Pagamento).
- **Módulo de Cadastros (Frontend):** Criação da pasta `Cadastros` no React para alinhar a experiência do utilizador (UI) com a arquitetura mental, recebendo a tela de Programas de Saúde.
- **Programas de Trabalho:** Novo CRUD completo para gerir Blocos de Financiamento e Portarias.
- **Database Seeder:** Adicionado utilizador mestre padrão (`admin@sigesaude.com`) ao rodar as migrações.

### Alterado/Corrigido
- Refatoração do ficheiro `Index.jsx` de Configurações, separando cada aba (Entidade, Usuários, Plano de Contas) em componentes individuais na pasta `Partials/`.
- Correção de Namespace: Removida a pasta `App\` redundante dos *use statements* no ficheiro de rotas do módulo Financeiro para obedecer ao padrão do `nwidart/laravel-modules`.
- Ajuste na ordem das *migrations* (Plano de Contas agora é criado antes de Lançamentos) para evitar o erro `150 Foreign key constraint is incorrectly formed`.

## [v0.1.0] - Versão Inicial
### Adicionado
- Setup da arquitetura base (Laravel + React + Inertia + Tailwind).
- Estrutura de Módulos (Configurações, Dashboard, Financeiro).
- Autenticação configurada via Laravel Breeze.
- Gestão de Entidade, Utilizadores e Contas Bancárias.
