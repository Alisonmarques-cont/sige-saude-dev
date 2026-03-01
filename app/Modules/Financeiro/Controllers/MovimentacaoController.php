<?php

namespace App\Modules\Financeiro\Controllers;

use App\Config\Database;
use PDO;

class MovimentacaoController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Resgata o Exercício Global da sessão.
     * Previne falhas caso a sessão expire, assumindo o ano atual do servidor.
     */
    private function getAnoExercicio(): int {
        return isset($_SESSION['ano_exercicio']) ? (int)$_SESSION['ano_exercicio'] : (int)date('Y');
    }

    // =========================================================================
    // 1. RENDERIZAÇÃO DE INTERFACE
    // =========================================================================
    public function index() {
        require_once __DIR__ . '/../Views/index.php';
    }

    // =========================================================================
    // 2. GESTÃO DE EMPENHOS (DESPESAS)
    // =========================================================================

    public function listarEmpenhos() {
        header('Content-Type: application/json');
        $ano = $this->getAnoExercicio();
        $programaId = $_GET['programa_id'] ?? 'todos';
        
        $sql = "SELECT e.*, p.nome_programa, c.numero_contrato 
                FROM despesas_empenhadas e 
                LEFT JOIN programas_fontes p ON e.programa_id = p.id 
                LEFT JOIN contratos c ON e.contrato_id = c.id 
                WHERE e.ano_exercicio = :ano";
                
        $params = ['ano' => $ano];

        if ($programaId !== 'todos' && is_numeric($programaId)) {
            $sql .= " AND e.programa_id = :progId";
            $params['progId'] = $programaId;
        }

        $sql .= " ORDER BY e.data_emissao DESC, e.id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function salvarEmpenho() {
        header('Content-Type: application/json');
        $d = json_decode(file_get_contents('php://input'), true);
        $ano = $this->getAnoExercicio();
        $id = $d['id'] ?? null;

        try {
            if ($id) {
                // UPDATE rigoroso: só atualiza se pertencer ao ano em curso
                $sql = "UPDATE despesas_empenhadas SET 
                        programa_id=?, data_emissao=?, data_vencimento=?, credor=?, 
                        descricao=?, valor_total=?, contrato_id=?, conta_bancaria_id=?, 
                        elemento_despesa=?, tipo_origem=?
                        WHERE id=? AND ano_exercicio=?";
                $this->db->prepare($sql)->execute([
                    $d['programa_id'], $d['data_emissao'], $d['data_vencimento'], $d['credor'],
                    $d['descricao'], $d['valor_total'], $d['contrato_id'] ?? null, $d['conta_bancaria_id'] ?? null,
                    $d['elemento_despesa'] ?? null, $d['tipo_origem'] ?? 'Direta',
                    $id, $ano
                ]);
            } else {
                // INSERT injetando o ano de exercício
                $sql = "INSERT INTO despesas_empenhadas 
                        (programa_id, data_emissao, data_vencimento, credor, descricao, valor_total, contrato_id, conta_bancaria_id, elemento_despesa, tipo_origem, status, ano_exercicio) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendente', ?)";
                $this->db->prepare($sql)->execute([
                    $d['programa_id'], $d['data_emissao'], $d['data_vencimento'], $d['credor'],
                    $d['descricao'], $d['valor_total'], $d['contrato_id'] ?? null, $d['conta_bancaria_id'] ?? null,
                    $d['elemento_despesa'] ?? null, $d['tipo_origem'] ?? 'Direta', $ano
                ]);
            }
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar: ' . $e->getMessage()]);
        }
    }

    public function pagarEmpenho() {
        header('Content-Type: application/json');
        $d = json_decode(file_get_contents('php://input'), true);
        $ano = $this->getAnoExercicio();
        
        try {
            $this->db->beginTransaction(); // Início da transação atómica

            // 1. Atualizar o status do empenho
            $stmt = $this->db->prepare("UPDATE despesas_empenhadas SET status = 'Pago' WHERE id = ? AND ano_exercicio = ?");
            $stmt->execute([$d['id'], $ano]);

            // 2. Buscar os dados do empenho para gerar o lançamento financeiro (Extrato)
            $stmtEmp = $this->db->prepare("SELECT * FROM despesas_empenhadas WHERE id = ?");
            $stmtEmp->execute([$d['id']]);
            $empenho = $stmtEmp->fetch(PDO::FETCH_ASSOC);

            if ($empenho) {
                // 3. Inserir a despesa na tabela de Lançamentos
                $sqlLanc = "INSERT INTO lancamentos 
                            (programa_id, tipo_movimento, data_movimento, valor, descricao, documento_ref, conta_bancaria_id, ano_exercicio) 
                            VALUES (?, 'Despesa', ?, ?, ?, ?, ?, ?)";
                $this->db->prepare($sqlLanc)->execute([
                    $empenho['programa_id'], 
                    date('Y-m-d'), // Data do pagamento real
                    $empenho['valor_total'], 
                    "Pgto Empenho #" . $empenho['id'] . " - " . $empenho['credor'], 
                    "EMP-" . $empenho['id'],
                    $empenho['conta_bancaria_id'] ?? null,
                    $ano
                ]);
            }

            $this->db->commit();
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro processando pagamento: ' . $e->getMessage()]);
        }
    }

    public function excluirEmpenho() {
        header('Content-Type: application/json');
        $d = json_decode(file_get_contents('php://input'), true);
        $ano = $this->getAnoExercicio();

        try {
            // Garante que só apaga se pertencer ao ano em curso
            $stmt = $this->db->prepare("DELETE FROM despesas_empenhadas WHERE id = ? AND ano_exercicio = ?");
            $stmt->execute([$d['id'], $ano]);
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro: ' . $e->getMessage()]);
        }
    }

    public function getProximoProtocolo() {
        header('Content-Type: application/json');
        $ano = $this->getAnoExercicio();
        // O próximo número reseta a cada ano de exercício
        $stmt = $this->db->prepare("SELECT COALESCE(MAX(id), 0) + 1 as proximo FROM despesas_empenhadas WHERE ano_exercicio = ?");
        $stmt->execute([$ano]);
        echo json_encode(['proximo' => $stmt->fetchColumn()]);
    }

    public function imprimirEmpenho() {
        // Rota de visualização de PDF. Pode necessitar adaptação de acordo com a sua view print/empenho.php
        $id = $_GET['id'] ?? 0;
        $ano = $this->getAnoExercicio();
        require_once __DIR__ . '/../Views/print/empenho.php';
    }

    // =========================================================================
    // 3. GESTÃO DE RECEITAS
    // =========================================================================

    public function listarReceitas() {
        header('Content-Type: application/json');
        $ano = $this->getAnoExercicio();
        $sql = "SELECT r.*, p.nome_programa 
                FROM receitas r 
                LEFT JOIN programas_fontes p ON r.programa_id = p.id 
                WHERE r.ano_exercicio = ? 
                ORDER BY r.data_registro DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$ano]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function salvarReceita() {
        header('Content-Type: application/json');
        $d = json_decode(file_get_contents('php://input'), true);
        $ano = $this->getAnoExercicio();
        
        try {
            $this->db->beginTransaction();

            // Insere na tabela de Receitas
            $sqlRec = "INSERT INTO receitas (programa_id, data_registro, valor, descricao, conta_bancaria_id, ano_exercicio) 
                       VALUES (?, ?, ?, ?, ?, ?)";
            $this->db->prepare($sqlRec)->execute([
                $d['programa_id'], $d['data_registro'], $d['valor'], $d['descricao'], $d['conta_bancaria_id'], $ano
            ]);
            
            $receitaId = $this->db->lastInsertId();

            // Insere simultaneamente no Extrato (lancamentos)
            $sqlLanc = "INSERT INTO lancamentos (programa_id, tipo_movimento, data_movimento, valor, descricao, documento_ref, conta_bancaria_id, ano_exercicio) 
                        VALUES (?, 'Receita', ?, ?, ?, ?, ?, ?)";
            $this->db->prepare($sqlLanc)->execute([
                $d['programa_id'], $d['data_registro'], $d['valor'], $d['descricao'], "REC-" . $receitaId, $d['conta_bancaria_id'], $ano
            ]);

            $this->db->commit();
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar receita: ' . $e->getMessage()]);
        }
    }

    public function excluirReceita() {
        header('Content-Type: application/json');
        $d = json_decode(file_get_contents('php://input'), true);
        $ano = $this->getAnoExercicio();

        try {
            $this->db->beginTransaction();
            // Ao excluir a receita, exclui-se também o lançamento referenciado no extrato para manter integridade
            $stmt = $this->db->prepare("DELETE FROM lancamentos WHERE documento_ref = ? AND tipo_movimento = 'Receita' AND ano_exercicio = ?");
            $stmt->execute(["REC-" . $d['id'], $ano]);

            $stmt2 = $this->db->prepare("DELETE FROM receitas WHERE id = ? AND ano_exercicio = ?");
            $stmt2->execute([$d['id'], $ano]);
            
            $this->db->commit();
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            $this->db->rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro: ' . $e->getMessage()]);
        }
    }

    // =========================================================================
    // 4. LANÇAMENTOS E RELATÓRIOS GERAIS
    // =========================================================================

    public function listarLancamentos() {
        header('Content-Type: application/json');
        $ano = $this->getAnoExercicio();
        $sql = "SELECT l.*, p.nome_programa 
                FROM lancamentos l 
                LEFT JOIN programas_fontes p ON l.programa_id = p.id 
                WHERE l.ano_exercicio = ? 
                ORDER BY l.data_movimento DESC, l.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$ano]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function listarLivroDiario() {
        // Idêntico a lançamentos, mas normalmente estruturado para visualização contábil
        $this->listarLancamentos();
    }

    public function gerarRelatorioPDF() {
        $ano = $this->getAnoExercicio();
        require_once __DIR__ . '/../Views/print/relatorio.php';
    }

    // =========================================================================
    // 5. AUXILIARES E CONSOLIDAÇÕES
    // =========================================================================

    public function listarContratosAtivos() {
        header('Content-Type: application/json');
        $ano = $this->getAnoExercicio();
        // Assume que contratos também foram separados por exercício
        $sql = "SELECT * FROM contratos WHERE data_fim_vigencia >= CURDATE() AND ano_exercicio = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$ano]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function getConsolidadoDiretas() {
        header('Content-Type: application/json');
        $ano = $this->getAnoExercicio();
        $sql = "SELECT p.nome_programa, SUM(e.valor_total) as total 
                FROM despesas_empenhadas e 
                JOIN programas_fontes p ON e.programa_id = p.id 
                WHERE e.tipo_origem = 'Direta' AND e.ano_exercicio = ? 
                GROUP BY p.nome_programa";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$ano]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}