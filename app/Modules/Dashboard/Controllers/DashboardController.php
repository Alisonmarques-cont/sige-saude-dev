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
        
        // Garante que exista um exercício selecionado caso tenha passado direto pela sessão
        if (!isset($_SESSION['ano_exercicio'])) {
            $_SESSION['ano_exercicio'] = date('Y');
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
                 
                 // DEFINIÇÃO DO EXERCÍCIO ATUAL NO LOGIN
                 $_SESSION['ano_exercicio'] = date('Y'); 

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
        
        // Resgata o exercício atual da sessão de forma segura (Fallback para o ano atual)
        $ano = intval($_SESSION['ano_exercicio'] ?? date('Y'));

        try {
            // 1. Resumos Financeiros do Exercício
            $stmtEnt = $db->prepare("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE tipo_movimento = 'Receita' AND ano_exercicio = :ano");
            $stmtEnt->execute(['ano' => $ano]);
            $ent = $stmtEnt->fetchColumn();

            $stmtSai = $db->prepare("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE tipo_movimento = 'Despesa' AND ano_exercicio = :ano");
            $stmtSai->execute(['ano' => $ano]);
            $sai = $stmtSai->fetchColumn();
            
            $saldoAtual = $ent - $sai;
            
            $response['resumo'] = [
                'total_entradas' => (float)$ent,
                'total_saidas'   => (float)$sai,
                'saldo_atual'    => (float)$saldoAtual,
                'saldo_disponivel'=> (float)$saldoAtual
            ];

            // 2. Gráfico: Saldo por Programa no Exercício
            $sqlProgramas = "
                SELECT 
                    p.nome_programa,
                    (SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE programa_id = p.id AND tipo_movimento = 'Receita' AND ano_exercicio = :ano1) as receitas,
                    (SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE programa_id = p.id AND tipo_movimento = 'Despesa' AND ano_exercicio = :ano2) as despesas
                FROM programas_fontes p
                WHERE p.ativo = 1
            ";
            
            $stmtProg = $db->prepare($sqlProgramas);
            // Executa injetando o ano de forma segura nas subqueries
            $stmtProg->execute(['ano1' => $ano, 'ano2' => $ano]);
            $programas = $stmtProg->fetchAll(PDO::FETCH_ASSOC);
            
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

            // 3. Saldos Bancários (Movimentação do Exercício)
            $contas = $db->query("SELECT * FROM contas_bancarias_entidade")->fetchAll(PDO::FETCH_ASSOC);
            $saldos = [];
            
            // Preparar as queries FORA do loop para otimização e prevenção de SQL Injection
            $stmtBancoEnt = $db->prepare("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE conta_bancaria_id = :conta_id AND tipo_movimento = 'Receita' AND ano_exercicio = :ano");
            $stmtBancoSai = $db->prepare("SELECT COALESCE(SUM(valor), 0) FROM lancamentos WHERE conta_bancaria_id = :conta_id AND tipo_movimento = 'Despesa' AND ano_exercicio = :ano");

            foreach($contas as $c) {
                $stmtBancoEnt->execute(['conta_id' => $c['id'], 'ano' => $ano]);
                $e = $stmtBancoEnt->fetchColumn();

                $stmtBancoSai->execute(['conta_id' => $c['id'], 'ano' => $ano]);
                $s = $stmtBancoSai->fetchColumn();
                
                // O saldo soma-se ao valor inicial global da conta
                $saldoConta = $c['saldo_inicial'] + $e - $s;

                $saldos[] = [
                    'banco' => $c['banco'],
                    'conta' => $c['conta'],
                    'descricao' => $c['descricao'],
                    'saldo' => number_format($saldoConta, 2, ',', '.')
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