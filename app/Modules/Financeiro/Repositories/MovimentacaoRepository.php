<?php
namespace App\Modules\Financeiro\Repositories;

use App\Config\Database;
use PDO;
use Exception;

/**
 * MovimentacaoRepository
 * Camada de Acesso a Dados (DAO) - Padrão Senior
 * Responsável exclusivamente por queries seguras e transações de BD.
 */
class MovimentacaoRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // =========================================================================
    // 1. EMPENHOS E PROTOCOLOS
    // =========================================================================

    public function buscarEmpenhos(?int $programaId = null): array {
        $params = [];
        $sql = "SELECT e.*, p.nome_programa, c.numero_contrato 
                FROM despesas_empenhadas e 
                JOIN programas_fontes p ON e.programa_id = p.id 
                LEFT JOIN contratos c ON e.contrato_id = c.id 
                WHERE 1=1";
                
        if ($programaId) {
            $sql .= " AND e.programa_id = :progId";
            $params['progId'] = $programaId;
        }
        
        $sql .= " ORDER BY e.data_emissao DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarUltimoProtocoloAno(string $ano): ?string {
        $sql = "SELECT protocolo_entrada FROM despesas_empenhadas 
                WHERE protocolo_entrada LIKE :formato 
                ORDER BY id DESC LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['formato' => "%/$ano"]);
        return $stmt->fetchColumn() ?: null;
    }

    public function buscarEmpenhoPorId(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM despesas_empenhadas WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function salvarEmpenhoCompleto(array $data, float $valor, string $credor): void {
        $id = $data['id'] ?? null;
        $params = [
            $data['protocolo_entrada'] ?? null,
            !empty($data['data_protocolo']) ? $data['data_protocolo'] : null,
            $data['nota_fiscal'] ?? null,
            (int)$data['programa_id'],
            $data['data_emissao'],
            $data['data_vencimento'],
            $credor,
            $data['descricao'] ?? '',
            $valor,
            !empty($data['contrato_id']) ? (int)$data['contrato_id'] : null,
            $data['elemento_despesa'] ?? null,
            $data['tipo_origem'] ?? 'Direta',
            (int)$data['conta_bancaria_id']
        ];

        if ($id) {
            $sql = "UPDATE despesas_empenhadas SET 
                    protocolo_entrada=?, data_protocolo=?, nota_fiscal=?, programa_id=?, data_emissao=?, data_vencimento=?, credor=?, descricao=?, 
                    valor_total=?, contrato_id=?, elemento_despesa=?, tipo_origem=?, conta_bancaria_id=?
                    WHERE id=?";
            $params[] = $id;
        } else {
            $sql = "INSERT INTO despesas_empenhadas 
                    (protocolo_entrada, data_protocolo, nota_fiscal, programa_id, data_emissao, data_vencimento, credor, descricao, valor_total, status, contrato_id, elemento_despesa, tipo_origem, conta_bancaria_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendente', ?, ?, ?, ?)";
        }
        
        $this->db->prepare($sql)->execute($params);
    }

    public function deletarEmpenhoComLancamentos(int $id): void {
        Database::beginTransaction();
        try {
            $this->db->prepare("DELETE FROM lancamentos WHERE documento_ref = ?")->execute(["EMP-" . $id]);
            $this->db->prepare("DELETE FROM despesas_empenhadas WHERE id=?")->execute([$id]);
            Database::commit();
        } catch (Exception $e) {
            Database::rollBack();
            throw $e;
        }
    }

    // =========================================================================
    // 2. EXTRATOS E LANÇAMENTOS
    // =========================================================================

    public function buscarLancamentosSimples(?int $progId = null): array {
        $sql = "SELECT l.*, p.nome_programa 
                FROM lancamentos l 
                LEFT JOIN programas_fontes p ON l.programa_id = p.id 
                WHERE 1=1";
        $params = [];
        if ($progId) {
            $sql .= " AND l.programa_id = :progId";
            $params['progId'] = $progId;
        }
        $sql .= " ORDER BY l.data_movimento DESC LIMIT 200";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarLancamentosRealizados(int $contaId, ?int $progId, ?string $dataIni, ?string $dataFim): array {
        $sql = "SELECT l.id, l.data_movimento, l.tipo_movimento, l.descricao, l.valor, 'Realizado' as status_item 
                FROM lancamentos l WHERE l.conta_bancaria_id = :contaId";
        $params = [':contaId' => $contaId];
        
        if ($progId) { $sql .= " AND l.programa_id = :progId"; $params[':progId'] = $progId; }
        if ($dataIni) { $sql .= " AND l.data_movimento >= :dataIni"; $params[':dataIni'] = $dataIni; }
        if ($dataFim) { $sql .= " AND l.data_movimento <= :dataFim"; $params[':dataFim'] = $dataFim; }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarEmpenhosPendentes(int $contaId, ?int $progId, ?string $dataIni, ?string $dataFim): array {
        $sql = "SELECT e.id, e.data_vencimento as data_movimento, 'Despesa' as tipo_movimento, 
                       CONCAT(e.descricao, ' (Previsto)') as descricao, e.valor_total as valor, 'Pendente' as status_item
                FROM despesas_empenhadas e 
                WHERE e.status = 'Pendente' AND e.conta_bancaria_id = :contaId";
        $params = [':contaId' => $contaId];
        
        if ($progId) { $sql .= " AND e.programa_id = :progId"; $params[':progId'] = $progId; }
        if ($dataIni) { $sql .= " AND e.data_vencimento >= :dataIni"; $params[':dataIni'] = $dataIni; }
        if ($dataFim) { $sql .= " AND e.data_vencimento <= :dataFim"; $params[':dataFim'] = $dataFim; }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // =========================================================================
    // 3. RECEITAS
    // =========================================================================

    public function buscarReceitas(?int $programaId = null): array {
        $params = [];
        $sql = "SELECT r.*, p.nome_programa, c.descricao as conta_nome 
                FROM receitas r 
                JOIN programas_fontes p ON r.programa_id = p.id 
                LEFT JOIN contas_bancarias_entidade c ON r.conta_bancaria_id = c.id 
                WHERE 1=1";
                
        if ($programaId) { 
            $sql .= " AND r.programa_id = :progId"; 
            $params['progId'] = $programaId; 
        }
        
        $sql .= " ORDER BY r.data_registro DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function deletarReceitaComLancamentos(int $id): void {
        Database::beginTransaction();
        try {
            $this->db->prepare("DELETE FROM lancamentos WHERE documento_ref = ?")->execute(["REC-" . $id]);
            $this->db->prepare("DELETE FROM receitas WHERE id=?")->execute([$id]);
            Database::commit();
        } catch (Exception $e) {
            Database::rollBack();
            throw $e;
        }
    }

    // =========================================================================
    // 4. MÉTODOS AUXILIARES E DASHBOARD (Correções de Erro)
    // =========================================================================

    public function buscarContratosAtivos(): array {
        $sql = "SELECT c.id, c.numero_contrato, COALESCE(f.razao_social, a.fornecedor) as fornecedor,
                       c.valor_contratado - (SELECT COALESCE(SUM(valor_total),0) FROM despesas_empenhadas WHERE contrato_id = c.id) as saldo_restante
                FROM contratos c 
                LEFT JOIN atas a ON c.id_ata = a.id 
                LEFT JOIN fornecedores f ON c.fornecedor_id = f.id
                WHERE c.data_fim_vigencia >= CURDATE()
                ORDER BY c.numero_contrato";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarConsolidadoDiretas(): array {
        $sql = "SELECT elemento_despesa as elemento, COUNT(*) as qtd, SUM(valor_total) as total 
                FROM despesas_empenhadas 
                WHERE (tipo_origem = 'Direta' OR tipo_origem IS NULL) AND elemento_despesa IS NOT NULL 
                GROUP BY elemento_despesa";
        $dados = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        foreach($dados as &$l) {
            $l['total'] = number_format($l['total'], 2, ',', '.');
        }
        return $dados;
    }

    public function buscarDadosRelatorioLivro(): array {
        // Função auxiliar para impressão de PDF no Relatório
        $sql = "SELECT l.data_movimento, l.tipo_movimento, l.descricao, l.valor, 'Realizado' as status_item 
                FROM lancamentos l ORDER BY l.data_movimento DESC LIMIT 500";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
}