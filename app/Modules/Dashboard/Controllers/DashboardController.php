<?php

namespace App\Modules\Dashboard\Controllers;

use App\Config\Database;
use PDO;

class DashboardController {
    
    /**
     * Identifica a pasta raiz do projeto automaticamente.
     * Ex: Converte '/' para '/sige-saude-dev/public' se necessário.
     */
    private function getBaseUrl() {
        $base = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
        return ($base === '/') ? '' : $base;
    }

    // Rota: GET / (Carrega o painel principal)
    public function index() {
        // Se não estiver logado, manda para o login (com o caminho correto)
        if (!isset($_SESSION['user_id'])) {
            header('Location: ' . $this->getBaseUrl() . '/login');
            exit;
        }
        require_once __DIR__ . '/../Views/main.php';
    }

    // Rota: GET /login (Carrega a tela de login)
    public function login() {
        // Se já estiver logado, manda para o dashboard (com o caminho correto)
        if (isset($_SESSION['user_id'])) {
            header('Location: ' . $this->getBaseUrl() . '/');
            exit;
        }
        require_once __DIR__ . '/../Views/login.php';
    }

    // Rota: POST /api/auth/login (Processa a autenticação)
    public function apiLogin() {
        header('Content-Type: application/json');
        
        try {
            $input = file_get_contents('php://input');
            $d = json_decode($input, true);

            if (!$d || !isset($d['email']) || !isset($d['senha'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Dados incompletos.']);
                return;
            }

            $db = Database::getInstance();
            $stmt = $db->prepare("SELECT * FROM usuarios WHERE email = ? AND ativo = 1");
            $stmt->execute([$d['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($d['senha'], $user['senha'])) {
                 session_regenerate_id(true); 
                 
                 $_SESSION['user_id'] = $user['id'];
                 $_SESSION['user_nome'] = $user['nome'];
                 $_SESSION['user_email'] = $user['email'];

                 // CORREÇÃO CRÍTICA AQUI:
                 // O redirect agora inclui a pasta do projeto
                 echo json_encode([
                     'status' => 'ok',
                     'redirect' => $this->getBaseUrl() . '/', 
                     'message' => 'Login realizado com sucesso!'
                 ]);
            } else {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'E-mail ou senha incorretos.']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro interno: ' . $e->getMessage()]);
        }
    }

    // Rota: GET /logout
    public function logout() {
        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        session_destroy();
        
        // Redireciona para o login (com o caminho correto)
        header('Location: ' . $this->getBaseUrl() . '/login'); 
        exit;
    }

    // API para buscar dados do Dashboard
    public function getDados() {
        header('Content-Type: application/json');
        
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autorizado']);
            return;
        }

        $db = Database::getInstance();
        $response = [];

        try {
            // 1. Resumos Financeiros
            $ent = $db->query("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE tipo_movimento = 'Receita'")->fetchColumn();
            $sai = $db->query("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE tipo_movimento = 'Despesa'")->fetchColumn();
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

            echo json_encode($response);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar dados: ' . $e->getMessage()]);
        }
    }
}