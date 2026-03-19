<?php

namespace Modules\Financeiro\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; // IMPORTANTE: Adicione esta linha
use Modules\Financeiro\Models\ContaBancaria;
use Inertia\Inertia;

class ContaBancariaController extends Controller
{
    public function index()
    {
        $contas = ContaBancaria::orderBy('id', 'desc')->get(); // Agora listamos da mais recente para a mais antiga
        return Inertia::render('Financeiro/Contas/Index', ['contas' => $contas]);
    }

    // NOVO MÉTODO: Gravar a Conta
    public function store(Request $request)
    {
        // 1. O Laravel valida os dados automaticamente
        $validated = $request->validate([
            'banco' => 'required|string|max:100',
            'agencia' => 'nullable|string|max:20',
            'conta' => 'required|string|max:30',
            'tipo' => 'required|in:Corrente,Poupança,Investimento,Caixa',
            'saldo_inicial' => 'required|numeric|min:0',
        ]);

        // 2. O saldo atual inicial é igual ao saldo inicial
        $validated['saldo_atual'] = $validated['saldo_inicial'];

        // 3. Salva no banco de dados
        ContaBancaria::create($validated);

        // 4. Retorna para a mesma página (O Inertia atualiza o React magicamente)
        return redirect()->route('financeiro.contas.index');
    }

    // Excluir a Conta
    public function destroy($id)
    {
        $conta = ContaBancaria::findOrFail($id);
        $conta->delete();

        // O Inertia atualiza a tabela automaticamente no frontend!
        return redirect()->route('financeiro.contas.index');
    }

    // Atualizar a Conta
   public function update(Request $request, $id)
    {
        $conta = ContaBancaria::findOrFail($id);

        $validated = $request->validate([
            'banco' => 'required|string|max:100',
            'agencia' => 'nullable|string|max:20',
            'conta' => 'required|string|max:30',
            'tipo' => 'required|in:Corrente,Poupança,Investimento,Caixa',
            'saldo_inicial' => 'required|numeric|min:0', 
        ]);

        // regra provisória enquanto não temos lançamentos de receitas e despesas
        $validated['saldo_atual'] = $validated['saldo_inicial'];

        $conta->update($validated);

        return redirect()->route('financeiro.contas.index');
    }
}