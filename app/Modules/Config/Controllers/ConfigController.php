<?php
namespace App\Modules\Config\Controllers;
use App\Config\Database;
use PDO;

class ConfigController {
    private $db;
    public function __construct() { $this->db = Database::getInstance(); }

    // --- ENTIDADE ---
    public function getEntidade() {
        echo json_encode($this->db->query("SELECT * FROM entidade WHERE id = 1")->fetch(PDO::FETCH_ASSOC) ?: []);
    }
    public function salvarEntidade() {
        $d = json_decode(file_get_contents('php://input'), true);
        $check = $this->db->query("SELECT id FROM entidade WHERE id = 1")->fetch();
        $sql = $check ? "UPDATE entidade SET nome_completo=?, cnpj=? WHERE id=1" : "INSERT INTO entidade (nome_completo, cnpj, id) VALUES (?, ?, 1)";
        $this->db->prepare($sql)->execute([$d['nome_completo'], $d['cnpj']]);
        echo json_encode(['status' => 'ok']);
    }

    // --- CONTAS BANCÁRIAS DA ENTIDADE ---
    public function listarContas() {
        echo json_encode($this->db->query("SELECT * FROM contas_bancarias_entidade")->fetchAll(PDO::FETCH_ASSOC));
    }
    public function salvarConta() {
        $d = json_decode(file_get_contents('php://input'), true);
        $id = $d['id'] ?? null;
        
        if ($id) {
            // Edição
            $this->db->prepare("UPDATE contas_bancarias_entidade SET banco=?, agencia=?, conta=?, descricao=? WHERE id=?")
                     ->execute([$d['banco'], $d['agencia'], $d['conta'], $d['descricao'], $id]);
        } else {
            // Criação
            $this->db->prepare("INSERT INTO contas_bancarias_entidade (banco, agencia, conta, descricao) VALUES (?, ?, ?, ?)")
                     ->execute([$d['banco'], $d['agencia'], $d['conta'], $d['descricao']]);
        }
        echo json_encode(['status' => 'ok']);
    }
    public function excluirConta() {
        $d = json_decode(file_get_contents('php://input'), true);
        try {
            $this->db->prepare("DELETE FROM contas_bancarias_entidade WHERE id=?")->execute([$d['id']]);
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Não é possível excluir: Esta conta possui movimentações vinculadas.']);
        }
    }

    // --- PROGRAMAS ---
    public function listarProgramas() {
        echo json_encode($this->db->query("SELECT * FROM programas_fontes")->fetchAll(PDO::FETCH_ASSOC));
    }
    public function salvarPrograma() {
        $d = json_decode(file_get_contents('php://input'), true);
        $id = $d['id'] ?? null;

        if ($id) {
            $this->db->prepare("UPDATE programas_fontes SET nome_programa=?, tipo_macro=?, bloco=?, acao_detalhada=?, portaria=? WHERE id=?")
                     ->execute([$d['nome_programa'], $d['tipo_macro'], $d['bloco'], $d['acao_detalhada'], $d['portaria'], $id]);
        } else {
            $this->db->prepare("INSERT INTO programas_fontes (nome_programa, tipo_macro, bloco, acao_detalhada, portaria) VALUES (?,?,?,?,?)")
                     ->execute([$d['nome_programa'], $d['tipo_macro'], $d['bloco'], $d['acao_detalhada'], $d['portaria']]);
        }
        echo json_encode(['status' => 'ok']);
    }
    public function excluirPrograma() {
        $d = json_decode(file_get_contents('php://input'), true);
        try {
            $this->db->prepare("DELETE FROM programas_fontes WHERE id=?")->execute([$d['id']]);
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Não é possível excluir: Existem lançamentos neste programa.']);
        }
    }

    // --- FORNECEDORES ---
    public function listarFornecedores() {
        $termo = $_GET['termo'] ?? '';
        $stmt = $this->db->prepare("SELECT * FROM fornecedores WHERE razao_social LIKE ? OR cnpj LIKE ?");
        $stmt->execute(["%$termo%", "%$termo%"]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    public function salvarFornecedor() {
        $d = json_decode(file_get_contents('php://input'), true);
        $id = $d['id'] ?? null;
        $novoId = $id;

        if ($id) {
            $this->db->prepare("UPDATE fornecedores SET cnpj=?, razao_social=?, telefone=?, email=? WHERE id=?")
                     ->execute([$d['cnpj'], $d['razao_social'], $d['telefone'], $d['email'], $id]);
        } else {
            $this->db->prepare("INSERT INTO fornecedores (cnpj, razao_social, telefone, email) VALUES (?,?,?,?)")
                     ->execute([$d['cnpj'], $d['razao_social'], $d['telefone'], $d['email']]);
            $novoId = $this->db->lastInsertId();
        }
        echo json_encode(['status' => 'ok', 'id' => $novoId]);
    }
    public function excluirFornecedor() {
        $d = json_decode(file_get_contents('php://input'), true);
        try {
            $this->db->prepare("DELETE FROM fornecedores WHERE id=?")->execute([$d['id']]);
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Não é possível excluir: Fornecedor vinculado a contratos ou empenhos.']);
        }
    }
    
    // --- CONTAS BANCÁRIAS DOS FORNECEDORES ---
    public function salvarContaFornecedor() {
        $d = json_decode(file_get_contents('php://input'), true);
        // ATUALIZADO: Inclui o campo 'agencia' no INSERT
        $this->db->prepare("INSERT INTO contas_bancarias_fornecedores (fornecedor_id, banco, agencia, conta) VALUES (?,?,?,?)")
                 ->execute([$d['fornecedor_id'], $d['banco'], $d['agencia'] ?? '', $d['conta']]);
        echo json_encode(['status' => 'ok']);
    }

    public function listarFornecedoresComContas() {
        $termo = $_GET['termo'] ?? '';
        $stmt = $this->db->prepare("SELECT * FROM fornecedores WHERE razao_social LIKE ?");
        $stmt->execute(["%$termo%"]);
        $forns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach($forns as &$f) {
            $stmtC = $this->db->prepare("SELECT * FROM contas_bancarias_fornecedores WHERE fornecedor_id = ?");
            $stmtC->execute([$f['id']]);
            $f['contas'] = $stmtC->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode($forns);
    }

    // --- FERRAMENTAS ---
    public function criarBackup() {
        $tables = ['entidade', 'usuarios', 'programas_fontes', 'contas_bancarias_entidade', 'fornecedores', 'despesas_empenhadas', 'receitas', 'contratos', 'lancamentos'];
        $sqlScript = "-- Backup Sige Saude " . date('Y-m-d H:i') . "\n\n";
        foreach ($tables as $table) {
            $rows = $this->db->query("SELECT * FROM $table")->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as $row) {
                $cols = array_keys($row);
                $vals = array_values($row);
                $vals = array_map(function($v){ return "'" . addslashes($v) . "'"; }, $vals);
                $sqlScript .= "INSERT INTO $table (" . implode(',', $cols) . ") VALUES (" . implode(',', $vals) . ");\n";
            }
            $sqlScript .= "\n";
        }
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="backup_sigesaude.sql"');
        echo $sqlScript;
    }
}
?>