<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entidade;
use App\Models\User;
use App\Models\PlanoConta;
use Inertia\Inertia;

class EntidadeController extends Controller
{
    public function index()
{
    $entidade = Entidade::first() ?? new Entidade();
    $usuarios = User::orderBy('name')->get(); 
    $planoContas = PlanoConta::orderBy('codigo')->get(); // Busca as contas ordenadas pelo código
    
    return Inertia::render('Configuracoes/Entidade/Index', [
        'entidade' => $entidade,
        'usuarios' => $usuarios,
        'planoContas' => $planoContas
    ]);
}
    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome_fundo' => 'required|string|max:255',
            'cnpj' => 'required|string|max:20',
            'gestor_nome' => 'nullable|string|max:255',
            'gestor_cpf' => 'nullable|string|max:20',
            'cep' => 'nullable|string|max:15',
            'endereco' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:50',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'uf' => 'nullable|string|max:2',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        // Atualiza o registo ID 1, ou cria se não existir
        Entidade::updateOrCreate(['id' => 1], $dados);

        return redirect()->back()->with('success', 'Dados do Fundo atualizados com sucesso!');
    }
}