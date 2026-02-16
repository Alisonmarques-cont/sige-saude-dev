<?php

namespace App\Core;

class Router {
    protected $routes = [];

    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // =========================================================================
        // 1. DASHBOARD E AUTENTICAÇÃO
        // =========================================================================
        $this->add('/', 'Dashboard\Controllers\DashboardController', 'index');
        $this->add('/login', 'Dashboard\Controllers\DashboardController', 'login');
        $this->add('/logout', 'Dashboard\Controllers\DashboardController', 'logout');
        
        // Rotas de API (Login e Gráficos)
        $this->add('/api/auth/login', 'Dashboard\Controllers\DashboardController', 'apiLogin');
        $this->add('/api/dashboard-dados', 'Dashboard\Controllers\DashboardController', 'getDados'); 
        $this->add('/api/dashboard/alertas/listar', 'Dashboard\Controllers\AlertasController', 'getAlertas');

        // =========================================================================
        // 2. MÓDULO FINANCEIRO (MovimentacaoController)
        // =========================================================================
        $this->add('/financeiro', 'Financeiro\Controllers\MovimentacaoController', 'index');
        
        // Empenhos (Novas rotas específicas)
        $this->add('/api/financeiro/empenhos/listar', 'Financeiro\Controllers\MovimentacaoController', 'listarEmpenhos');
        $this->add('/api/financeiro/empenho/salvar', 'Financeiro\Controllers\MovimentacaoController', 'salvarEmpenho');
        $this->add('/api/financeiro/empenho/pagar', 'Financeiro\Controllers\MovimentacaoController', 'pagarEmpenho');
        $this->add('/api/financeiro/empenho/excluir', 'Financeiro\Controllers\MovimentacaoController', 'excluirEmpenho');
        $this->add('/api/financeiro/empenhos/proximo-protocolo', 'Financeiro\Controllers\MovimentacaoController', 'getProximoProtocolo');
        $this->add('/api/financeiro/empenho/pdf', 'Financeiro\Controllers\MovimentacaoController', 'imprimirEmpenho');
        
        // Receitas
        $this->add('/api/financeiro/receitas/listar', 'Financeiro\Controllers\MovimentacaoController', 'listarReceitas');
        $this->add('/api/financeiro/receita/salvar', 'Financeiro\Controllers\MovimentacaoController', 'salvarReceita');
        $this->add('/api/financeiro/receita/excluir', 'Financeiro\Controllers\MovimentacaoController', 'excluirReceita');
        
        // Extrato Bancário e Livro Diário
        $this->add('/api/financeiro/lancamentos/listar', 'Financeiro\Controllers\MovimentacaoController', 'listarLancamentos');
        $this->add('/api/financeiro/livro-diario/listar', 'Financeiro\Controllers\MovimentacaoController', 'listarLivroDiario');
        $this->add('/api/financeiro/relatorio/imprimir', 'Financeiro\Controllers\MovimentacaoController', 'gerarRelatorioPDF');
        
        // Auxiliares (Listas para Selects)
        $this->add('/api/financeiro/contratos/ativos', 'Financeiro\Controllers\MovimentacaoController', 'listarContratosAtivos');
        $this->add('/api/financeiro/consolidado/diretas', 'Financeiro\Controllers\MovimentacaoController', 'getConsolidadoDiretas');
        
        // [IMPORTANTE] Fornecedores com Contas (Lógica está no ConfigController)
        $this->add('/api/financeiro/fornecedores-com-contas', 'Config\Controllers\ConfigController', 'listarFornecedoresComContas');

        // =========================================================================
        // 3. MÓDULO CONTRATOS (ContratosController)
        // =========================================================================
        $this->add('/contratos', 'Contratos\Controllers\ContratosController', 'index');
        
        // Rotas alinhadas com contratos.js
        $this->add('/api/contratos/pregoes/listar', 'Contratos\Controllers\ContratosController', 'listarPregoes');
        $this->add('/api/contratos/salvar_licitacao', 'Contratos\Controllers\ContratosController', 'salvarLicitacao');
        $this->add('/api/contratos/salvar_ata', 'Contratos\Controllers\ContratosController', 'salvarAta');
        $this->add('/api/contratos/salvar_contrato', 'Contratos\Controllers\ContratosController', 'salvarContrato');
        $this->add('/api/contratos/salvar_aditivo', 'Contratos\Controllers\ContratosController', 'salvarAditivo');
        
        // Visualização e Exclusão
        $this->add('/api/contratos/detalhes', 'Contratos\Controllers\ContratosController', 'getContrato');
        $this->add('/api/contratos/excluir', 'Contratos\Controllers\ContratosController', 'excluir');

        // =========================================================================
        // 4. MÓDULO PLANEJAMENTO (PlanejamentoController)
        // =========================================================================
        $this->add('/planejamento', 'Planejamento\Controllers\PlanejamentoController', 'index');
        $this->add('/api/planejamento/pactuacoes', 'Planejamento\Controllers\PlanejamentoController', 'getPactuacoes');
        $this->add('/api/planejamento/pactuacao/salvar', 'Planejamento\Controllers\PlanejamentoController', 'salvar');
        $this->add('/api/planejamento/pactuacao/excluir', 'Planejamento\Controllers\PlanejamentoController', 'excluir');

        // =========================================================================
        // 5. MÓDULO CONFIGURAÇÕES (ConfigController)
        // =========================================================================
        $this->add('/config', 'Config\Controllers\ConfigController', 'index');
        
        // Entidade
        $this->add('/api/config/entidade/get', 'Config\Controllers\ConfigController', 'getEntidade');
        $this->add('/api/config/entidade/salvar', 'Config\Controllers\ConfigController', 'salvarEntidade');
        
        // Contas Bancárias da Entidade
        $this->add('/api/config/contas/listar', 'Config\Controllers\ConfigController', 'listarContas');
        $this->add('/api/config/contas/salvar', 'Config\Controllers\ConfigController', 'salvarConta');
        $this->add('/api/config/contas/excluir', 'Config\Controllers\ConfigController', 'excluirConta');
        
        // Programas
        $this->add('/api/config/programas/listar', 'Config\Controllers\ConfigController', 'listarProgramas'); 
        $this->add('/api/config/programas/salvar', 'Config\Controllers\ConfigController', 'salvarPrograma');
        $this->add('/api/config/programas/excluir', 'Config\Controllers\ConfigController', 'excluirPrograma');
        
        // Fornecedores
        $this->add('/api/config/fornecedores/listar', 'Config\Controllers\ConfigController', 'listarFornecedores');
        $this->add('/api/config/fornecedores/salvar', 'Config\Controllers\ConfigController', 'salvarFornecedor');
        $this->add('/api/config/fornecedores/excluir', 'Config\Controllers\ConfigController', 'excluirFornecedor');
        $this->add('/api/config/fornecedores/conta/salvar', 'Config\Controllers\ConfigController', 'salvarContaFornecedor');
    }

    // --- LÓGICA DO ROTEADOR ---

    public function add($uri, $controller, $method) {
        $this->routes[$uri] = [
            'controller' => $controller,
            'method' => $method
        ];
    }

    public function dispatch($requestUri) {
        // 1. Limpa Query String (ex: ?id=1)
        $uri = explode('?', $requestUri)[0];
        
        // 2. Deteta e remove subdiretório (ex: /sige-saude-dev/public)
        $scriptName = $_SERVER['SCRIPT_NAME'];
        $baseDir = dirname($scriptName);
        $baseDir = str_replace('\\', '/', $baseDir); 
        
        if ($baseDir !== '/' && strpos($uri, $baseDir) === 0) {
            $uri = substr($uri, strlen($baseDir));
        }
        
        $uri = '/' . trim($uri, '/');

        // 3. Procura a rota
        if (array_key_exists($uri, $this->routes)) {
            $route = $this->routes[$uri];
            $controllerClass = "\\App\\Modules\\" . $route['controller'];
            $method = $route['method'];

            // 4. Verifica Autenticação
            $publicRoutes = ['/login', '/api/auth/login'];
            
            if (!isset($_SESSION['user_id']) && !in_array($uri, $publicRoutes)) {
                // Se for API, retorna erro JSON 401
                if (strpos($uri, '/api/') === 0) {
                    header('Content-Type: application/json');
                    http_response_code(401);
                    echo json_encode(['error' => 'Sessão expirada.']);
                    return;
                }
                // Se for navegador, redireciona para login
                $loginUrl = ($baseDir === '/') ? '/login' : $baseDir . '/login';
                header("Location: $loginUrl");
                exit;
            }

            // 5. Executa o Controlador
            if (class_exists($controllerClass)) {
                $controller = new $controllerClass();
                if (method_exists($controller, $method)) {
                    return $controller->$method();
                } else {
                    $this->sendError(500, "Método '$method' não encontrado na classe $controllerClass");
                }
            } else {
                $this->sendError(500, "Classe '$controllerClass' não encontrada.");
            }
        } else {
            // Rota não encontrada
            $this->sendError(404, "Rota não encontrada", [
                'uri_solicitada' => $uri,
                'base_dir' => $baseDir
            ]);
        }
    }

    private function sendError($code, $message, $debug = []) {
        http_response_code($code);
        // Responde JSON se for chamada de API
        if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
            header('Content-Type: application/json');
            echo json_encode(array_merge(['error' => $message], $debug));
        } else {
            echo "<h1>Erro $code</h1><p>$message</p>";
        }
        exit;
    }
}