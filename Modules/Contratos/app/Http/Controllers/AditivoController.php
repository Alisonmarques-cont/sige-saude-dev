<?php

namespace Modules\Contratos\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Contratos\Models\Contrato;
use Modules\Contratos\Models\Aditivo;
use Inertia\Inertia;

class AditivoController extends Controller
{
    // Mostra a tela de aditivos de UM contrato específico
    public function index($contratoId)
    {
        $contrato = Contrato::with(['fornecedor', 'processo', 'aditivos' => function($query) {
            $query->orderBy('data_assinatura', 'desc');
        }])->findOrFail($contratoId);

        return Inertia::render('Contratos/Contratos/Aditivos', [
            'contrato' => $contrato
        ]);
    }

    public function store(Request $request, $contratoId)
    {
        $validated = $request->validate([
            'numero_aditivo' => 'required|string|max:50',
            'tipo' => 'required|in:Valor,Prazo,Valor e Prazo,Outros',
            'valor_adicionado' => 'required|numeric',
            'nova_data_fim' => 'nullable|date',
            'data_assinatura' => 'required|date',
            'motivo' => 'nullable|string',
        ]);

        $contrato = Contrato::findOrFail($contratoId);
        $contrato->aditivos()->create($validated);

        return redirect()->back(); // Volta para a mesma tela invisivelmente
    }

    public function destroy($contratoId, $aditivoId)
    {
        Aditivo::where('contrato_id', $contratoId)->findOrFail($aditivoId)->delete();
        return redirect()->back();
    }
}