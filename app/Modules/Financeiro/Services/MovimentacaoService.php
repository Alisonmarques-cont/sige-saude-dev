<?php
namespace App\Modules\Financeiro\Services;

use App\Config\Database;
use PDO;
use Exception;

/**
 * MovimentacaoService
 * Camada de Regras de Negócio do Módulo Financeiro.
 */
class MovimentacaoService {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function validarSaldoContratual(int $contratoId, float $valorSolicitado, ?int $empenhoIdAtual = null): bool {
        $stmtC = $this->db->prepare("SELECT valor_contratado FROM contratos WHERE id = ?");
        $stmtC->execute([$contratoId]);
        $valorContratado = (float) $stmtC->fetchColumn();

        if ($valorContratado <= 0) {
            throw new Exception("Contrato sem valor definido ou não encontrado.");
        }

        $sqlSoma = "SELECT COALESCE(SUM(valor_total), 0) FROM despesas_empenhadas WHERE contrato_id = ? AND id != ?";
        $stmtSoma = $this->db->prepare($sqlSoma);
        $stmtSoma->execute([$contratoId, $empenhoIdAtual ?? 0]);
        $jaGasto = (float) $stmtSoma->fetchColumn();

        $saldoDisponivel = $valorContratado - $jaGasto;
        
        if ($valorSolicitado > $saldoDisponivel) {
            throw new Exception("Saldo Contratual Insuficiente. Disponível: R$ " . number_format($saldoDisponivel, 2, ',', '.'));
        }
        
        return true;
    }

    public function getFornecedorPorContrato(int $contratoId): string {
        $sql = "SELECT COALESCE(f.razao_social, a.fornecedor) 
                FROM contratos c 
                LEFT JOIN atas a ON c.id_ata = a.id 
                LEFT JOIN fornecedores f ON c.fornecedor_id = f.id 
                WHERE c.id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$contratoId]);
        $nome = $stmt->fetchColumn();
        
        if (!$nome) {
            throw new Exception("Fornecedor não localizado para este contrato.");
        }
        return $nome;
    }

    public function processarPagamento(int $id, string $dataPagamento): void {
        Database::beginTransaction();
        try {
            $stmt = $this->db->prepare("SELECT * FROM despesas_empenhadas WHERE id = ?");
            $stmt->execute([$id]);
            $empenho = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$empenho) throw new Exception("Empenho não encontrado.");
            if ($empenho['status'] === 'Pago') throw new Exception("Este empenho já foi pago.");

            $this->db->prepare("UPDATE despesas_empenhadas SET status = 'Pago' WHERE id = ?")->execute([$id]);

            $this->registrarLancamento([
                'programa_id' => $empenho['programa_id'],
                'tipo_movimento' => 'Despesa',
                'data_movimento' => $dataPagamento,
                'valor' => $empenho['valor_total'],
                'descricao' => $empenho['descricao'] . " (PGTO EMP #$id)",
                'documento_ref' => "EMP-" . $id,
                'conta_bancaria_id' => $empenho['conta_bancaria_id']
            ]);

            Database::commit();
        } catch (Exception $e) {
            Database::rollBack();
            throw $e;
        }
    }

    public function calcularSaldoAnterior(int $contaId, string $dataReferencia): float {
        $stmt = $this->db->prepare("SELECT saldo_inicial FROM contas_bancarias_entidade WHERE id = ?");
        $stmt->execute([$contaId]);
        $saldoBase = (float) $stmt->fetchColumn();

        $sqlMov = "SELECT SUM(CASE WHEN tipo_movimento = 'Receita' THEN valor ELSE -valor END) 
                   FROM lancamentos WHERE conta_bancaria_id = ? AND data_movimento < ?";
        $stmtMov = $this->db->prepare($sqlMov);
        $stmtMov->execute([$contaId, $dataReferencia]);
        
        return $saldoBase + (float) $stmtMov->fetchColumn();
    }

    public function registrarLancamento(array $dados): bool {
        $sql = "INSERT INTO lancamentos (programa_id, tipo_movimento, data_movimento, valor, descricao, documento_ref, conta_bancaria_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            $dados['programa_id'], 
            $dados['tipo_movimento'], 
            $dados['data_movimento'], 
            $dados['valor'], 
            $dados['descricao'], 
            $dados['documento_ref'], 
            $dados['conta_bancaria_id']
        ]);
    }

    // A FUNÇÃO QUE ESTAVA FALTANDO PARA O PHP:
    public function registrarReceitaCompleta(array $data): void {
        Database::beginTransaction();
        try {
            $valorStr = $data['valor'] ?? '0';
            $cleanStr = preg_replace('/[^\d,]/', '', $valorStr);
            $valor = (float) str_replace(',', '.', $cleanStr);
            
            $id = $data['id'] ?? null;
            $progId = !empty($data['programa_id']) ? (int)$data['programa_id'] : null;
            $contaId = !empty($data['conta_bancaria_id']) ? (int)$data['conta_bancaria_id'] : null;

            if (!$progId || !$contaId) throw new Exception("Programa e Conta Bancária são obrigatórios.");
            if ($valor <= 0) throw new Exception("O valor da receita deve ser maior que zero.");

            if ($id) {
                $this->db->prepare("UPDATE receitas SET programa_id=?, data_registro=?, valor=?, descricao=?, conta_bancaria_id=? WHERE id=?")
                         ->execute([$progId, $data['data_registro'], $valor, $data['descricao'], $contaId, $id]);
                
                $this->db->prepare("UPDATE lancamentos SET valor=?, descricao=?, data_movimento=?, programa_id=?, conta_bancaria_id=? WHERE documento_ref=?")
                         ->execute([$valor, $data['descricao'], $data['data_registro'], $progId, $contaId, "REC-" . $id]);
            } else {
                $this->db->prepare("INSERT INTO receitas (programa_id, data_registro, valor, descricao, conta_bancaria_id) VALUES (?,?,?,?,?)")
                         ->execute([$progId, $data['data_registro'], $valor, $data['descricao'], $contaId]);
                         
                $novoId = $this->db->lastInsertId();
                
                $this->registrarLancamento([
                    'programa_id' => $progId,
                    'tipo_movimento' => 'Receita',
                    'data_movimento' => $data['data_registro'],
                    'valor' => $valor,
                    'descricao' => $data['descricao'],
                    'documento_ref' => "REC-" . $novoId,
                    'conta_bancaria_id' => $contaId
                ]);
            }
            Database::commit();
        } catch (Exception $e) {
            Database::rollBack();
            throw $e;
        }
    }
}