<?php
namespace App\Core;

class Router {
    private $routes = [];

    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // =============================================================
        // DEFINIÇÃO DAS ROTAS DO SISTEMA
        // =============================================================

        // --- DASHBOARD & AUTH ---
        $this->add('GET', '/', 'Dashboard\Controllers\DashboardController@index');
        $this->add('GET', '/login', 'Dashboard\Controllers\DashboardController@login');
        $this->add('POST', '/api/auth/login', 'Dashboard\Controllers\DashboardController@autenticar');
        $this->add('GET', '/logout', 'Dashboard\Controllers\DashboardController@logout');

        // --- FINANCEIRO: PÁGINAS (VIEWS) ---
        $this->add('GET', '/financeiro', 'Financeiro\Controllers\MovimentacaoController@index'); 

        // --- FINANCEIRO: EMPENHOS (API) ---
        $this->add('GET', '/api/financeiro/empenhos/listar', 'Financeiro\Controllers\MovimentacaoController@listarEmpenhos');
        $this->add('POST', '/api/financeiro/empenhos/salvar', 'Financeiro\Controllers\MovimentacaoController@salvarEmpenho');
        $this->add('POST', '/api/financeiro/empenhos/pagar', 'Financeiro\Controllers\MovimentacaoController@pagarEmpenho');
        $this->add('POST', '/api/financeiro/empenhos/excluir', 'Financeiro\Controllers\MovimentacaoController@excluirEmpenho');
        $this->add('GET', '/api/financeiro/empenho/imprimir', 'Financeiro\Controllers\MovimentacaoController@imprimirEmpenho');
        $this->add('GET', '/api/financeiro/empenhos/proximo-protocolo', 'Financeiro\Controllers\MovimentacaoController@getProximoProtocolo');

        // --- FINANCEIRO: RECEITAS (API) ---
        $this->add('GET', '/api/financeiro/receitas/listar', 'Financeiro\Controllers\MovimentacaoController@listarReceitas');
        $this->add('POST', '/api/financeiro/receitas/salvar', 'Financeiro\Controllers\MovimentacaoController@salvarReceita');
        $this->add('POST', '/api/financeiro/receitas/excluir', 'Financeiro\Controllers\MovimentacaoController@excluirReceita');

        // --- FINANCEIRO: EXTRATO, LIVRO DIÁRIO & UTILITÁRIOS (API) ---
        $this->add('GET', '/api/financeiro/lancamentos/listar', 'Financeiro\Controllers\MovimentacaoController@listarLancamentos');
        $this->add('GET', '/api/financeiro/livro-diario/listar', 'Financeiro\Controllers\MovimentacaoController@listarLivroDiario'); // Rota Nova
        $this->add('GET', '/financeiro/relatorio/imprimir', 'Financeiro\Controllers\MovimentacaoController@gerarRelatorioPDF');
        $this->add('GET', '/api/financeiro/contratos/ativos', 'Financeiro\Controllers\MovimentacaoController@listarContratosAtivos');
        $this->add('GET', '/api/financeiro/consolidado/diretas', 'Financeiro\Controllers\MovimentacaoController@getConsolidadoDiretas');
        $this->add('GET', '/api/financeiro/fornecedores-com-contas', 'Config\Controllers\ConfigController@listarFornecedoresComContas'); 
        
        // --- PLANEJAMENTO ---
        $this->add('GET', '/planejamento', 'Planejamento\Controllers\PlanejamentoController@index');
        $this->add('GET', '/api/planejamento/protocolos/buscar', 'Planejamento\Controllers\PlanejamentoController@buscarProtocolos');

        // --- CONTRATOS ---
        $this->add('GET', '/contratos', 'Contratos\Controllers\ContratosController@index');
        $this->add('GET', '/api/contratos/listar', 'Contratos\Controllers\ContratosController@listar');
        $this->add('POST', '/api/contratos/salvar', 'Contratos\Controllers\ContratosController@salvar');
        $this->add('POST', '/api/contratos/excluir', 'Contratos\Controllers\ContratosController@excluir');
        $this->add('GET', '/api/contratos/aditivos/listar', 'Contratos\Controllers\ContratosController@listarAditivos');
        $this->add('POST', '/api/contratos/aditivos/salvar', 'Contratos\Controllers\ContratosController@salvarAditivo');

        // --- CONFIGURAÇÕES ---
        $this->add('GET', '/config', 'Config\Controllers\ConfigController@index');
        $this->add('GET', '/api/config/programas/listar', 'Config\Controllers\ConfigController@listarProgramas');
        $this->add('GET', '/api/config/contas/listar', 'Config\Controllers\ConfigController@listarContas');
        $this->add('GET', '/api/config/fornecedores/listar', 'Config\Controllers\ConfigController@listarFornecedores');
    }

    public function add($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path'   => $path,
            'handler' => $handler
        ];
    }

    public function dispatch($uri) {
        // Normalização da URL
        $scriptName = dirname($_SERVER['SCRIPT_NAME']);
        if (strpos($uri, $scriptName) === 0) {
            $uri = substr($uri, strlen($scriptName));
        }
        $uri = parse_url($uri, PHP_URL_PATH);
        if ($uri == '' || $uri === false) $uri = '/';

        // --- SEGURANÇA OTIMIZADA ---
        if ($uri !== '/login' && $uri !== '/api/auth/login' && !isset($_SESSION['usuario_id'])) {
             // Como padronizamos tudo com /api/, esta verificação única cobre todos os módulos
             if (strpos($uri, '/api/') === 0) {
                 http_response_code(401);
                 echo json_encode(['error' => 'Sessão expirada ou não autorizado']);
                 return;
             }
             // Se não for API, manda para a tela de login
             require_once __DIR__ . '/../Modules/Dashboard/Views/login.php';
             return;
        }

        if (($uri === '/login') && isset($_SESSION['usuario_id'])) {
            header('Location: /');
            return;
        }

        $method = $_SERVER['REQUEST_METHOD'];

        foreach ($this->routes as $route) {
            if ($route['path'] == $uri && $route['method'] == $method) {
                list($controller, $action) = explode('@', $route['handler']);
                
                $class = "App\\Modules\\$controller";
                
                if (class_exists($class)) {
                    $object = new $class();
                    if (method_exists($object, $action)) {
                        return $object->$action();
                    } else {
                        http_response_code(500);
                        echo "Erro Interno: Método '$action' não encontrado em $class.";
                        return;
                    }
                }
                
                http_response_code(500);
                echo "Erro Interno: Classe controladora não encontrada ($class).";
                return;
            }
        }

        http_response_code(404);
        echo "<div style='font-family:sans-serif; text-align:center; padding:50px;'>
                <h1>404</h1>
                <p>Página ou recurso não encontrado.</p>
                <small>URI Solicitada: $uri</small>
              </div>";
    }
}
?>