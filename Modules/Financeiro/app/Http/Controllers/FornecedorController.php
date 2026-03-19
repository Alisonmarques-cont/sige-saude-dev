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
        $fornecedores = Fornecedor::orderBy('id', 'desc')->get();
        return Inertia::render('Financeiro/Fornecedores/Index', ['fornecedores' => $fornecedores]);
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
            // A regra do unique na edição precisa ignorar o ID atual
            'cnpj_cpf' => 'required|string|max:20|unique:fornecedores,cnpj_cpf,' . $id,
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
        $fornecedor = Fornecedor::findOrFail($id);
        $fornecedor->delete();
        return redirect()->route('financeiro.fornecedores.index');
    }
}