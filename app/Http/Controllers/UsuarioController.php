<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UsuarioController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->back()->with('success', 'Usuário criado com sucesso!');
    }

    public function destroy(User $usuario)
    {
        // Segurança: Impede que o utilizador logado apague a sua própria conta
        if (auth()->id() === $usuario->id) {
            return redirect()->back()->withErrors(['email' => 'Não pode excluir o seu próprio utilizador.']);
        }

        $usuario->delete();
        return redirect()->back()->with('success', 'Usuário excluído com sucesso!');
    }
}