<?php

namespace Modules\Contratos\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Contratos\Models\Ata;
use Modules\Contratos\Models\Processo;
use Modules\Financeiro\Models\Fornecedor;
use Inertia\Inertia;

class AtaController extends Controller
{
    public function index()
    {
        $atas = Ata::with(['processo', 'fornecedor'])->orderBy('id', 'desc')->get();
        return Inertia::render('Contratos/Atas/Index', ['atas' => $atas]);
    }

    public function create()
    {
        // Só podemos fazer atas de processos que têm valor licitado
        $processos = Processo::where('valor_total_licitado', '>', 0)->get();
        $fornecedores = Fornecedor::where('status', 'Ativo')->orderBy('razao_social')->get();

        return Inertia::render('Contratos/Atas/Create', [
            'processos' => $processos,
            'fornecedores' => $fornecedores
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'processo_id' => 'required|exists:processos,id',
            'fornecedor_id' => 'required|exists:fornecedores,id',
            'numero_ata' => 'required|string|max:50',
            'valor_total_ata' => 'required|numeric|min:0.01',
            'data_assinatura' => 'required|date',
            'vigencia_fim' => 'required|date|after_or_equal:data_assinatura',
            'status' => 'required|in:Ativa,Vencida,Cancelada',
        ]);

        // 🧠 TRAVA MATEMÁTICA 1: A Ata não pode ser maior que o saldo do Pregão
        $processo = Processo::findOrFail($request->processo_id);
        $somaAtasExistentes = $processo->atas()->sum('valor_total_ata');
        $saldoDisponivel = $processo->valor_total_licitado - $somaAtasExistentes;

        if ($request->valor_total_ata > $saldoDisponivel) {
            return back()->withErrors([
                'valor_total_ata' => 'O valor da Ata (R$ ' . number_format($request->valor_total_ata, 2, ',', '.') . 
                                     ') ultrapassa o saldo disponível no Pregão (R$ ' . number_format($saldoDisponivel, 2, ',', '.') . ').'
            ]);
        }

        Ata::create($validated);
        return redirect()->route('contratos.atas.index');
    }

    public function destroy($id)
    {
        Ata::findOrFail($id)->delete();
        return redirect()->route('contratos.atas.index');
    }
}