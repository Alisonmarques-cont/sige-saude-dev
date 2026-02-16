<?php

namespace App\Modules\Dashboard\Controllers;

use App\Config\Database;
use PDO;

class AlertasController {

    public function getAlertas() {
        $db = Database::getInstance();
        $alertas = [];

        try {
            // 1. Verificar Contratos Vencendo (Próximos 60 dias)
            // CORREÇÃO: Nome da coluna data_fim_vigencia ajustado conforme schema
            $stmt = $db->query("
                SELECT c.id, c.numero_contrato, COALESCE(f.razao_social, a.fornecedor, 'N/A') as fornecedor, c.data_fim_vigencia,
                DATEDIFF(c.data_fim_vigencia, CURDATE()) as dias_restantes
                FROM contratos c
                LEFT JOIN atas a ON c.id_ata = a.id
                LEFT JOIN fornecedores f ON c.fornecedor_id = f.id
                WHERE c.data_fim_vigencia BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 60 DAY)
                ORDER BY c.data_fim_vigencia ASC
            ");
            
            if ($stmt) {
                $contratos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($contratos as $c) {
                    $alertas[] = [
                        'tipo' => 'aviso', 
                        'icone' => 'ph-calendar-warning',
                        'titulo' => 'Contrato Vencendo',
                        'mensagem' => "Contrato {$c['numero_contrato']} vence em {$c['dias_restantes']} dias.",
                        'link' => 'contratos' // Link interno
                    ];
                }
            }

            // 2. Verificar Empenhos Vencidos e Pendentes
            // CORREÇÃO: Tabela 'empenhos' não existe. O correto é 'despesas_empenhadas'.
            $stmt = $db->query("
                SELECT id, credor, data_vencimento, valor_total
                FROM despesas_empenhadas
                WHERE status = 'Pendente' 
                AND data_vencimento < CURDATE()
                ORDER BY data_vencimento ASC
            ");

            if ($stmt) {
                $empenhos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($empenhos as $e) {
                    $dataVenc = date('d/m/Y', strtotime($e['data_vencimento']));
                    $valor = number_format($e['valor_total'], 2, ',', '.');
                    $alertas[] = [
                        'tipo' => 'erro', 
                        'icone' => 'ph-warning-circle',
                        'titulo' => 'Pagamento Atrasado',
                        'mensagem' => "Empenho p/ {$e['credor']} (R$ {$valor}) venceu em {$dataVenc}.",
                        'link' => 'empenhos'
                    ];
                }
            }

            header('Content-Type: application/json');
            echo json_encode(['status' => 'ok', 'dados' => $alertas, 'total' => count($alertas)]);

        } catch (\Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        exit;
    }
}