# Documentação Arquitetural - Sige Saúde v0.2

## 1. Visão Geral da Arquitetura
O Sige Saúde utiliza um ecossistema robusto baseado no **Laravel 12** + **React**. Aplicamos o **Domain-Driven Design (DDD)** através da segregação física de módulos no backend (`nwidart/laravel-modules`), garantindo escalabilidade para a Gestão Pública.

## 2. A Comunicação: Inertia.js (A Ponte Mágica)
Não utilizamos chamadas `fetch()` manuais ou Axios para desenhar a interface. O Inertia.js permite retornar componentes React diretamente dos Controladores do Laravel.
* Exemplo: `return Inertia::render('Financeiro/Lancamentos/Index', ['dados' => $dados]);`

## 3. Lógica (Backend) vs Experiência (Frontend)
Uma das nossas principais regras arquiteturais é que **o Backend é focado no domínio, mas o Frontend é focado no Utilizador (UI/UX).**
* *Exemplo Prático:* O controlador `ProgramaTrabalhoController` vive no módulo **Financeiro** (pois dita as regras do dinheiro e empenhos), mas no Frontend (React), a tela dele está arrumada em `Pages/Cadastros/Programas`, pois para o utilizador, trata-se de um Cadastro Base.

## 4. Estrutura de Pastas Atualizada

/sige-saude-v2 (Raiz do Projeto)
├── app/                      
│   └── Models/               # Modelos Globais (Ex: User, PlanoConta)
│
├── database/                 
│   ├── migrations/           # Tabelas globais e ordem cronológica corrigida
│   └── seeders/              # DatabaseSeeder.php (Gera o Admin Master)
│
├── Modules/                  # 🌟 ARQUITETURA DE BACKEND MODULAR
│   ├── Financeiro/           
│   │   ├── app/Http/Controllers/  # Ex: LancamentoController, ProgramaTrabalhoController
│   │   ├── app/Models/       
│   │   ├── database/migrations/   
│   │   └── routes/web.php    
│   └── Configuracoes/        
│
├── resources/                # 🌟 NOSSO FRONTEND (React + Inertia)
│   ├── js/
│       ├── Layouts/          
│       │   └── AuthenticatedLayout.jsx # Topbar + Sidebar com Acordeão
│       └── Pages/            
│           ├── Welcome.jsx             # Landing Page do Sistema
│           ├── Cadastros/              # MÓDULO VISUAL DE CADASTROS
│           │   └── Programas/          # Telas de Programas e Blocos
│           ├── Financeiro/             # MÓDULO VISUAL FINANCEIRO
│           │   ├── Lancamentos/        # Telas Create (Abas) e Index
│           │   ├── Contas/
│           │   └── Fornecedores/
│           └── Configuracoes/          # MÓDULO VISUAL DE CONFIGURAÇÕES
│               └── Entidade/Partials/  # Componentização (SRP - Single Responsibility)