<?php

namespace App\Core;

class Router {
    protected $routes = [];

    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // --- MAPA DE ROTAS COMPLETO ---

        // 1. Dashboard e Autenticação
        $this->add('/', 'Dashboard\Controllers\DashboardController', 'index');
        $this->add('/login', 'Dashboard\Controllers\DashboardController', 'login');
        $this->add('/logout', 'Dashboard\Controllers\DashboardController', 'logout');
        
        // [CRÍTICO] Rotas que faltavam e causavam o erro 404 no Dashboard:
        $this->add('/api/auth/login', 'Dashboard\Controllers\DashboardController', 'apiLogin');
        $this->add('/api/dashboard-dados', 'Dashboard\Controllers\DashboardController', 'getDados'); 
        $this->add('/api/dashboard/alertas/listar', 'Dashboard\Controllers\AlertasController', 'getAlertas');

        // 2. Módulo Financeiro
        $this->add('/financeiro', 'Financeiro\Controllers\MovimentacaoController', 'index');
        $this->add('/api/financeiro/movimentacoes', 'Financeiro\Controllers\MovimentacaoController', 'getMovimentacoes');
        $this->add('/api/financeiro/movimentacao/salvar', 'Financeiro\Controllers\MovimentacaoController', 'salvar');
        $this->add('/api/financeiro/movimentacao/excluir', 'Financeiro\Controllers\MovimentacaoController', 'excluir');
        $this->add('/api/financeiro/livro-diario', 'Financeiro\Controllers\MovimentacaoController', 'getLivroDiario');
        $this->add('/api/financeiro/relatorio/pdf', 'Financeiro\Controllers\MovimentacaoController', 'gerarPDF');
        $this->add('/api/financeiro/empenho/pdf', 'Financeiro\Controllers\MovimentacaoController', 'gerarEmpenhoPDF');
        $this->add('/api/financeiro/fornecedores', 'Financeiro\Controllers\MovimentacaoController', 'getFornecedores');
        $this->add('/api/financeiro/fornecedor/salvar', 'Financeiro\Controllers\MovimentacaoController', 'salvarFornecedor');

        // 3. Módulo Contratos e Licitações
        $this->add('/contratos', 'Contratos\Controllers\ContratosController', 'index');
        $this->add('/api/contratos/lista', 'Contratos\Controllers\ContratosController', 'getContratos');
        $this->add('/api/contratos/licitacoes', 'Contratos\Controllers\ContratosController', 'getLicitacoes');
        $this->add('/api/contratos/licitacao/salvar', 'Contratos\Controllers\ContratosController', 'salvarLicitacao');
        $this->add('/api/contratos/atas', 'Contratos\Controllers\ContratosController', 'getAtas');
        $this->add('/api/contratos/ata/salvar', 'Contratos\Controllers\ContratosController', 'salvarAta');
        $this->add('/api/contratos/contrato/salvar', 'Contratos\Controllers\ContratosController', 'salvarContrato');
        $this->add('/api/contratos/aditivos', 'Contratos\Controllers\ContratosController', 'getAditivos');
        $this->add('/api/contratos/aditivo/salvar', 'Contratos\Controllers\ContratosController', 'salvarAditivo');
        $this->add('/api/contratos/excluir', 'Contratos\Controllers\ContratosController', 'excluir');

        // 4. Módulo Planejamento
        $this->add('/planejamento', 'Planejamento\Controllers\PlanejamentoController', 'index');
        $this->add('/api/planejamento/pactuacoes', 'Planejamento\Controllers\PlanejamentoController', 'getPactuacoes');
        $this->add('/api/planejamento/pactuacao/salvar', 'Planejamento\Controllers\PlanejamentoController', 'salvar');
        $this->add('/api/planejamento/pactuacao/excluir', 'Planejamento\Controllers\PlanejamentoController', 'excluir');

        // 5. Módulo Configurações
        $this->add('/config', 'Config\Controllers\ConfigController', 'index');
        $this->add('/api/config/programas', 'Config\Controllers\ConfigController', 'getProgramas');
        $this->add('/api/config/programas/salvar', 'Config\Controllers\ConfigController', 'salvarPrograma');
        $this->add('/api/config/programas/excluir', 'Config\Controllers\ConfigController', 'excluirPrograma');
        $this->add('/api/config/fontes', 'Config\Controllers\ConfigController', 'getFontes');
        $this->add('/api/config/fontes/salvar', 'Config\Controllers\ConfigController', 'salvarFonte');
        $this->add('/api/config/bancos', 'Config\Controllers\ConfigController', 'getBancos');
        $this->add('/api/config/bancos/salvar', 'Config\Controllers\ConfigController', 'salvarBanco');
    }

    public function add($uri, $controller, $method) {
        $this->routes[$uri] = [
            'controller' => $controller,
            'method' => $method
        ];
    }

    public function dispatch($requestUri) {
        // 1. Limpeza básica da URI
        $uri = explode('?', $requestUri)[0];
        
        // 2. Detecção automática de subdiretório (Ex: /sige-saude-dev/public)
        $scriptName = $_SERVER['SCRIPT_NAME'];
        $baseDir = dirname($scriptName);
        $baseDir = str_replace('\\', '/', $baseDir); // Correção para Windows
        
        // Remove a pasta base da URI se estiver rodando em subdiretório
        if ($baseDir !== '/' && strpos($uri, $baseDir) === 0) {
            $uri = substr($uri, strlen($baseDir));
        }
        
        // Garante que a URI comece com / e não termine com /
        $uri = '/' . trim($uri, '/');

        // 3. Verifica se a rota existe
        if (array_key_exists($uri, $this->routes)) {
            $route = $this->routes[$uri];
            $controllerClass = "\\App\\Modules\\" . $route['controller'];
            $method = $route['method'];

            // 4. Segurança: Verifica Login
            // Lista de rotas que NÃO precisam de login
            $publicRoutes = ['/login', '/api/auth/login'];
            
            if (!isset($_SESSION['user_id']) && !in_array($uri, $publicRoutes)) {
                // Se for chamada de API, retorna erro JSON 401
                if (strpos($uri, '/api/') === 0) {
                    header('Content-Type: application/json');
                    http_response_code(401);
                    echo json_encode(['error' => 'Sessão expirada. Faça login novamente.']);
                    return;
                }
                // Se for acesso via navegador, redireciona para o login
                $loginUrl = ($baseDir === '/') ? '/login' : $baseDir . '/login';
                header("Location: $loginUrl");
                exit;
            }

            // 5. Instancia o Controlador e chama o método
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
                'uri_recebida' => $requestUri,
                'uri_processada' => $uri
            ]);
        }
    }

    private function sendError($code, $message, $debug = []) {
        http_response_code($code);
        if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
            header('Content-Type: application/json');
            echo json_encode(array_merge(['error' => $message], $debug));
        } else {
            echo "<h1>Erro $code</h1><p>$message</p>";
        }
        exit;
    }
}