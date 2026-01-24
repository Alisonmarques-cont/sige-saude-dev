<?php
// 1. Configurações Iniciais
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 2. Autoloader (Carregador Automático de Classes)
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';
    $len = strlen($prefix);

    if (strncmp($prefix, $class, $len) !== 0) return;

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

use App\Core\Router;

// 3. Inicializa o Roteador
$router = new Router();

// =================================================================================
// MAPA DE ROTAS DO SISTEMA (URL -> Controlador@Função)
// =================================================================================

// --- ROTA PRINCIPAL (TELA) ---
$router->add('GET', '/', 'Dashboard\Controllers\DashboardController@index');
$router->add('GET', '/index.php', 'Dashboard\Controllers\DashboardController@index');

// --- MÓDULO: DASHBOARD ---
$router->add('GET', '/api/dashboard-dados', 'Dashboard\Controllers\DashboardController@getDados');
// [CORREÇÃO] Rota adicionada para o Sistema de Alertas funcionar
$router->add('GET', '/api/dashboard/alertas/listar', 'Dashboard\Controllers\AlertasController@listar');

// --- MÓDULO: PLANEJAMENTO (FASE 3) ---
$router->add('GET', '/api/planejamento/dashboard', 'Planejamento\Controllers\PlanejamentoController@getDados');

// --- MÓDULO: CONFIGURAÇÕES (ATUALIZADO COM EXCLUSÃO) ---
// Entidade
$router->add('GET',  '/api/config/entidade/get', 'Config\Controllers\ConfigController@getEntidade');
$router->add('POST', '/api/config/entidade/salvar', 'Config\Controllers\ConfigController@salvarEntidade');

// Contas Bancárias
$router->add('GET',  '/api/config/contas/listar', 'Config\Controllers\ConfigController@listarContas');
$router->add('POST', '/api/config/contas/salvar', 'Config\Controllers\ConfigController@salvarConta');
$router->add('POST', '/api/config/contas/excluir', 'Config\Controllers\ConfigController@excluirConta'); // Rota de Exclusão

// Programas
$router->add('GET',  '/api/config/programas/listar', 'Config\Controllers\ConfigController@listarProgramas');
$router->add('POST', '/api/config/programas/salvar', 'Config\Controllers\ConfigController@salvarPrograma');
$router->add('POST', '/api/config/programas/excluir', 'Config\Controllers\ConfigController@excluirPrograma'); // NOVA ROTA

// Fornecedores
$router->add('GET',  '/api/config/fornecedores/listar', 'Config\Controllers\ConfigController@listarFornecedores');
$router->add('POST', '/api/config/fornecedores/salvar', 'Config\Controllers\ConfigController@salvarFornecedor');
$router->add('POST', '/api/config/fornecedores/conta/salvar', 'Config\Controllers\ConfigController@salvarContaFornecedor');
$router->add('POST', '/api/config/fornecedores/excluir', 'Config\Controllers\ConfigController@excluirFornecedor'); // NOVA ROTA

// Segurança (Backup)
$router->add('GET', '/api/config/backup/criar', 'Config\Controllers\ConfigController@criarBackup'); 

// --- MÓDULO: FINANCEIRO (MOVIMENTAÇÕES) ---
// Empenhos (Despesas)
$router->add('GET',  '/api/financeiro/empenhos/listar', 'Financeiro\Controllers\MovimentacaoController@listarEmpenhos');
$router->add('POST', '/api/financeiro/empenhos/salvar', 'Financeiro\Controllers\MovimentacaoController@salvarEmpenho');
$router->add('POST', '/api/financeiro/empenhos/pagar', 'Financeiro\Controllers\MovimentacaoController@pagarEmpenho'); // NOVA ROTA DE PAGAMENTO
$router->add('POST', '/api/financeiro/empenhos/excluir', 'Financeiro\Controllers\MovimentacaoController@excluirEmpenho');
$router->add('GET',  '/api/financeiro/empenho/imprimir', 'Financeiro\Controllers\MovimentacaoController@imprimirEmpenho'); 

// Receitas
$router->add('GET',  '/api/financeiro/receitas/listar', 'Financeiro\Controllers\MovimentacaoController@listarReceitas');
$router->add('POST', '/api/financeiro/receitas/salvar', 'Financeiro\Controllers\MovimentacaoController@salvarReceita');
$router->add('POST', '/api/financeiro/receitas/excluir', 'Financeiro\Controllers\MovimentacaoController@excluirReceita');

// Extrato
$router->add('GET', '/api/financeiro/lancamentos/listar', 'Financeiro\Controllers\MovimentacaoController@listarLancamentos');

// Consultas e Relatórios Específicos
$router->add('GET', '/api/financeiro/contratos/ativos', 'Financeiro\Controllers\MovimentacaoController@listarContratosAtivos');
$router->add('GET', '/api/financeiro/diretas/consolidado', 'Financeiro\Controllers\MovimentacaoController@getConsolidadoDiretas');
$router->add('GET', '/api/financeiro/fornecedores-com-contas', 'Config\Controllers\ConfigController@listarFornecedoresComContas');

// --- MÓDULO: CONTRATOS (WIZARD) ---
$router->add('GET', '/api/contratos/pregoes/listar', 'Contratos\Controllers\ContratosController@listarPregoes');
$router->add('POST', '/api/contratos/salvar_licitacao', 'Contratos\Controllers\ContratosController@salvarLicitacao');
$router->add('POST', '/api/contratos/salvar_ata', 'Contratos\Controllers\ContratosController@salvarAta');
$router->add('POST', '/api/contratos/salvar_contrato', 'Contratos\Controllers\ContratosController@salvarContrato');
$router->add('POST', '/api/contratos/salvar_aditivo', 'Contratos\Controllers\ContratosController@salvarAditivo');

// --- RELATÓRIOS GERAIS ---
$router->add('GET', '/relatorios/pdf', 'Financeiro\Controllers\MovimentacaoController@gerarRelatorioPDF'); 

// --- AUTENTICAÇÃO ---
$router->add('POST', '/api/auth/login', 'Dashboard\Controllers\DashboardController@login');
$router->add('GET', '/logout', 'Dashboard\Controllers\DashboardController@logout');

// 4. Despacha a requisição
$router->dispatch($_SERVER['REQUEST_URI']);
?>