<?php

namespace Modules\Contratos\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Contratos\Models\Contrato;
use Modules\Contratos\Models\Ata;
use Modules\Financeiro\Models\Fornecedor;
use Inertia\Inertia;

class ContratoController extends Controller
{
    public function index()
    {
        // Agora trazemos a ata (e o processo dentro da ata)
        $contratos = Contrato::with(['ata.processo', 'fornecedor'])->orderBy('id', 'desc')->get();
        return Inertia::render('Contratos/Contratos/Index', ['contratos' => $contratos]);
    }

    public function create()
    {
        // Só podemos fazer contrato de Atas Ativas e que ainda não tenham contrato
        $atas = Ata::with('processo')->where('status', 'Ativa')->doesntHave('contrato')->get();
        $fornecedores = Fornecedor::where('status', 'Ativo')->orderBy('razao_social')->get();

        return Inertia::render('Contratos/Contratos/Create', [
            'atas' => $atas,
            'fornecedores' => $fornecedores
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ata_id' => 'required|exists:atas,id|unique:contratos,ata_id', // 1 Ata = 1 Contrato
            'fornecedor_id' => 'required|exists:fornecedores,id',
            'numero_contrato' => 'required|string|max:50',
            'valor_global' => 'required|numeric|min:0.01',
            'data_assinatura' => 'required|date',
            'vigencia_inicio' => 'required|date',
            'vigencia_fim' => 'required|date|after_or_equal:vigencia_inicio',
            'status' => 'required|in:Ativo,Vencido,Rescindido,Suspenso',
        ]);

        // 🧠 TRAVA MATEMÁTICA 2: O Contrato não pode ser maior que a Ata
        $ata = Ata::findOrFail($request->ata_id);
        
        if ($request->valor_global > $ata->valor_total_ata) {
            return back()->withErrors([
                'valor_global' => 'O valor do Contrato (R$ ' . number_format($request->valor_global, 2, ',', '.') . 
                                  ') não pode ser maior que o valor da Ata de Registro de Preços (R$ ' . number_format($ata->valor_total_ata, 2, ',', '.') . ').'
            ]);
        }

        Contrato::create($validated);
        return redirect()->route('contratos.lista.index');
    }

    public function destroy($id)
    {
        Contrato::findOrFail($id)->delete();
        return redirect()->route('contratos.lista.index');
    }

    public function print($id)
    {
        $contrato = Contrato::with(['ata.processo', 'fornecedor', 'aditivos'])->findOrFail($id);
        return Inertia::render('Contratos/Contratos/Print', ['contrato' => $contrato]);
    }

    public function update(Request $request, $id)
    {
        $contrato = Contrato::with('ata')->findOrFail($id);

        $validated = $request->validate([
            'numero_contrato' => 'required|string|max:50',
            'valor_global' => 'required|numeric|min:0.01',
            'data_assinatura' => 'required|date',
            'vigencia_inicio' => 'required|date',
            'vigencia_fim' => 'required|date|after_or_equal:vigencia_inicio',
            'status' => 'required|in:Ativo,Vencido,Rescindido,Suspenso',
        ]);

        // Trava: O valor atualizado não pode passar do valor da Ata
        if ($request->valor_global > $contrato->ata->valor_total_ata) {
            return back()->withErrors([
                'valor_global' => 'O valor do Contrato não pode ser maior que o valor da Ata (R$ ' . number_format($contrato->ata->valor_total_ata, 2, ',', '.') . ').'
            ]);
        }

        $contrato->update($validated);
        return redirect()->route('contratos.processos.index');
    }
}