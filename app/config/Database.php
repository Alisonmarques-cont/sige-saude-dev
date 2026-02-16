<?php
namespace App\Config;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $conn;

    // CONFIGURAÇÕES (AJUSTE CONFORME SEU AMBIENTE)
    private $host = 'localhost';
    private $db_name = 'sige_saude';
    private $username = 'root';
    private $password = ''; // Insira a senha do banco se houver

    private function __construct() {
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->exec("set names utf8");
        } catch(PDOException $e) {
            // CORREÇÃO: Retorna JSON para o Frontend não quebrar com SyntaxError
            header('Content-Type: application/json');
            http_response_code(500); // Erro interno do servidor
            echo json_encode([
                'status' => 'error', 
                'message' => "Falha na conexão com o Banco de Dados: " . $e->getMessage()
            ]);
            exit;
        }
    }

    public static function getInstance() {
        if(!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }

    public static function beginTransaction() {
        return self::getInstance()->beginTransaction();
    }

    public static function commit() {
        return self::getInstance()->commit();
    }

    public static function rollBack() {
        return self::getInstance()->rollBack();
    }
}
?>