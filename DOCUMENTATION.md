### 3. `DOCUMENTATION.md`
Atualizei a seção de Arquitetura e Frontend para explicar o uso de Módulos e a separação das Views.

```markdown
# Documentação Técnica - Sige Saúde Web

## 1. Visão Geral
O Sige Saúde é um sistema de gestão pública focado na administração de fundos municipais de saúde. A versão atual (Web 1.1) utiliza uma arquitetura **MVC Modular**, focada em organização de código e facilidade de manutenção.

## 2. Arquitetura do Sistema

### Estrutura Modular
O projeto não mistura códigos de funcionalidades diferentes. Tanto o Backend (PHP) quanto o Frontend (JS/CSS) respeitam a separação por domínios:

* **app/Modules/**: Cada pasta aqui (Financeiro, Contratos, etc.) contém seus próprios Controllers e Views.
* **public/assets/js/modules/**: Contém a lógica de interface específica de cada módulo.
* **public/assets/css/modules/**: Contém o estilo específico de cada módulo.

### Fluxo de Requisição
1.  O usuário acessa uma URL (ex: `/financeiro/empenhos`).
2.  O `.htaccess` redireciona para `public/index.php`.
3.  O `Router.php` direciona para o Controller correto.
4.  O Controller carrega a View principal (`main.php`), que inclui dinamicamente as partes necessárias (`Shared/sidebar.php`, `Financeiro/Views/index.php`).

## 3. Banco de Dados (MySQL)
O sistema utiliza banco relacional com integridade referencial (`ON DELETE RESTRICT` ou tratamento via código para evitar orfãos).

* **entidade & usuarios**: Dados globais.
* **financeiro**: `despesas_empenhadas`, `receitas`, `lancamentos` (Extrato Unificado).
* **contratos**: `licitacoes` -> `atas` -> `contratos` (Hierarquia).

## 4. Frontend (Interface)

O Frontend foi refatorado para eliminar arquivos monolíticos.

### JavaScript (ES Modules)
Não utilizamos bundlers (Webpack/Vite) para manter a simplicidade do deploy PHP, mas usamos **ES Modules nativos**.
* **core/**: `api.js` (Fetch Wrapper), `ui.js` (Controle de Abas/Modais), `utils.js` (Formatadores).
* **modules/**: Arquivos específicos (ex: `financeiro.js`) que importam funções do core.
* **main.js**: Ponto de entrada que inicializa a UI e carrega os módulos.

### CSS (Modular Nativo)
Utilizamos `@import` no `main.css` para organizar os estilos:
* **base/**: Variáveis e Reset.
* **layout/**: Estrutura global (Sidebar, Wrapper).
* **components/**: Botões, Forms, Cards, Modais.
* **modules/**: Estilos específicos de cada tela.

## 5. Segurança
* **Backend:** PDO Prepared Statements para prevenir SQL Injection.
* **Frontend:** JS modular reduz escopo global, dificultando XSS.
* **Acesso:** Sessões PHP nativas com validação de login em hash (Bcrypt).

## 6. Manutenção
Para adicionar uma nova funcionalidade:
1.  Crie o Controller em `app/Modules/NovoModulo`.
2.  Crie a View em `app/Modules/NovoModulo/Views`.
3.  Adicione o JS em `public/assets/js/modules/novomodulo.js`.
4.  Adicione o CSS em `public/assets/css/modules/novomodulo.css`.
5.  Registre a rota em `public/index.php`.