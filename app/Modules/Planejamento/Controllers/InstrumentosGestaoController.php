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

    public function salvar() {
        header('Content-Type: application/json; charset=utf-8');

        // Captura e sanitização básica dos dados vindos do FormData
        $sigla = trim($_POST['sigla'] ?? '');
        $nome = trim($_POST['nome'] ?? '');
        $periodicidade = trim($_POST['periodicidade'] ?? '');
        $ano_referencia = trim($_POST['ano_referencia'] ?? '');
        $prazo_legal = trim($_POST['prazo_legal'] ?? '');
        $data_limite = trim($_POST['data_limite'] ?? '');
        $status = trim($_POST['status'] ?? 'Aguardando');

        // Validação de segurança básica (Server-Side)
        if (empty($sigla) || empty($nome) || empty($periodicidade) || empty($ano_referencia)) {
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'error' => 'Preencha todos os campos obrigatórios.']);
            return;
        }

        // Se a data limite vier vazia, forçamos o NULL para o MySQL aceitar corretamente
        if ($data_limite === '') {
            $data_limite = null;
        }

        // Preparação do SQL
        $sql = "INSERT INTO planejamento_instrumentos 
                (sigla, nome, periodicidade, prazo_legal, ano_referencia, data_limite, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $sigla, 
                $nome, 
                $periodicidade, 
                $prazo_legal, 
                $ano_referencia, 
                $data_limite, 
                $status
            ]);

            http_response_code(201); // 201 Created
            echo json_encode([
                'success' => true, 
                'message' => 'Instrumento criado com sucesso',
                'id' => $this->db->lastInsertId()
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'error' => 'Erro interno ao guardar o instrumento de gestão.',
                'details' => $e->getMessage()
            ]);
        }
    }

    /**
     * Busca os detalhes de um único instrumento pelo ID
     * Rota: GET /api/planejamento/instrumentos/detalhes?id=1
     */
    public function getInstrumento() {
        header('Content-Type: application/json; charset=utf-8');

        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

        if (!$id) {
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'error' => 'ID inválido ou não fornecido.']);
            return;
        }

        $sql = "SELECT * FROM planejamento_instrumentos WHERE id = ?";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
            $instrumento = $stmt->fetch(\PDO::FETCH_ASSOC);

            if ($instrumento) {
                http_response_code(200);
                echo json_encode(['success' => true, 'data' => $instrumento]);
            } else {
                http_response_code(404); // Not Found
                echo json_encode(['success' => false, 'error' => 'Instrumento não encontrado.']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro interno ao buscar detalhes.', 'details' => $e->getMessage()]);
        }
    }

    /**
     * Atualiza um instrumento existente na base de dados
     * Rota: POST /api/planejamento/instrumentos/atualizar
     */
    public function atualizar() {
        header('Content-Type: application/json; charset=utf-8');

        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $sigla = trim($_POST['sigla'] ?? '');
        $nome = trim($_POST['nome'] ?? '');
        $periodicidade = trim($_POST['periodicidade'] ?? '');
        $ano_referencia = trim($_POST['ano_referencia'] ?? '');
        $prazo_legal = trim($_POST['prazo_legal'] ?? '');
        $data_limite = trim($_POST['data_limite'] ?? '');
        $status = trim($_POST['status'] ?? 'Aguardando');

        // Validação de segurança básica
        if (!$id || empty($sigla) || empty($nome) || empty($periodicidade) || empty($ano_referencia)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Preencha todos os campos obrigatórios e forneça um ID válido.']);
            return;
        }

        // Formatação de data nula
        if ($data_limite === '') {
            $data_limite = null;
        }

        $sql = "UPDATE planejamento_instrumentos SET 
                sigla = ?, 
                nome = ?, 
                periodicidade = ?, 
                prazo_legal = ?, 
                ano_referencia = ?, 
                data_limite = ?, 
                status = ?
                WHERE id = ?";

        try {
            $stmt = $this->db->prepare($sql);
            $sucesso = $stmt->execute([
                $sigla, 
                $nome, 
                $periodicidade, 
                $prazo_legal, 
                $ano_referencia, 
                $data_limite, 
                $status,
                $id // O ID vai no final para corresponder ao último '?'
            ]);

            if ($sucesso) {
                http_response_code(200); // 200 OK
                echo json_encode(['success' => true, 'message' => 'Instrumento atualizado com sucesso.']);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Nenhuma alteração foi realizada.']);
            }

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro interno ao atualizar o instrumento.', 'details' => $e->getMessage()]);
        }
    }
}