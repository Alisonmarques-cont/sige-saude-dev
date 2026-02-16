<?php

/**
 * SIGE SAÚDE - Sistema de Gestão de Saúde
 * Ponto de entrada único da aplicação.
 */

// Define o fuso horário para garantir precisão nos lançamentos financeiros
date_default_timezone_set('America/Recife');

// Autoload das classes seguindo o padrão PSR-4
spl_autoload_register(function ($class) {
    $base_dir = __DIR__ . '/../';
    $file = $base_dir . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Core\Router;

try {
    // Inicializa o Roteador
    // O construtor do Router agora centraliza todas as definições de rotas
    $router = new Router();

    // Obtém a URI atual e despacha para o controlador correspondente
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Executa a lógica de roteamento e segurança
    $router->dispatch($uri);

} catch (\Exception $e) {
    // Tratamento de erros críticos em ambiente de produção
    error_log("Erro no Sistema: " . $e->getMessage());
    
    if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => 'Ocorreu um erro interno no servidor.']);
    } else {
        http_response_code(500);
        echo "<h1>Erro 500</h1><p>Infelizmente, ocorreu um erro inesperado. Por favor, tente novamente mais tarde.</p>";
    }
}