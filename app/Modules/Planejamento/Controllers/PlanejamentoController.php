<?php
namespace App\Modules\Planejamento\Controllers;

use App\Config\Database;
use PDO;

class PlanejamentoController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function index() {
        // Renderiza a view principal
        require __DIR__ . '/../Views/index.php';
    }

    // API para buscar protocolos na base financeira
    public function buscarProtocolos() {
        $numero = $_GET['numero'] ?? '';
        $inicio = $_GET['inicio'] ?? '';
        $fim = $_GET['fim'] ?? '';

        $sql = "SELECT id, protocolo_entrada, data_protocolo, credor, descricao, valor_total, status 
                FROM despesas_empenhadas 
                WHERE protocolo_entrada IS NOT NULL AND protocolo_entrada != ''";
        
        $params = [];

        if (!empty($numero)) {
            $sql .= " AND protocolo_entrada LIKE ?";
            $params[] = "%$numero%";
        }
        if (!empty($inicio)) {
            $sql .= " AND data_protocolo >= ?";
            $params[] = $inicio;
        }
        if (!empty($fim)) {
            $sql .= " AND data_protocolo <= ?";
            $params[] = $fim;
        }

        $sql .= " ORDER BY data_protocolo DESC, id DESC LIMIT 100";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formata valores para o frontend
            foreach ($dados as &$d) {
                $d['valor_formatado'] = 'R$ ' . number_format($d['valor_total'], 2, ',', '.');
                $d['data_formatada'] = $d['data_protocolo'] ? date('d/m/Y', strtotime($d['data_protocolo'])) : '-';
            }

            echo json_encode($dados);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}