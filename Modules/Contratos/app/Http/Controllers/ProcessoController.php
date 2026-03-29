<?php

namespace Modules\Contratos\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Contratos\Models\Processo;
use Inertia\Inertia;

class ProcessoController extends Controller
{
    public function index()
    {
        // Traz os processos mais recentes primeiro (por ano e número)
        $processos = Processo::orderBy('ano', 'desc')->orderBy('id', 'desc')->get();
        return Inertia::render('Contratos/Processos/Index', ['processos' => $processos]);
    }

    public function create()
    {
        return Inertia::render('Contratos/Processos/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero_processo' => 'required|string|max:50',
            'modalidade' => 'required|in:Pregão Eletrônico,Pregão Presencial,Inexigibilidade,Dispensa,Concorrência,Adesão (Carona)',
            'numero_modalidade' => 'nullable|string|max:50',
            'objeto' => 'required|string',
            'ano' => 'required|integer',
            'valor_total_licitado' => 'required|numeric|min:0', // <-- ESTA É A LINHA QUE FALTAVA!
            'status' => 'required|in:Em Andamento,Homologado,Deserto/Fracassado,Suspenso,Concluído',
        ]);

        Processo::create($validated);
        return redirect()->route('contratos.processos.index');
    }

    public function destroy($id)
    {
        Processo::findOrFail($id)->delete();
        return redirect()->route('contratos.processos.index');
    }
}