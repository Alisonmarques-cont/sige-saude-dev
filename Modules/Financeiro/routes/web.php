<?php

use Illuminate\Support\Facades\Route;

// Importações corretas dos Controladores (sem a palavra App)
use Modules\Financeiro\Http\Controllers\DashboardController;
use Modules\Financeiro\Http\Controllers\ContaBancariaController;
use Modules\Financeiro\Http\Controllers\FornecedorController;
use Modules\Financeiro\Http\Controllers\LancamentoController;

Route::middleware(['auth'])->prefix('financeiro')->group(function () {
    
    // --- ROTA DO DASHBOARD ---
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('financeiro.dashboard');

    // --- ROTAS DE CONTAS BANCÁRIAS ---
    Route::get('/contas', [ContaBancariaController::class, 'index'])->name('financeiro.contas.index');
    Route::post('/contas', [ContaBancariaController::class, 'store'])->name('financeiro.contas.store');
    Route::put('/contas/{id}', [ContaBancariaController::class, 'update'])->name('financeiro.contas.update');
    Route::delete('/contas/{id}', [ContaBancariaController::class, 'destroy'])->name('financeiro.contas.destroy');

    // --- ROTAS DE FORNECEDORES ---
    Route::get('/fornecedores', [FornecedorController::class, 'index'])->name('financeiro.fornecedores.index');
    Route::post('/fornecedores', [FornecedorController::class, 'store'])->name('financeiro.fornecedores.store');
    Route::put('/fornecedores/{id}', [FornecedorController::class, 'update'])->name('financeiro.fornecedores.update');
    Route::delete('/fornecedores/{id}', [FornecedorController::class, 'destroy'])->name('financeiro.fornecedores.destroy');

    // --- ROTAS DE LANÇAMENTOS ---
    Route::get('/lancamentos', [LancamentoController::class, 'index'])->name('financeiro.lancamentos.index');
    Route::get('/lancamentos/novo', [LancamentoController::class, 'create'])->name('financeiro.lancamentos.create'); // <--- A NOSSA ROTA NOVA AQUI
    Route::post('/lancamentos', [LancamentoController::class, 'store'])->name('financeiro.lancamentos.store');
    Route::put('/lancamentos/{id}', [LancamentoController::class, 'update'])->name('financeiro.lancamentos.update');
    Route::delete('/lancamentos/{id}', [LancamentoController::class, 'destroy'])->name('financeiro.lancamentos.destroy');

});