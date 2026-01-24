<?php
namespace App\Modules\Contratos\Controllers;
use App\Config\Database;
use PDO;

class ContratosController {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function listarPregoes() {
        $termo = $_GET['termo'] ?? '';
        
        $sql = "SELECT * FROM licitacoes WHERE pregao LIKE :t OR processo LIKE :t OR objeto LIKE :t ORDER BY id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['t' => "%$termo%"]);
        $licitacoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach($licitacoes as &$lic) {
            $stmtAta = $this->db->prepare("SELECT * FROM atas WHERE id_licitacao = ?");
            $stmtAta->execute([$lic['id']]);
            $lic['atas'] = $stmtAta->fetchAll(PDO::FETCH_ASSOC);

            foreach($lic['atas'] as &$ata) {
                // ALTERADO: Adicionada subquery para somar o valor executado (empenhos vinculados)
                $sqlCont = "SELECT c.*, 
                            (SELECT COALESCE(SUM(valor_total), 0) 
                             FROM despesas_empenhadas 
                             WHERE contrato_id = c.id) as valor_executado 
                            FROM contratos c 
                            WHERE id_ata = ?";
                
                $stmtCont = $this->db->prepare($sqlCont);
                $stmtCont->execute([$ata['id']]);
                $ata['contratos'] = $stmtCont->fetchAll(PDO::FETCH_ASSOC);
            }
        }

        echo json_encode($licitacoes);
    }

    // --- Visualizar Detalhes ---
    public function getContrato() {
        $id = $_GET['id'] ?? 0;
        // ALTERADO: Incluído o cálculo no detalhe também, caso seja usado
        $sql = "SELECT c.*, a.numero_ata, a.fornecedor, l.processo, l.pregao, l.objeto,
                (SELECT COALESCE(SUM(valor_total), 0) FROM despesas_empenhadas WHERE contrato_id = c.id) as valor_executado
                FROM contratos c 
                JOIN atas a ON c.id_ata = a.id 
                JOIN licitacoes l ON a.id_licitacao = l.id 
                WHERE c.id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
    }
    
    // --- Salvar Itens (Create) ---
    public function salvarLicitacao() {
        $d = json_decode(file_get_contents('php://input'), true);
        $valor = (float) str_replace(['R$', '.', ','], ['', '', '.'], $d['valor']);

        try {
            $stmt = $this->db->prepare("INSERT INTO licitacoes (processo, pregao, objeto, valor_estimado) VALUES (?, ?, ?, ?)");
            if($stmt->execute([$d['processo'], $d['pregao'], $d['objeto'], $valor])) {
                echo json_encode(['status' => 'ok', 'id_licitacao' => $this->db->lastInsertId()]);
            } else {
                throw new \Exception("Erro ao inserir licitação");
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'msg' => $e->getMessage()]);
        }
    }

    public function salvarAta() {
        $d = json_decode(file_get_contents('php://input'), true);
        $valor = (float) str_replace(['R$', '.', ','], ['', '', '.'], $d['valor']);

        try {
            $stmt = $this->db->prepare("INSERT INTO atas (id_licitacao, numero_ata, fornecedor, valor_total_registrado, data_validade) VALUES (?, ?, ?, ?, ?)");
            if($stmt->execute([$d['id_licitacao'], $d['numero'], $d['fornecedor'], $valor, $d['validade']])) {
                echo json_encode(['status' => 'ok', 'id_ata' => $this->db->lastInsertId()]);
            } else {
                throw new \Exception("Erro ao inserir ata");
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'msg' => $e->getMessage()]);
        }
    }

    public function salvarContrato() {
        $d = json_decode(file_get_contents('php://input'), true);
        $valor = (float) str_replace(['R$', '.', ','], ['', '', '.'], $d['valor']);
        
        $vigencia = date('Y-m-d', strtotime($d['data_assinatura'] . ' + 12 months'));

        try {
            $stmt = $this->db->prepare("INSERT INTO contratos (id_ata, numero_contrato, data_assinatura, data_fim_vigencia, valor_contratado) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$d['id_ata'], $d['numero'], $d['data_assinatura'], $vigencia, $valor]);
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'msg' => $e->getMessage()]);
        }
    }

    // --- Aditivos (Update Simples) ---
    public function salvarAditivo() {
        $d = json_decode(file_get_contents('php://input'), true);
        
        // No momento, atualizamos o contrato original pois não há tabela de aditivos
        try {
            $sql = "UPDATE contratos SET ";
            $params = [];
            
            if(!empty($d['nova_vigencia'])) {
                $sql .= "data_fim_vigencia = ?, ";
                $params[] = $d['nova_vigencia'];
            }
            
            if(!empty($d['novo_valor'])) {
                $valor = (float) str_replace(['R$', '.', ','], ['', '', '.'], $d['novo_valor']);
                $sql .= "valor_contratado = ?, ";
                $params[] = $valor;
            }
            
            // Remove a última vírgula
            $sql = rtrim($sql, ", ");
            $sql .= " WHERE id = ?";
            $params[] = $d['id_contrato'];

            if(count($params) > 1) { // Tem pelo menos 1 campo + ID
                $this->db->prepare($sql)->execute($params);
                echo json_encode(['status' => 'ok']);
            } else {
                echo json_encode(['status' => 'error', 'msg' => 'Nenhum dado para atualizar']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'msg' => $e->getMessage()]);
        }
    }
}
?>