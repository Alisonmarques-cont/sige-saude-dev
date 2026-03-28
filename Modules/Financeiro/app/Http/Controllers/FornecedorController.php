<?php

namespace Modules\Financeiro\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Financeiro\Models\Fornecedor;
use Inertia\Inertia;

class FornecedorController extends Controller
{
    public function index()
    {
        $fornecedores = Fornecedor::orderBy('razao_social')->get();
        // APONTAMOS PARA A NOVA PASTA "Cadastros" NO FRONTEND:
        return Inertia::render('Cadastros/Fornecedores/Index', ['fornecedores' => $fornecedores]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'razao_social' => 'required|string|max:150',
            'cnpj_cpf' => 'required|string|max:20|unique:fornecedores,cnpj_cpf',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'endereco' => 'nullable|string',
            'tipo' => 'required|in:Física,Jurídica',
            'status' => 'required|in:Ativo,Inativo',
        ]);

        Fornecedor::create($validated);
        return redirect()->route('financeiro.fornecedores.index');
    }

    public function update(Request $request, $id)
    {
        $fornecedor = Fornecedor::findOrFail($id);
        
        $validated = $request->validate([
            'razao_social' => 'required|string|max:150',
            // Ignora o próprio ID na validação de "único" para podermos editar
            'cnpj_cpf' => 'required|string|max:20|unique:fornecedores,cnpj_cpf,'.$id,
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'endereco' => 'nullable|string',
            'tipo' => 'required|in:Física,Jurídica',
            'status' => 'required|in:Ativo,Inativo',
        ]);

        $fornecedor->update($validated);
        return redirect()->route('financeiro.fornecedores.index');
    }

    public function destroy($id)
    {
        Fornecedor::findOrFail($id)->delete();
        return redirect()->route('financeiro.fornecedores.index');
    }
}