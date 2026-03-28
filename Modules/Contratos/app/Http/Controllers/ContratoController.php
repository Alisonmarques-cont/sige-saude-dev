<?php

namespace Modules\Contratos\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Contratos\Models\Contrato;
use Modules\Contratos\Models\Processo;
use Modules\Financeiro\Models\Fornecedor; // Importamos do outro módulo!
use Inertia\Inertia;

class ContratoController extends Controller
{
    public function index()
    {
        // Traz os contratos com os dados do processo e fornecedor anexados
        $contratos = Contrato::with(['processo', 'fornecedor'])->orderBy('id', 'desc')->get();
        return Inertia::render('Contratos/Contratos/Index', ['contratos' => $contratos]);
    }

    public function create()
    {
        // Só podemos fazer contrato de processos que já avançaram
        $processos = Processo::whereIn('status', ['Em Andamento', 'Homologado', 'Concluído'])->get();
        $fornecedores = Fornecedor::where('status', 'Ativo')->orderBy('razao_social')->get();

        return Inertia::render('Contratos/Contratos/Create', [
            'processos' => $processos,
            'fornecedores' => $fornecedores
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'processo_id' => 'required|exists:processos,id',
            'fornecedor_id' => 'required|exists:fornecedores,id',
            'numero_contrato' => 'required|string|max:50',
            'valor_global' => 'required|numeric|min:0.01',
            'data_assinatura' => 'required|date',
            'vigencia_inicio' => 'required|date',
            'vigencia_fim' => 'required|date|after_or_equal:vigencia_inicio',
            'status' => 'required|in:Ativo,Vencido,Rescindido,Suspenso',
        ]);

        Contrato::create($validated);
        return redirect()->route('contratos.lista.index');
    }

    public function destroy($id)
    {
        Contrato::findOrFail($id)->delete();
        return redirect()->route('contratos.lista.index');
    }
}