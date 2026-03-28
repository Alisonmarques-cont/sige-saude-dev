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
├── Modules/                  # 🌟 ARQUITETURA DE BACKEND MODULAR
│   ├── Contratos/            # NOVO: Módulo de Licitações, Atas e Contratos
│   │   ├── app/Http/Controllers/ # Ex: ProcessoController
│   │   ├── app/Models/           # Ex: Processo, Contrato
│   │   └── database/migrations/  
│   ├── Financeiro/           # Módulo de Dinheiro, Lançamentos e Programas
│   └── Configuracoes/        # Módulo Base de Entidade e Usuários
│
├── resources/                # 🌟 NOSSO FRONTEND (React + Inertia)
│   ├── js/
│       ├── Layouts/          
│       └── Pages/            
│           ├── Cadastros/              
│           ├── Contratos/              # MÓDULO VISUAL DE CONTRATOS
│           │   └── Processos/          # Telas Create e Index de Pregões
│           ├── Financeiro/             
│           └── Configuracoes/