<?php
namespace App\Modules\Financeiro\Controllers;

use App\Config\Database;
use PDO;

class PlanoContasController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // LISTAR: Busca todas as contas para mostrar na tabela
    public function listar() {
        // Ordenamos pelo código para ficar hierárquico (1, 1.1, 1.2...)
        $sql = "SELECT * FROM plano_contas ORDER BY codigo ASC";
        echo json_encode($this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC));
    }

    // SALVAR: Cria ou Atualiza uma conta
    public function salvar() {
        $d = json_decode(file_get_contents('php://input'), true);
        
        try {
            if (!empty($d['id'])) {
                // Se tem ID, é uma EDIÇÃO
                $sql = "UPDATE plano_contas SET codigo=?, descricao=?, tipo=?, nivel=? WHERE id=?";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([$d['codigo'], $d['descricao'], $d['tipo'], $d['nivel'], $d['id']]);
            } else {
                // Se não tem ID, é CRIAÇÃO
                $sql = "INSERT INTO plano_contas (codigo, descricao, tipo, nivel) VALUES (?, ?, ?, ?)";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([$d['codigo'], $d['descricao'], $d['tipo'], $d['nivel']]);
            }
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // EXCLUIR: Remove uma conta
    public function excluir() {
        $d = json_decode(file_get_contents('php://input'), true);
        try {
            $this->db->prepare("DELETE FROM plano_contas WHERE id=?")->execute([$d['id']]);
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir.']);
        }
    }
}
?>