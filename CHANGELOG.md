# Changelog - Sige Saúde

Todas as alterações notáveis neste projeto serão documentadas neste ficheiro.
O formato baseia-se no [Keep a Changelog](https://keepachangelog.com/).

### Melhorias de Interface e UX (Hub de Contratos)
- **Hub Centralizado:** Eliminação das sub-abas de navegação. A tela principal de Contratos agora exibe a árvore completa e aninhada (Processos > Atas > Contratos).
- **Dashboard e KPIs:** Adicionado painel superior dinâmico no Hub com contagem de contratos ativos, volume financeiro contratado e alertas de vencimento para os próximos 60 dias.
- **Barra de Progresso Visual:** Contratos agora exibem uma barra gráfica indicando o tempo de vigência percorrido.
- **Ficha de Impressão:** Adicionado botão para gerar a "Ficha de Acompanhamento de Contrato" formatada especificamente para impressão física (`@media print`).
- **Edição Protegida:** Nova interface de edição de contratos que bloqueia alterações na origem do documento (Ata/Processo) e recalcula as travas matemáticas de limite financeiro.

## [v0.3.0] - Março 2026
### Adicionado
- **Novo Módulo: Contratos:** Criação da estrutura base do módulo (Backend e Frontend) para gestão da Lei de Licitações.
- **Processos Licitatórios:** Criado o CRUD de Processos Administrativos (Pregões, Dispensas, Inexigibilidades, etc.) com tabelas, modelos, rotas e controladores.
- **Frontend de Processos:** Criadas as telas React `Index.jsx` (Listagem com status visual) e `Create.jsx` (Formulário completo).
- **Sidebar Atualizada:** Adicionado o link para "Processos Licitatórios" dentro do menu Acordeão de Contratos no `AuthenticatedLayout.jsx`.
- **Base de Dados:** Criadas as migrações em cascata para `processos` e `contratos` (preparando o terreno para Atas e Aditivos).

### Alterado / Refatorado (Regra de Negócio)
- **Hierarquia de Contratos:** Refatoração completa da base de dados para respeitar a Lei de Licitações. O fluxo agora é: `Processo Licitatório -> Ata de Registro de Preços (ARP) -> Contrato Firmado`.
- **Travas Matemáticas (Backend):** Implementação de bloqueios rígidos no Backend:
  - A soma das Atas não pode ultrapassar o `valor_total_licitado` do Processo.
  - O `valor_global` do Contrato não pode ultrapassar o valor teto da sua respetiva Ata.
- **Processos Licitatórios:** Adicionado o campo `valor_total_licitado` à base de dados e ao formulário de criação.
- **Auto-preenchimento (UX):** A tela de Contratos agora auto-preenche o Fornecedor com base na Ata de Registro de Preços selecionada.

## [v0.2.0] - Março 2026
*(Mantenha o resto que já lá estava...)*
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
