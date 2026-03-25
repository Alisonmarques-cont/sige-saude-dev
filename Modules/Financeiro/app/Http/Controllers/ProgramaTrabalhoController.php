<?php

namespace Modules\Financeiro\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Financeiro\Models\ProgramaTrabalho;
use Inertia\Inertia;

class ProgramaTrabalhoController extends Controller
{
    public function index()
    {
        $programas = ProgramaTrabalho::orderBy('nome')->get();
        return Inertia::render('Cadastros/Programas/Index', ['programas' => $programas]);
    }

    public function create()
    {
        return Inertia::render('Cadastros/Programas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo' => 'nullable|string|max:100',
            'nome' => 'required|string|max:255',
            'bloco' => 'required|string|max:255',
            'acao_detalhada' => 'nullable|string',
            'portaria' => 'nullable|string|max:255',
            'tipo_repasse' => 'required|string',
            'status' => 'required|in:Ativo,Inativo',
        ]);

        ProgramaTrabalho::create($validated);
        return redirect()->route('financeiro.programas.index')->with('success', 'Programa cadastrado!');
    }

    public function destroy($id)
    {
        ProgramaTrabalho::findOrFail($id)->delete();
        return redirect()->route('financeiro.programas.index');
    }
}