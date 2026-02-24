<?php
namespace App\Modules\Financeiro\Controllers;

use App\Modules\Financeiro\Services\MovimentacaoService;
use App\Modules\Financeiro\Repositories\MovimentacaoRepository;
use Exception;

/**
 * MovimentacaoController
 * Orquestrador Full-Stack Senior - Versão Corrigida e Segura.
 */
class MovimentacaoController {
    private MovimentacaoService $service;
    private MovimentacaoRepository $repository;

    public function __construct() {
        $this->service = new MovimentacaoService();
        $this->repository = new MovimentacaoRepository();
    }

    // --- EMPENHOS ---

    public function listarEmpenhos(): void {
        $progId = !empty($_GET['programa_id']) && $_GET['programa_id'] !== 'todos' ? (int)$_GET['programa_id'] : null;
        echo json_encode($this->repository->buscarEmpenhos($progId));
    }

    public function getProximoProtocolo(): void {
        $ano = date('Y');
        $ultimo = $this->repository->buscarUltimoProtocoloAno($ano);
        $seq = $ultimo ? (int)explode('/', $ultimo)[0] + 1 : 1;
        echo json_encode(['protocolo' => str_pad((string)$seq, 3, '0', STR_PAD_LEFT) . "/$ano"]);
    }

    public function salvarEmpenho(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $valor = (float) str_replace(',', '.', preg_replace('/[^\d,]/', '', $data['valor_total'] ?? '0'));
            $id = isset($data['id']) ? (int)$data['id'] : null;
            $contratoId = !empty($data['contrato_id']) ? (int)$data['contrato_id'] : null;
            $credor = $data['credor'] ?? '';

            if (($data['tipo_origem'] ?? '') === 'Contrato' && $contratoId) {
                $this->service->validarSaldoContratual($contratoId, $valor, $id);
                $credor = $this->service->getFornecedorPorContrato($contratoId);
            }

            if ($valor <= 0) throw new Exception("O valor total deve ser maior que zero.");
            if (empty($credor)) throw new Exception("Fornecedor/Credor não identificado."); // Correção Crítica
            
            $this->repository->salvarEmpenhoCompleto($data, $valor, $credor);
            echo json_encode(['status' => 'ok']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function pagarEmpenho(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $this->service->processarPagamento($data['id'], $data['data_pagamento']);
            echo json_encode(['status' => 'ok']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function excluirEmpenho(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $this->repository->deletarEmpenhoComLancamentos((int)$data['id']);
            echo json_encode(['status' => 'ok']);
        } catch (Exception $e) {
            http_response_code(500); // Correção Crítica: Adicionado status 500
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // --- EXTRATOS E LIVRO DIÁRIO ---

    public function listarLancamentos(): void { $this->gerarExtratoConsolidado(false); }
    public function listarLivroDiario(): void { $this->gerarExtratoConsolidado(true); }

    private function gerarExtratoConsolidado(bool $incluirPendentes): void {
        try {
            $contaId = (int)($_GET['conta_id'] ?? 0);
            $progId = !empty($_GET['programa_id']) && $_GET['programa_id'] !== 'todos' ? (int)$_GET['programa_id'] : null;
            $dataIni = !empty($_GET['data_inicio']) ? $_GET['data_inicio'] : null;
            $dataFim = !empty($_GET['data_fim']) ? $_GET['data_fim'] : null;

            if (!$contaId) {
                echo json_encode(['status' => 'ok', 'itens' => $this->repository->buscarLancamentosSimples($progId)]);
                return;
            }

            $saldoCorrente = $this->service->calcularSaldoAnterior($contaId, $dataIni ?: date('Y-m-d'));
            $saldoAnteriorRef = $saldoCorrente;

            $realizados = $this->repository->buscarLancamentosRealizados($contaId, $progId, $dataIni, $dataFim);
            $pendentes = $incluirPendentes ? $this->repository->buscarEmpenhosPendentes($contaId, $progId, $dataIni, $dataFim) : [];

            $todos = array_merge($realizados, $pendentes);
            usort($todos, fn($a, $b) => strcmp($a['data_movimento'], $b['data_movimento']));

            foreach ($todos as &$item) {
                $saldoCorrente += ($item['tipo_movimento'] === 'Receita' ? (float)$item['valor'] : -(float)$item['valor']);
                $item['saldo_acumulado'] = $saldoCorrente;
            }

            echo json_encode(['status' => 'ok', 'saldo_anterior' => $saldoAnteriorRef, 'itens' => array_reverse($todos)]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // --- RECEITAS ---

    public function listarReceitas(): void {
        $progId = !empty($_GET['programa_id']) && $_GET['programa_id'] !== 'todos' ? (int)$_GET['programa_id'] : null;
        echo json_encode($this->repository->buscarReceitas($progId));
    }

    public function salvarReceita(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $this->service->registrarReceitaCompleta($data);
            echo json_encode(['status' => 'ok']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function excluirReceita(): void {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $this->repository->deletarReceitaComLancamentos((int)$data['id']);
            echo json_encode(['status' => 'ok']);
        } catch (Exception $e) {
            http_response_code(500); // Correção Crítica: Adicionado status 500
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // --- MÉTODOS AUXILIARES E RELATÓRIOS ---

    public function listarContratosAtivos(): void {
        echo json_encode($this->repository->buscarContratosAtivos());
    }

    public function getConsolidadoDiretas(): void {
        echo json_encode($this->repository->buscarConsolidadoDiretas());
    }

    public function imprimirEmpenho(): void {
        $id = (int)($_GET['id'] ?? 0);
        $e = $this->repository->buscarEmpenhoPorId($id);
        if ($e) require __DIR__ . '/../Views/print/empenho.php';
        else echo "Empenho não encontrado.";
    }

    public function gerarRelatorioPDF(): void {
        $tipo = $_GET['tipo'] ?? '';
        $dados = [];
        
        // Correção Crítica: Reversão para a lógica original segura para o relatório
        if ($tipo === 'livro_diario') {
            ob_start();
            $this->listarLivroDiario();
            $json = ob_get_clean();
            
            $res = json_decode($json, true);
            $dados = $res['itens'] ?? [];
        } 
        else if ($tipo === 'lancamentos') {
            $dados = $this->repository->buscarLancamentosSimples();
        }
        
        require __DIR__ . '/../Views/print/relatorio.php';
    }
}