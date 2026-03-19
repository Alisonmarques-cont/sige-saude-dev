<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EntidadeController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\PlanoContaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. Quando aceder à raiz do site (localhost:8000/), vai direto para o dashboard
Route::get('/', function () {
    // Se quiser que vá para o login primeiro caso não esteja logado, 
    // o middleware do financeiro.dashboard já vai tratar disso e empurrar para o login!
    return redirect()->route('financeiro.dashboard');
});

// 2. O intercetor do Login: O Laravel após o login procura o "/dashboard".
// Nós apanhamos essa rota e reencaminhamos para a nossa!
Route::get('/dashboard', function () {
    return redirect()->route('financeiro.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// 3. Rotas de Perfil (Padrão do sistema)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//// MODULO DE FINANCEIRO////

// 1. ROTAS DE LANÇAMENTOS 
    Route::get('/lancamentos', [LancamentoController::class, 'index'])->name('financeiro.lancamentos.index');
    Route::get('/lancamentos/novo', [LancamentoController::class, 'create'])->name('financeiro.lancamentos.create');
    Route::post('/lancamentos', [LancamentoController::class, 'store'])->name('financeiro.lancamentos.store');
    Route::put('/lancamentos/{id}', [LancamentoController::class, 'update'])->name('financeiro.lancamentos.update');
    Route::delete('/lancamentos/{id}', [LancamentoController::class, 'destroy'])->name('financeiro.lancamentos.destroy');


//// MODULO DE CONFIGURAÇÕES////

Route::middleware('auth')->prefix('configuracoes')->group(function () {
// 1. Rotas da Entidade
    Route::get('/entidade', [EntidadeController::class, 'index'])->name('configuracoes.entidade');
    Route::post('/entidade', [EntidadeController::class, 'store'])->name('configuracoes.entidade.store');
    
// 2. Rotas de Usuários
    Route::post('/usuarios', [UsuarioController::class, 'store'])->name('configuracoes.usuarios.store');
    Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy'])->name('configuracoes.usuarios.destroy');
});
// 3. Plano de Contas
    Route::post('/plano-contas', [PlanoContaController::class, 'store'])->name('configuracoes.plano_contas.store');
    Route::delete('/plano-contas/{planoConta}', [PlanoContaController::class, 'destroy'])->name('configuracoes.plano_contas.destroy');

    require __DIR__.'/auth.php';