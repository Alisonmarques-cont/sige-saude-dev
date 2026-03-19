<?php

namespace Modules\Financeiro\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Financeiro\Models\Lancamento;
use Modules\Financeiro\Models\ContaBancaria;
use Modules\Financeiro\Models\Fornecedor;
use Inertia\Inertia;

class LancamentoController extends Controller
{
    public function index()
    {
        // 1. Busca os lançamentos e traz junto os dados da Conta e do Fornecedor associados
        $lancamentos = Lancamento::with(['contaBancaria', 'fornecedor'])
            ->orderBy('data_vencimento', 'asc')
            ->get();

        // 2. Busca as opções para preencher os Selects do formulário (apenas os ativos)
        $contas = ContaBancaria::where('status', 'Ativa')->get();
        $fornecedores = Fornecedor::where('status', 'Ativo')->orderBy('razao_social')->get();

        return Inertia::render('Financeiro/Lancamentos/Index', [
            'lancamentos' => $lancamentos,
            'contas' => $contas,
            'fornecedores' => $fornecedores
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'conta_bancaria_id' => 'required|exists:contas_bancarias,id',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
            'descricao' => 'required|string|max:255',
            'tipo' => 'required|in:Receita,Despesa',
            'valor' => 'required|numeric|min:0.01',
            'data_vencimento' => 'required|date',
            'data_pagamento' => 'nullable|date',
            'status' => 'required|in:Pendente,Pago,Atrasado,Cancelado',
        ]);

        Lancamento::create($validated);
        return redirect()->route('financeiro.lancamentos.index');
    }

    public function update(Request $request, $id)
    {
        $lancamento = Lancamento::findOrFail($id);

        $validated = $request->validate([
            'conta_bancaria_id' => 'required|exists:contas_bancarias,id',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
            'descricao' => 'required|string|max:255',
            'tipo' => 'required|in:Receita,Despesa',
            'valor' => 'required|numeric|min:0.01',
            'data_vencimento' => 'required|date',
            'data_pagamento' => 'nullable|date',
            'status' => 'required|in:Pendente,Pago,Atrasado,Cancelado',
        ]);

        $lancamento->update($validated);
        return redirect()->route('financeiro.lancamentos.index');
    }
    
    public function create()
    {
        return \Inertia\Inertia::render('Financeiro/Lancamentos/Create');
    }

    public function destroy($id)
    {
        $lancamento = Lancamento::findOrFail($id);
        $lancamento->delete();
        return redirect()->route('financeiro.lancamentos.index');
    }
}