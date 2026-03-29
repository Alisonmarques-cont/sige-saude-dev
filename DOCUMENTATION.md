# Documentação Arquitetural - Sige Saúde v0.2

## 1. Visão Geral da Arquitetura
O Sige Saúde utiliza um ecossistema robusto baseado no **Laravel 12** + **React**. Aplicamos o **Domain-Driven Design (DDD)** através da segregação física de módulos no backend (`nwidart/laravel-modules`), garantindo escalabilidade para a Gestão Pública.

## 2. A Comunicação: Inertia.js (A Ponte Mágica)
Não utilizamos chamadas `fetch()` manuais ou Axios para desenhar a interface. O Inertia.js permite retornar componentes React diretamente dos Controladores do Laravel.
* Exemplo: `return Inertia::render('Financeiro/Lancamentos/Index', ['dados' => $dados]);`

## 3. Lógica (Backend) vs Experiência (Frontend)
Uma das nossas principais regras arquiteturais é que **o Backend é focado no domínio, mas o Frontend é focado no Utilizador (UI/UX).**
* *Exemplo Prático:* O controlador `ProgramaTrabalhoController` vive no módulo **Financeiro** (pois dita as regras do dinheiro e empenhos), mas no Frontend (React), a tela dele está arrumada em `Pages/Cadastros/Programas`, pois para o utilizador, trata-se de um Cadastro Base.

## 4. Regras de Domínio: Módulo de Contratos (Licitações)
O Sige Saúde segue estritamente a arquitetura de dados da Lei de Licitações Brasileira, garantindo o controlo de saldos e empenhos em cascata:
1. **Processo Licitatório (Mãe):** Define o teto máximo da despesa (`valor_total_licitado`).
2. **Ata de Registro de Preços (1 para N):** Um processo pode ter várias atas (vários fornecedores vencedores de diferentes lotes). *A soma das Atas <= Valor Licitado.*
3. **Contrato (1 para 1):** Uma Ata gera apenas um Contrato Firmado. *Valor do Contrato <= Valor da Ata.*
4. **Aditivos (1 para N):** Ligam-se ao Contrato, alterando de forma dinâmica o seu Valor Atualizado e a sua Vigência Fim na interface do utilizador.

## 5. Estrutura de Pastas Atualizada

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