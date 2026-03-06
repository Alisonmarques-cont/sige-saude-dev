<?php

namespace App\Modules\Planejamento\Controllers;

use App\Config\Database;
use PDO;
use Exception;

class InstrumentosGestaoController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Retorna a lista de instrumentos de gestão em formato JSON
     * Rota: GET /api/planejamento/instrumentos/listar
     */
    public function listar() {
        // Define o cabeçalho para JSON
        header('Content-Type: application/json; charset=utf-8');

        // Pega o ano de referência via GET, se não vier, assume o ano atual
        $anoReferencia = $_GET['ano'] ?? date('Y');

        $sql = "SELECT id, sigla, nome, periodicidade, prazo_legal, ano_referencia, data_limite, status 
                FROM planejamento_instrumentos 
                WHERE ano_referencia = ?
                ORDER BY id ASC"; // A ordem de inserção do nosso Seed já faz sentido cronológico

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$anoReferencia]);
            $instrumentos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Retorna os dados com código 200 (OK)
            http_response_code(200);
            echo json_encode($instrumentos);

        } catch (Exception $e) {
            // Em caso de erro no banco, retorna 500
            http_response_code(500);
            echo json_encode([
                'error' => 'Erro ao buscar instrumentos de gestão.',
                'details' => $e->getMessage()
            ]);
        }
    }

    /**
     * Futuro método para Salvar (Insert/Update)
     * Rota: POST /api/planejamento/instrumentos/salvar
     */
    public function salvar() {
        // Deixando o esqueleto (Stub) pronto para o nosso próximo passo de CRUD
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Método salvar em desenvolvimento.']);
    }
}