<?php
namespace App\Modules\Dashboard\Controllers;

use App\Config\Database;
use PDO;

class DashboardController {
    
    // Rota: GET / (Carrega o painel principal)
    public function index() {
        require_once __DIR__ . '/../Views/main.php';
    }

    // Rota: GET /login (Carrega a tela de login)
    public function login() {
        require_once __DIR__ . '/../Views/login.php';
    }

    // Rota: POST /api/auth/login (Processa a autenticação)
    public function autenticar() {
        header('Content-Type: application/json');
        
        // Pega os dados enviados em JSON
        $input = file_get_contents('php://input');
        $d = json_decode($input, true);

        if (!$d) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Dados inválidos.']);
            return;
        }

        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM usuarios WHERE email = ? AND ativo = 1");
        $stmt->execute([$d['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($d['senha'], $user['senha'])) {
             // Regenera ID da sessão para segurança
             session_regenerate_id(true); 
             $_SESSION['usuario_id'] = $user['id'];
             $_SESSION['usuario_nome'] = $user['nome'];
             echo json_encode(['status' => 'ok']);
        } else {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Credenciais inválidas.']);
        }
    }

    public function getDados() {
        $db = Database::getInstance();
        $response = [];

        try {
            // 1. Resumos Financeiros
            $ent = $db->query("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE tipo_movimento = 'Receita'")->fetchColumn();
            $sai = $db->query("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE tipo_movimento = 'Despesa'")->fetchColumn();
            
            // Cálculos
            $saldoAtual = $ent - $sai;
            
            $response['resumo'] = [
                'total_entradas' => (float)$ent,
                'total_saidas'   => (float)$sai,
                'saldo_atual'    => (float)$saldoAtual,
                'saldo_disponivel'=> (float)$saldoAtual
            ];

            // 2. Gráfico: Saldo por Programa
            $sqlProgramas = "
                SELECT 
                    p.nome_programa,
                    (SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE programa_id = p.id AND tipo_movimento = 'Receita') as receitas,
                    (SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE programa_id = p.id AND tipo_movimento = 'Despesa') as despesas
                FROM programas_fontes p
                WHERE p.ativo = 1
            ";
            $programas = $db->query($sqlProgramas)->fetchAll(PDO::FETCH_ASSOC);
            
            $chartData = [];
            foreach($programas as $p) {
                $saldo = $p['receitas'] - $p['despesas'];
                if($p['receitas'] > 0 || $p['despesas'] > 0) {
                    $chartData[] = [
                        'programa' => $p['nome_programa'],
                        'saldo' => $saldo
                    ];
                }
            }
            $response['grafico_programas'] = $chartData;

            // 3. Saldos Bancários
            $contas = $db->query("SELECT * FROM contas_bancarias_entidade")->fetchAll(PDO::FETCH_ASSOC);
            $saldos = [];
            foreach($contas as $c) {
                $e = $db->query("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE conta_bancaria_id = {$c['id']} AND tipo_movimento = 'Receita'")->fetchColumn();
                $s = $db->query("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE conta_bancaria_id = {$c['id']} AND tipo_movimento = 'Despesa'")->fetchColumn();
                
                $saldos[] = [
                    'banco' => $c['banco'],
                    'conta' => $c['conta'],
                    'descricao' => $c['descricao'],
                    'saldo' => number_format(($c['saldo_inicial'] + $e - $s), 2, ',', '.')
                ];
            }
            $response['contas'] = $saldos;

            // OBS: O Sistema de Alertas foi movido para AlertasController para corrigir conflitos e erros SQL.

            header('Content-Type: application/json');
            echo json_encode($response);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function logout() {
        session_destroy();
        header('Location: /login'); 
        exit;
    }
}
?>