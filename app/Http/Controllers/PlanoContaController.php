<?php

namespace App\Http\Controllers;

use App\Models\PlanoConta;
use Illuminate\Http\Request;

class PlanoContaController extends Controller
{
    public function store(Request $request)
    {
        $dados = $request->validate([
            'codigo' => 'required|string|max:50',
            'descricao' => 'required|string|max:255',
            'tipo' => 'required|in:Receita,Despesa',
        ]);

        PlanoConta::create($dados);

        return redirect()->back()->with('success', 'Conta adicionada ao Plano de Contas!');
    }

    public function destroy(PlanoConta $planoConta)
    {
        // No futuro, podemos adicionar uma trava aqui para não deixar apagar se a conta já tiver lançamentos vinculados!
        $planoConta->delete();
        return redirect()->back()->with('success', 'Conta excluída!');
    }
}