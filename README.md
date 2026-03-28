# 🏥 Sige Saúde

O **Sige Saúde** é uma plataforma moderna e responsiva focada na Gestão Pública Inteligente. Desenvolvida especificamente para simplificar a gestão de empenhos, pagamentos, planificação e recursos do Fundo Municipal de Saúde (FMS).

## 🚀 Módulos do Sistema
* **Configurações:** Gestão da Entidade, Utilizadores e Plano de Contas.
* **Cadastros Base:** Programas de Trabalho, Fontes de Recurso, Pacientes e Profissionais.
* **Financeiro:** Gestão de Contas Bancárias, Fornecedores e Lançamentos (Receitas/Despesas).
* **Contratos (Licitações):** Gestão em cascata de Processos Administrativos, Pregões, Atas de Registro de Preço, Contratos e Aditivos.

## 🚀 Tecnologias Utilizadas (Stack)
A nossa arquitetura utiliza o padrão **Strangler Fig** e **Domain-Driven Design (DDD)** através de módulos independentes.
* **Backend:** Laravel 12 (PHP 8.2+)
* **Frontend:** React.js 
* **Ponte de Comunicação (SPA):** Inertia.js (Sem necessidade de APIs REST pesadas)
* **Estilização:** Tailwind CSS
* **Arquitetura Modular:** `nwidart/laravel-modules`

## 📦 Como Instalar e Rodar o Projeto

1. **Clone o repositório e instale as dependências:**
   ```bash
   composer install
   npm install

   