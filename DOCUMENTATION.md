### 3. `DOCUMENTATION.md`
Este é o guia de bolso da Arquitetura para a sua equipa, detalhando como as coisas se conectam na nova estrutura.

```markdown
# Documentação Arquitetural - Sige Saúde v0.1

## 1. Visão Geral da Arquitetura
O Sige Saúde abandonou a estrutura "Vanilla MVC" em favor de um ecossistema robusto baseado no ecossistema Laravel. Utilizamos o padrão **Strangler Fig** (de forma estrutural) e aplicamos o **Domain-Driven Design (DDD)** através da segregação física de módulos.

## 2. A Comunicação: Inertia.js (A Ponte Mágica)
Não utilizamos chamadas `fetch()` manuais ou o Axios para desenhar a interface. O Inertia.js permite-nos retornar componentes React diretamente dos Controladores do Laravel.

**Exemplo de Fluxo:**
1. O utilizador acede a `/financeiro/empenhos`.
2. O Router aponta para o `EmpenhoController@index`.
3. O Laravel faz a *query* com Eloquent: `$empenhos = Empenho::all();`
4. O Controlador retorna: `return Inertia::render('Financeiro/Empenhos/Index', ['dados' => $empenhos]);`
5. O React recebe as `props` e desenha a tela de forma reativa (SPA).

## 3. Estrutura de Pastas (Onde encontrar as coisas)

A separação de interesses (SoC) é rígida:

* **O Core (`/app`):** Guarda lógicas globais. Modelos como `User.php` e *middlewares* de autenticação.
* **Os Módulos (`/Modules`):** Onde mora a regra de negócio real.
  * Exemplo: `/Modules/Financeiro/app/Controllers` e `/Modules/Financeiro/app/Models`.
  * As rotas de cada módulo ficam dentro de `/Modules/*/routes/web.php`.
* **O Frontend (`/resources/js`):** * `/Components`: Peças isoladas e reutilizáveis (Inputs, Modals, Buttons).
  * `/Layouts`: Os "esqueletos" da página (Sidebar + Topbar).
  * `/Pages`: As telas completas, espelhando a estrutura dos controladores (ex: `/Pages/Financeiro/Extrato.jsx`).

## 4. Padrões de Código e Regras (Code Guidelines)
1. **Migrations First:** NUNCA alterar o banco de dados via phpMyAdmin/DBeaver. Toda a alteração estrutural deve gerar um ficheiro `php artisan make:migration`.
2. **Controladores Magros, Serviços Gordos:** O Controller deve apenas validar requisições e devolver uma resposta (Inertia ou JSON). Regras de negócio complexas vão para classes de `/Services`.
3. **Componentização React:** Se um pedaço de HTML/JSX é repetido em mais de 2 ecrãs, ele DEVE ser extraído para `/resources/js/Components`.

## 5. raiz do projeto

/sige-saude-v2 (Raiz do Projeto)
├── app/                      # CORE DO LARAVEL
│   ├── Http/
│   │   └── Controllers/      # Controladores Globais (Ex: AuthController)
│   └── Models/               # Modelos Globais (Ex: User)
│
├── database/                 # BANCO DE DADOS CORE
│   ├── migrations/           # Aqui entrarão suas tabelas globais (usuarios, entidade)
│   └── seeders/
│
├── Modules/                  # 🌟 NOSSA ARQUITETURA DE BACKEND MODULAR
│   │
│   ├── Dashboard/            # MÓDULO 1
│   │   ├── app/Controllers/
│   │   └── routes/web.php
│   │
│   ├── Financeiro/           # MÓDULO 2
│   │   ├── app/
│   │   │   ├── Controllers/  # Ex: MovimentacaoController.php
│   │   │   ├── Models/       # Ex: Lancamento.php, ContaBancaria.php
│   │   │   ├── Repositories/ # Isolamento de Queries SQL (Eloquent)
│   │   │   └── Services/     # Regras de Negócio
│   │   ├── database/
│   │   │   └── migrations/   # Migrations específicas do Financeiro
│   │   └── routes/web.php    # Rotas específicas do Financeiro
│   │
│   └── Configuracoes/        # MÓDULO 3
│
├── public/                   # Assets públicos (Imagens, Logos)
│
├── resources/                # 🌟 NOSSO FRONTEND (React + Inertia)
│   ├── css/
│   │   └── app.css           # CSS Global (Podemos manter seu padrão BEM ou migrar p/ Tailwind)
│   └── js/
│       ├── app.jsx           # Ponto de entrada do React
│       ├── Components/       # Componentes React Reutilizáveis (DRY)
│       │   ├── ButtonPrimary.jsx
│       │   ├── InputModern.jsx
│       │   ├── ModalFullscreen.jsx
│       │   └── Sidebar.jsx
│       ├── Layouts/          # Container Mestre da Aplicação
│       │   └── MainLayout.jsx # Vai substituir seu atual main.php (com Topbar e Sidebar)
│       └── Pages/            # As Telas Reais do Sistema (Mapeadas via Controller)
│           ├── Dashboard/
│           │   └── Index.jsx
│           ├── Financeiro/
│           │   ├── Index.jsx
│           │   └── Componentes/ (Ex: SlideEmpenho.jsx)
│           └── Config/
│               └── Index.jsx
│
├── routes/                   # ROTAS GLOBAIS
│   └── web.php               # Rotas de Login/Logout
│
└── vite.config.js            # Compilador ultra-rápido do React