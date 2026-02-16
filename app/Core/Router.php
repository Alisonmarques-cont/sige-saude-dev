<?php

namespace App\Core;

class Router {
    protected $routes = [];

    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // --- MAPA DE ROTAS CENTRALIZADO ---
        
        // Autenticação e Dashboard
        $this->add('/', 'Dashboard\Controllers\DashboardController', 'index');
        $this->add('/login', 'Dashboard\Controllers\DashboardController', 'login');
        $this->add('/api/auth/login', 'Dashboard\Controllers\DashboardController', 'apiLogin');
        $this->add('/logout', 'Dashboard\Controllers\DashboardController', 'logout');
        $this->add('/api/alertas', 'Dashboard\Controllers\AlertasController', 'getAlertas');

        // Financeiro
        $this->add('/financeiro', 'Financeiro\Controllers\MovimentacaoController', 'index');
        $this->add('/api/financeiro/movimentacoes', 'Financeiro\Controllers\MovimentacaoController', 'getMovimentacoes');
        $this->add('/api/financeiro/movimentacao/salvar', 'Financeiro\Controllers\MovimentacaoController', 'salvar');
        $this->add('/api/financeiro/movimentacao/excluir', 'Financeiro\Controllers\MovimentacaoController', 'excluir');
        $this->add('/api/financeiro/livro-diario', 'Financeiro\Controllers\MovimentacaoController', 'getLivroDiario');
        $this->add('/api/financeiro/fornecedores', 'Financeiro\Controllers\MovimentacaoController', 'getFornecedores');
        $this->add('/api/financeiro/fornecedor/salvar', 'Financeiro\Controllers\MovimentacaoController', 'salvarFornecedor');

        // Contratos e Configurações
        $this->add('/contratos', 'Contratos\Controllers\ContratosController', 'index');
        $this->add('/api/contratos/lista', 'Contratos\Controllers\ContratosController', 'getContratos');
        $this->add('/config', 'Config\Controllers\ConfigController', 'index');
        $this->add('/api/config/programas', 'Config\Controllers\ConfigController', 'getProgramas');
        $this->add('/api/config/programas/salvar', 'Config\Controllers\ConfigController', 'salvarPrograma');
        $this->add('/api/config/programas/excluir', 'Config\Controllers\ConfigController', 'excluirPrograma');
        
        // Planeamento
        $this->add('/planejamento', 'Planejamento\Controllers\PlanejamentoController', 'index');
        $this->add('/api/planejamento/pactuacoes', 'Planejamento\Controllers\PlanejamentoController', 'getPactuacoes');
    }

    public function add($uri, $controller, $method) {
        $this->routes[$uri] = [
            'controller' => $controller,
            'method' => $method
        ];
    }

    public function dispatch($uri) {
        // 1. Limpar Query Strings
        $uri = explode('?', $uri)[0];

        // 2. Lógica de Base Path Robusta
        // Captura o diretório onde o index.php reside (ex: /sige-saude-dev/public)
        $baseDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
        
        // Remove o baseDir da URI para isolar a rota pretendida
        if ($baseDir !== '/' && strpos($uri, $baseDir) === 0) {
            $uri = substr($uri, strlen($baseDir));
        }

        // 3. Normalização: Garante que a URI começa com / e não termina com /
        $uri = '/' . trim($uri, '/');

        // 4. Verificação de existência da rota
        if (array_key_exists($uri, $this->routes)) {
            $route = $this->routes[$uri];
            $controllerClass = "\\App\\Modules\\" . $route['controller'];
            $methodName = $route['method'];

            // 5. Verificação de Autenticação (Acesso Público vs Privado)
            $publicRoutes = ['/login', '/api/auth/login'];
            $isAuthorized = isset($_SESSION['user_id']);

            if (!$isAuthorized && !in_array($uri, $publicRoutes)) {
                if (strpos($uri, '/api/') === 0) {
                    header('Content-Type: application/json');
                    http_response_code(401);
                    echo json_encode(['error' => 'Sessão encerrada']);
                    return;
                }
                header('Location: ' . rtrim($baseDir, '/') . '/login');
                exit;
            }

            // 6. Execução do Controlador
            if (class_exists($controllerClass)) {
                $controller = new $controllerClass();
                if (method_exists($controller, $methodName)) {
                    return $controller->$methodName();
                }
            }
        }

        // Se chegou aqui, é 404
        $this->handleNotFound($uri);
    }

    protected function handleNotFound($uri) {
        http_response_code(404);
        if (strpos($uri, '/api/') === 0) {
            header('Content-Type: application/json');
            echo json_encode([
                'error' => 'Rota não encontrada',
                'debug_uri' => $uri
            ]);
        } else {
            echo "<h1>404</h1><p>A rota <strong>$uri</strong> não foi encontrada.</p>";
        }
    }
}