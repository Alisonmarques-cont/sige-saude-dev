<?php
namespace App\Modules\Financeiro\Controllers;

use App\Config\Database;
use PDO;

class MovimentacaoController {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // =========================================================================
    // EMPENHOS
    // =========================================================================

    public function listarEmpenhos() {
        $progId = $_GET['programa_id'] ?? 'todos';
        
        $sql = "SELECT e.*, p.nome_programa, c.numero_contrato 
                FROM despesas_empenhadas e 
                JOIN programas_fontes p ON e.programa_id = p.id 
                LEFT JOIN contratos c ON e.contrato_id = c.id 
                WHERE 1=1";
                
        if ($progId !== 'todos' && $progId !== '') {
            $sql .= " AND e.programa_id = " . intval($progId);
        }
        
        $sql .= " ORDER BY e.data_emissao DESC";
        echo json_encode($this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC));
    }

    public function getProximoProtocolo() {
        $anoAtual = date('Y');
        $sql = "SELECT protocolo_entrada FROM despesas_empenhadas 
                WHERE protocolo_entrada LIKE ? 
                ORDER BY id DESC LIMIT 1";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(["%/$anoAtual"]);
        $ultimo = $stmt->fetchColumn();

        if ($ultimo) {
            $partes = explode('/', $ultimo);
            $seq = intval($partes[0]) + 1;
        } else {
            $seq = 1;
        }

        $novoProtocolo = str_pad($seq, 3, '0', STR_PAD_LEFT) . "/$anoAtual";
        echo json_encode(['protocolo' => $novoProtocolo]);
    }

    public function salvarEmpenho() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $valorStr = $data['valor_total'] ?? '0';
        $cleanStr = preg_replace('/[^\d,]/', '', $valorStr); 
        $valor = (float) str_replace(',', '.', $cleanStr);

        $id = $data['id'] ?? null;
        
        $protocolo = $data['protocolo_entrada'] ?? null;
        $dataProtocolo = !empty($data['data_protocolo']) ? $data['data_protocolo'] : null;
        $notaFiscal = $data['nota_fiscal'] ?? null;
        
        $credor = $data['credor'] ?? '';
        $contratoId = !empty($data['contrato_id']) ? intval($data['contrato_id']) : null;
        $tipoOrigem = $data['tipo_origem'] ?? 'Direta';

        if ($valor <= 0) {
            http_response_code(400); 
            echo json_encode(['status' => 'error', 'message' => 'O valor total deve ser maior que zero.']);
            return;
        }
        if (empty($data['programa_id']) || empty($data['conta_bancaria_id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Selecione o Programa e a Conta Bancária.']);
            return;
        }

        try {
            Database::beginTransaction();

            if ($tipoOrigem === 'Contrato' && $contratoId) {
                $sqlForn = "SELECT COALESCE(f.razao_social, a.fornecedor) as nome_fornecedor
                            FROM contratos c
                            LEFT JOIN atas a ON c.id_ata = a.id
                            LEFT JOIN fornecedores f ON c.fornecedor_id = f.id
                            WHERE c.id = ?";
                $stmtForn = $this->db->prepare($sqlForn);
                $stmtForn->execute([$contratoId]);
                $resForn = $stmtForn->fetch(PDO::FETCH_ASSOC);
                
                if($resForn) {
                    $credor = $resForn['nome_fornecedor'];
                } else {
                    throw new \Exception("Contrato inválido ou fornecedor não encontrado.");
                }

                $stmtC = $this->db->prepare("SELECT valor_contratado FROM contratos WHERE id = ?");
                $stmtC->execute([$contratoId]);
                $contratoData = $stmtC->fetch(PDO::FETCH_ASSOC);
                if ($contratoData) {
                    $stmtSoma = $this->db->prepare("SELECT COALESCE(SUM(valor_total), 0) FROM despesas_empenhadas WHERE contrato_id = ? AND id != ?");
                    $stmtSoma->execute([$contratoId, $id ?? 0]);
                    $jaGasto = (float) $stmtSoma->fetchColumn();
                    if ($valor > ($contratoData['valor_contratado'] - $jaGasto)) {
                        throw new \Exception("Saldo Contratual Insuficiente.");
                    }
                }
            }

            if (empty($credor)) throw new \Exception("Fornecedor/Credor não identificado.");

            $programaId = intval($data['programa_id']);
            $contaId    = intval($data['conta_bancaria_id']);
            $elemento   = !empty($data['elemento_despesa']) ? $data['elemento_despesa'] : null;

            if ($id) {
                $sql = "UPDATE despesas_empenhadas SET 
                        protocolo_entrada=?, data_protocolo=?, nota_fiscal=?, programa_id=?, data_emissao=?, data_vencimento=?, credor=?, descricao=?, 
                        valor_total=?, contrato_id=?, elemento_despesa=?, tipo_origem=?, conta_bancaria_id=?
                        WHERE id=?";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([
                    $protocolo, $dataProtocolo, $notaFiscal, $programaId, $data['data_emissao'], $data['data_vencimento'], $credor, 
                    $data['descricao'], $valor, $contratoId, $elemento, $tipoOrigem, $contaId, $id
                ]);

                $statusCheck = $this->db->query("SELECT status FROM despesas_empenhadas WHERE id = $id")->fetchColumn();
                if ($statusCheck === 'Pago') {
                    $ref = "EMP-" . $id;
                    $this->db->prepare("UPDATE lancamentos SET valor=?, descricao=?, programa_id=?, conta_bancaria_id=? WHERE documento_ref=?")
                             ->execute([$valor, $data['descricao'], $programaId, $contaId, $ref]);
                }

            } else {
                $sql = "INSERT INTO despesas_empenhadas 
                        (protocolo_entrada, data_protocolo, nota_fiscal, programa_id, data_emissao, data_vencimento, credor, descricao, valor_total, status, contrato_id, elemento_despesa, tipo_origem, conta_bancaria_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendente', ?, ?, ?, ?)";
                
                $stmt = $this->db->prepare($sql);
                $stmt->execute([
                    $protocolo, $dataProtocolo, $notaFiscal, $programaId, $data['data_emissao'], $data['data_vencimento'], $credor, 
                    $data['descricao'], $valor, $contratoId, $elemento, $tipoOrigem, $contaId
                ]);
            }

            Database::commit();
            echo json_encode(['status' => 'ok']);

        } catch (\Exception $e) {
            Database::rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
    
    public function pagarEmpenho() {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $dataPagamento = $data['data_pagamento'];

        try {
            Database::beginTransaction();

            $stmt = $this->db->prepare("SELECT * FROM despesas_empenhadas WHERE id = ?");
            $stmt->execute([$id]);
            $empenho = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$empenho) throw new \Exception("Empenho não encontrado.");
            if ($empenho['status'] === 'Pago') throw new \Exception("Este empenho já foi pago.");

            $this->db->prepare("UPDATE despesas_empenhadas SET status = 'Pago' WHERE id = ?")->execute([$id]);

            $sqlLanc = "INSERT INTO lancamentos (programa_id, tipo_movimento, data_movimento, valor, descricao, documento_ref, conta_bancaria_id) 
                        VALUES (?, 'Despesa', ?, ?, ?, ?, ?)";
            
            $this->db->prepare($sqlLanc)->execute([
                $empenho['programa_id'],
                $dataPagamento,
                $empenho['valor_total'],
                $empenho['descricao'] . " (PGTO EMP #$id)",
                "EMP-" . $id, 
                $empenho['conta_bancaria_id']
            ]);

            Database::commit();
            echo json_encode(['status' => 'ok']);

        } catch (\Exception $e) {
            Database::rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function excluirEmpenho() {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        try {
            Database::beginTransaction();
            $this->db->prepare("DELETE FROM lancamentos WHERE documento_ref = ?")->execute(["EMP-" . $id]);
            $this->db->prepare("DELETE FROM despesas_empenhadas WHERE id=?")->execute([$id]);
            Database::commit();
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            Database::rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // =========================================================================
    // EXTRATO E LIVRO DIÁRIO (COM SALDO ANTERIOR)
    // =========================================================================

    // Lista apenas os realizados (Extrato Bancário)
    public function listarLancamentos() {
        $this->gerarExtratoComum(false);
    }

    // [NOVO] Lista realizados + pendentes (Livro Diário)
    public function listarLivroDiario() {
        $this->gerarExtratoComum(true);
    }

    // Lógica compartilhada para calcular extrato e saldo
    private function gerarExtratoComum($incluirPendentes) {
        $contaId = $_GET['conta_id'] ?? '';
        $progId  = $_GET['programa_id'] ?? '';
        $dataIni = $_GET['data_inicio'] ?? '';
        $dataFim = $_GET['data_fim'] ?? '';

        // Se uma conta for selecionada, calculamos o saldo
        if (!empty($contaId)) {
            try {
                // 1. Saldo Inicial Configurado (Base)
                $stmt = $this->db->prepare("SELECT saldo_inicial FROM contas_bancarias_entidade WHERE id = ?");
                $stmt->execute([$contaId]);
                $saldoInicialConfig = (float) $stmt->fetchColumn();

                // 2. Calcular Saldo Anterior (Movimentos antes da Data Início)
                $saldoAnteriorMovimentos = 0;
                if (!empty($dataIni)) {
                    // Soma Receitas anteriores
                    $sqlEntradas = "SELECT COALESCE(SUM(valor), 0) FROM lancamentos 
                                    WHERE conta_bancaria_id = ? AND data_movimento < ? AND tipo_movimento = 'Receita'";
                    $stmtEnt = $this->db->prepare($sqlEntradas);
                    $stmtEnt->execute([$contaId, $dataIni]);
                    $entradasAnt = (float) $stmtEnt->fetchColumn();

                    // Soma Despesas anteriores
                    $sqlSaidas = "SELECT COALESCE(SUM(valor), 0) FROM lancamentos 
                                  WHERE conta_bancaria_id = ? AND data_movimento < ? AND tipo_movimento = 'Despesa'";
                    $stmtSai = $this->db->prepare($sqlSaidas);
                    $stmtSai->execute([$contaId, $dataIni]);
                    $saidasAnt = (float) $stmtSai->fetchColumn();

                    $saldoAnteriorMovimentos = $entradasAnt - $saidasAnt;
                }

                // O Saldo Anterior FINAL é o Base + Movimentos Anteriores
                $saldoCorrente = $saldoInicialConfig + $saldoAnteriorMovimentos;
                
                // Armazena este valor para enviar ao frontend
                $saldoAnteriorParaExibicao = $saldoCorrente;

                // 3. Buscar Itens do Período (REALIZADOS)
                $sqlReal = "SELECT l.id, l.data_movimento, l.tipo_movimento, l.descricao, l.valor, 'Realizado' as status_item 
                            FROM lancamentos l WHERE l.conta_bancaria_id = ?";
                $paramsReal = [$contaId];

                if(!empty($progId))  { $sqlReal .= " AND l.programa_id = ?"; $paramsReal[] = $progId; }
                if(!empty($dataIni)) { $sqlReal .= " AND l.data_movimento >= ?"; $paramsReal[] = $dataIni; }
                if(!empty($dataFim)) { $sqlReal .= " AND l.data_movimento <= ?"; $paramsReal[] = $dataFim; }

                $stmtReal = $this->db->prepare($sqlReal);
                $stmtReal->execute($paramsReal);
                $items = $stmtReal->fetchAll(PDO::FETCH_ASSOC);

                // 4. Buscar Itens PENDENTES (Apenas se for Livro Diário)
                if ($incluirPendentes) {
                    $sqlPen = "SELECT e.id, e.data_vencimento as data_movimento, 'Despesa' as tipo_movimento, 
                               CONCAT(e.descricao, ' (Previsto)') as descricao, e.valor_total as valor, 'Pendente' as status_item
                               FROM despesas_empenhadas e WHERE e.status = 'Pendente' AND e.conta_bancaria_id = ?";
                    $paramsPen = [$contaId];

                    if(!empty($progId))  { $sqlPen .= " AND e.programa_id = ?"; $paramsPen[] = $progId; }
                    if(!empty($dataIni)) { $sqlPen .= " AND e.data_vencimento >= ?"; $paramsPen[] = $dataIni; }
                    if(!empty($dataFim)) { $sqlPen .= " AND e.data_vencimento <= ?"; $paramsPen[] = $dataFim; }

                    $stmtPen = $this->db->prepare($sqlPen);
                    $stmtPen->execute($paramsPen);
                    $pendentes = $stmtPen->fetchAll(PDO::FETCH_ASSOC);
                    
                    $items = array_merge($items, $pendentes);
                }

                // 5. Ordenar por Data CRESCENTE para cálculo do saldo linha a linha
                usort($items, function($a, $b) {
                    if ($a['data_movimento'] == $b['data_movimento']) return 0;
                    return ($a['data_movimento'] < $b['data_movimento']) ? -1 : 1;
                });

                // 6. Calcular Saldo Acumulado em cada linha
                foreach ($items as &$row) {
                    $val = (float) $row['valor'];
                    if ($row['tipo_movimento'] === 'Receita') {
                        $saldoCorrente += $val;
                    } else {
                        $saldoCorrente -= $val;
                    }
                    $row['saldo_acumulado'] = $saldoCorrente;
                }

                // Inverte para exibir mais recente no topo (Padrão de Extrato Visual)
                $items = array_reverse($items);
                
                // RETORNO ESTRUTURADO (Branch Saldo Anterior)
                echo json_encode([
                    'status' => 'ok',
                    'saldo_anterior' => $saldoAnteriorParaExibicao,
                    'itens' => $items
                ]);

            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }

        } else {
            // Se não selecionar conta, mantemos o comportamento de listagem simples
            $sql = "SELECT l.*, p.nome_programa 
                    FROM lancamentos l 
                    LEFT JOIN programas_fontes p ON l.programa_id = p.id 
                    WHERE 1=1";
            
            if (!empty($progId)) $sql .= " AND l.programa_id = " . intval($progId);
            if (!empty($dataIni)) $sql .= " AND l.data_movimento >= '$dataIni'";
            if (!empty($dataFim)) $sql .= " AND l.data_movimento <= '$dataFim'";

            $sql .= " ORDER BY l.data_movimento DESC LIMIT 200";
            $rawItems = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
            
            // Retorna formato compatível
            echo json_encode([
                'status' => 'ok',
                'saldo_anterior' => null, // Não se aplica sem conta definida
                'itens' => $rawItems
            ]);
        }
    }

    // =========================================================================
    // RECEITAS
    // =========================================================================

    public function listarReceitas() {
        $progId = $_GET['programa_id'] ?? 'todos';
        $sql = "SELECT r.*, p.nome_programa, c.descricao as conta_nome 
                FROM receitas r 
                JOIN programas_fontes p ON r.programa_id = p.id 
                LEFT JOIN contas_bancarias_entidade c ON r.conta_bancaria_id = c.id 
                WHERE 1=1";
        if ($progId !== 'todos' && $progId !== '') {
            $sql .= " AND r.programa_id = " . intval($progId);
        }
        $sql .= " ORDER BY r.data_registro DESC";
        echo json_encode($this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC));
    }

    public function salvarReceita() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $cleanStr = preg_replace('/[^\d,]/', '', $data['valor']);
        $valor = (float) str_replace(',', '.', $cleanStr);
        
        $id = $data['id'] ?? null;
        try {
            Database::beginTransaction();
            if ($id) {
                $this->db->prepare("UPDATE receitas SET programa_id=?, data_registro=?, valor=?, descricao=?, conta_bancaria_id=? WHERE id=?")
                         ->execute([$data['programa_id'], $data['data_registro'], $valor, $data['descricao'], $data['conta_bancaria_id'] ?? null, $id]);
                $this->db->prepare("UPDATE lancamentos SET valor=?, descricao=?, data_movimento=?, programa_id=?, conta_bancaria_id=? WHERE documento_ref=?")
                         ->execute([$valor, $data['descricao'], $data['data_registro'], $data['programa_id'], $data['conta_bancaria_id'], "REC-" . $id]);
            } else {
                $this->db->prepare("INSERT INTO receitas (programa_id, data_registro, valor, descricao, conta_bancaria_id) VALUES (?,?,?,?,?)")
                         ->execute([$data['programa_id'], $data['data_registro'], $valor, $data['descricao'], !empty($data['conta_bancaria_id']) ? $data['conta_bancaria_id'] : null]);
                $novoId = $this->db->lastInsertId();
                $this->db->prepare("INSERT INTO lancamentos (programa_id, tipo_movimento, data_movimento, valor, descricao, documento_ref, conta_bancaria_id) VALUES (?, 'Receita', ?, ?, ?, ?, ?)")
                         ->execute([$data['programa_id'], $data['data_registro'], $valor, $data['descricao'], "REC-" . $novoId, $data['conta_bancaria_id']]);
            }
            Database::commit();
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            Database::rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
    
    public function excluirReceita() {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        try {
            Database::beginTransaction();
            $this->db->prepare("DELETE FROM lancamentos WHERE documento_ref = ?")->execute(["REC-" . $id]);
            $this->db->prepare("DELETE FROM receitas WHERE id=?")->execute([$id]);
            Database::commit();
            echo json_encode(['status' => 'ok']);
        } catch (\Exception $e) {
            Database::rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // =========================================================================
    // UTILITÁRIOS E RELATÓRIOS
    // =========================================================================

    public function getConsolidadoDiretas() {
        $sql = "SELECT elemento_despesa as elemento, COUNT(*) as qtd, SUM(valor_total) as total 
                FROM despesas_empenhadas 
                WHERE (tipo_origem = 'Direta' OR tipo_origem IS NULL) AND elemento_despesa IS NOT NULL 
                GROUP BY elemento_despesa";
        $dados = $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        foreach($dados as &$l) $l['total'] = number_format($l['total'], 2, ',', '.');
        echo json_encode($dados);
    }

    public function listarContratosAtivos() {
        $sql = "SELECT c.id, c.numero_contrato, COALESCE(f.razao_social, a.fornecedor) as fornecedor,
                       c.valor_contratado - (SELECT COALESCE(SUM(valor_total),0) FROM despesas_empenhadas WHERE contrato_id = c.id) as saldo_restante
                FROM contratos c 
                LEFT JOIN atas a ON c.id_ata = a.id 
                LEFT JOIN fornecedores f ON c.fornecedor_id = f.id
                WHERE c.data_fim_vigencia >= CURDATE()
                ORDER BY c.numero_contrato";
        echo json_encode($this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC));
    }

    public function imprimirEmpenho() {
        $id = $_GET['id'] ?? 0;
        $e = $this->db->query("SELECT * FROM despesas_empenhadas WHERE id = " . intval($id))->fetch(PDO::FETCH_ASSOC);
        if($e) {
            require __DIR__ . '/../Views/print/empenho.php';
        } else {
            echo "Empenho não encontrado.";
        }
    }

    public function gerarRelatorioPDF() {
        $tipo = $_GET['tipo'] ?? '';
        $dados = [];
        
        if ($tipo === 'livro_diario') {
            ob_start();
            $this->listarLivroDiario();
            $json = ob_get_clean();
            
            // Decodifica a nova estrutura
            $res = json_decode($json, true);
            $dados = $res['itens'] ?? [];
            // Nota: Para impressão PDF simples, o saldo anterior poderia ser adicionado aqui, 
            // mas o template print/relatorio.php teria que ser ajustado.
        } 
        else if ($tipo === 'lancamentos') {
            $dados = $this->db->query("SELECT * FROM lancamentos ORDER BY data_movimento DESC LIMIT 50")->fetchAll(PDO::FETCH_ASSOC);
        }
        
        require __DIR__ . '/../Views/print/relatorio.php';
    }
}
?>