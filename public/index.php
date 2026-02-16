<?php

/**
 * SIGE SAÚDE - Front Controller
 */

// Configurações iniciais
date_default_timezone_set('America/Recife');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Autoloader Robusto (Corrige problemas de App vs app)
spl_autoload_register(function ($class) {
    // Espaço de nomes prefixo
    $prefix = 'App\\';
    
    // Diretório base para o prefixo (sai de public/ e entra em app/)
    $base_dir = __DIR__ . '/../app/';

    // Verifica se a classe usa o prefixo
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    // Pega o nome relativo da classe
    $relative_class = substr($class, $len);

    // Substitui o prefixo namespace pelo diretório base, troca separadores namespace
    // por separadores de diretório e adiciona .php
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    // Se o arquivo existir, carrega-o
    if (file_exists($file)) {
        require $file;
    } else {
        // Tenta depurar caso não encontre (útil para desenvolvimento)
        // error_log("Autoloader: Não encontrou $file para a classe $class");
    }
});

use App\Core\Router;

try {
    $router = new Router();
    
    // Passa a URI completa para o router tratar
    $router->dispatch($_SERVER['REQUEST_URI']);

} catch (Exception $e) {
    // Erro fatal
    http_response_code(500);
    echo "<h1>Erro Interno</h1>";
    echo "<p>" . $e->getMessage() . "</p>";
}