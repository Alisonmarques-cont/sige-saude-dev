<?php
namespace App\Modules\Financeiro\Services;

use App\Config\Database;
use PDO;
use Exception;

/**
 * MovimentacaoService
 * Camada de Regras de Negócio do Módulo Financeiro.
 * Focada em integridade de dados e cálculos complexos.
 */
class MovimentacaoService {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Valida se um contrato tem saldo suficiente para um novo empenho ou alteração.
     *
     */
    public function validarSaldoContratual(int $contratoId, float $valorSolicitado, ?int $empenhoIdAtual = null): bool {
        // Busca valor total do contrato
        $stmtC = $this->db->prepare("SELECT valor_contratado FROM contratos WHERE id = ?");
        $stmtC->execute([$contratoId]);
        $valorContratado = (float) $stmtC->fetchColumn();

        if ($valorContratado <= 0) {
            throw new Exception("Contrato sem valor definido ou não encontrado.");
        }

        // Soma o que já foi gasto (excluindo o próprio empenho em caso de edição)
        $sqlSoma = "SELECT COALESCE(SUM(valor_total), 0) FROM despesas_empenhadas 
                    WHERE contrato_id = ? AND id != ?";
        $stmtSoma = $this->db->prepare($sqlSoma);
        $stmtSoma->execute([$contratoId, $empenhoIdAtual ?? 0]);
        $jaGasto = (float) $stmtSoma->fetchColumn();

        $saldoDisponivel = $valorContratado - $jaGasto;

        if ($valorSolicitado > $saldoDisponivel) {
            throw new Exception("Saldo Contratual Insuficiente. Disponível: R$ " . number_format($saldoDisponivel, 2, ',', '.'));
        }

        return true;
    }

    /**
     * Calcula o saldo consolidado de uma conta até determinada data.
     * Essencial para o cálculo de "Saldo Anterior" em extratos.
     */
    public function calcularSaldoAnterior(int $contaId, string $dataReferencia): float {
        // 1. Saldo Inicial da conta
        $stmt = $this->db->prepare("SELECT saldo_inicial FROM contas_bancarias_entidade WHERE id = ?");
        $stmt->execute([$contaId]);
        $saldoBase = (float) $stmt->fetchColumn();

        // 2. Soma de Movimentações anteriores à data
        $sqlMov = "SELECT 
                    SUM(CASE WHEN tipo_movimento = 'Receita' THEN valor ELSE -valor END) as total_movido
                   FROM lancamentos 
                   WHERE conta_bancaria_id = ? AND data_movimento < ?";
        
        $stmtMov = $this->db->prepare($sqlMov);
        $stmtMov->execute([$contaId, $dataReferencia]);
        $totalMovido = (float) $stmtMov->fetchColumn();

        return $saldoBase + $totalMovido;
    }

    /**
     * Centraliza a criação de lançamentos financeiros para manter a rastreabilidade.
     */
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

    /**
     * Busca informações do fornecedor vinculado a um contrato.
     */
    public function getFornecedorPorContrato(int $contratoId): string {
        $sql = "SELECT COALESCE(f.razao_social, a.fornecedor) as nome
                FROM contratos c
                LEFT JOIN atas a ON c.id_ata = a.id
                LEFT JOIN fornecedores f ON c.fornecedor_id = f.id
                WHERE c.id = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$contratoId]);
        $nome = $stmt->fetchColumn();

        if (!$nome) throw new Exception("Fornecedor não localizado para o contrato ID: $contratoId");
        
        return $nome;
    }
}