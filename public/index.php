<?php
// Exibe erros para facilitar o desenvolvimento
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// =============================================================================================
// CARREGAMENTO DE CLASSES E CONFIGURAÇÕES
// =============================================================================================

// Carrega o Router e a Conexão com Banco de Dados
require_once __DIR__ . '/../app/Core/Router.php';
require_once __DIR__ . '/../app/config/Database.php';

// --- Carregamento Manual dos Controllers (Modules) ---

// Módulo Dashboard e Alertas
require_once __DIR__ . '/../app/Modules/Dashboard/Controllers/DashboardController.php';
require_once __DIR__ . '/../app/Modules/Dashboard/Controllers/AlertasController.php';

// Módulo Financeiro
require_once __DIR__ . '/../app/Modules/Financeiro/Controllers/MovimentacaoController.php';
require_once __DIR__ . '/../app/Modules/Financeiro/Controllers/PlanoContasController.php'; 

// Outros Módulos
require_once __DIR__ . '/../app/Modules/Contratos/Controllers/ContratosController.php';
require_once __DIR__ . '/../app/Modules/Config/Controllers/ConfigController.php';
require_once __DIR__ . '/../app/Modules/Planejamento/Controllers/PlanejamentoController.php';

// Instancia o Router do sistema
$router = new App\Core\Router();


// =============================================================================================
// DEFINIÇÃO DAS ROTAS DO SISTEMA
// =============================================================================================

// --- MÓDULO: AUTENTICAÇÃO E LOGIN ---
$router->add('GET', '/login', 'Dashboard\Controllers\DashboardController@login');
$router->add('POST', '/auth/login', 'Dashboard\Controllers\DashboardController@autenticar');
$router->add('GET', '/logout', 'Dashboard\Controllers\DashboardController@logout');


// --- MÓDULO: DASHBOARD (HOME) ---
$router->add('GET', '/', 'Dashboard\Controllers\DashboardController@index');

// [CORREÇÃO 1] Ajustado para bater com a chamada do dashboard.js (/api/dashboard-dados)
$router->add('GET', '/api/dashboard-dados', 'Dashboard\Controllers\DashboardController@getResumoFinanceiro');
// Mantemos a rota antiga também por segurança
$router->add('GET', '/dashboard/resumo', 'Dashboard\Controllers\DashboardController@getResumoFinanceiro');


// --- MÓDULO: FINANCEIRO ---

// 1. Movimentações (Empenhos, Liquidações, Pagamentos)
$router->add('GET', '/api/financeiro/movimentacoes', 'Financeiro\Controllers\MovimentacaoController@listar');
$router->add('POST', '/api/financeiro/movimentacoes/salvar', 'Financeiro\Controllers\MovimentacaoController@salvar');
$router->add('POST', '/api/financeiro/movimentacoes/excluir', 'Financeiro\Controllers\MovimentacaoController@excluir');

// 2. Receitas
$router->add('GET', '/api/financeiro/receitas', 'Financeiro\Controllers\MovimentacaoController@listarReceitas');
$router->add('POST', '/api/financeiro/receitas/salvar', 'Financeiro\Controllers\MovimentacaoController@salvarReceita');

// 3. Extrato Bancário e Livro Diário
$router->add('GET', '/api/financeiro/extrato', 'Financeiro\Controllers\MovimentacaoController@getExtrato');
$router->add('GET', '/api/financeiro/livro-diario', 'Financeiro\Controllers\MovimentacaoController@getLivroDiario');

// 4. Contas e Fornecedores
$router->add('GET', '/api/financeiro/fornecedores', 'Financeiro\Controllers\MovimentacaoController@listarFornecedores');
$router->add('POST', '/api/financeiro/fornecedores/salvar', 'Financeiro\Controllers\MovimentacaoController@salvarFornecedor');
$router->add('POST', '/api/financeiro/fornecedores/excluir', 'Financeiro\Controllers\MovimentacaoController@excluirFornecedor');

// 5. Plano de Contas [NOVO]
$router->add('GET', '/api/financeiro/plano-contas/listar', 'Financeiro\Controllers\PlanoContasController@listar');
$router->add('POST', '/api/financeiro/plano-contas/salvar', 'Financeiro\Controllers\PlanoContasController@salvar');
$router->add('POST', '/api/financeiro/plano-contas/excluir', 'Financeiro\Controllers\PlanoContasController@excluir');


// --- MÓDULO: CONTRATOS ---
$router->add('GET', '/api/contratos/listar', 'Contratos\Controllers\ContratosController@listar');
$router->add('POST', '/api/contratos/salvar', 'Contratos\Controllers\ContratosController@salvar');
$router->add('GET', '/api/licitacoes', 'Contratos\Controllers\ContratosController@listarLicitacoes');


// --- MÓDULO: CONFIGURAÇÕES ---

// [CORREÇÃO 2] Ajustado para bater com a chamada do config.js (/api/config/entidade/get)
$router->add('GET', '/api/config/entidade/get', 'Config\Controllers\ConfigController@getDadosEntidade');
$router->add('GET', '/api/config/entidade', 'Config\Controllers\ConfigController@getDadosEntidade'); // Rota alternativa

$router->add('POST', '/api/config/entidade/salvar', 'Config\Controllers\ConfigController@salvarDadosEntidade');

// [CORREÇÃO] Adicionei /listar para garantir compatibilidade com possíveis chamadas JS
$router->add('GET', '/api/config/contas/listar', 'Config\Controllers\ConfigController@listarContasBancarias');
$router->add('GET', '/api/config/contas', 'Config\Controllers\ConfigController@listarContasBancarias'); 
$router->add('POST', '/api/config/contas/salvar', 'Config\Controllers\ConfigController@salvarContaBancaria');
$router->add('POST', '/api/config/contas/excluir', 'Config\Controllers\ConfigController@excluirContaBancaria'); // Rota extra comum

// [CORREÇÃO] Adicionei /listar para programas também
$router->add('GET', '/api/config/programas/listar', 'Config\Controllers\ConfigController@listarProgramas');
$router->add('GET', '/api/config/programas', 'Config\Controllers\ConfigController@listarProgramas');
$router->add('POST', '/api/config/programas/salvar', 'Config\Controllers\ConfigController@salvarPrograma'); // Supondo existência
$router->add('POST', '/api/config/programas/excluir', 'Config\Controllers\ConfigController@excluirPrograma'); // Supondo existência

$router->add('GET', '/api/config/fornecedores/listar', 'Financeiro\Controllers\MovimentacaoController@listarFornecedores'); // Reutilizando controller


// --- MÓDULO: RELATÓRIOS ---
$router->add('GET', '/relatorios/gestao-fiscal', 'Relatorios\Controllers\RelatorioController@gestaoFiscal');


// --- SISTEMA DE ALERTAS (Notificações) ---

// [CORREÇÃO 3] Ajustado para bater com a chamada do alertas.js (/api/dashboard/alertas/listar)
$router->add('GET', '/api/dashboard/alertas/listar', 'Dashboard\Controllers\AlertasController@listarAlertas');
$router->add('GET', '/api/alertas/listar', 'Dashboard\Controllers\AlertasController@listarAlertas'); // Mantem antiga

$router->add('POST', '/api/alertas/marcar-lida', 'Dashboard\Controllers\AlertasController@marcarComoLida');


// =============================================================================================
// DISPATCH (Execução da Rota)
// =============================================================================================

// Envia a URL atual para o Router processar
$router->dispatch($_SERVER['REQUEST_URI']);
?>