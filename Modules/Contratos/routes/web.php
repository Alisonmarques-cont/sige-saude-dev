<?php

use Illuminate\Support\Facades\Route;
use Modules\Contratos\Http\Controllers\ProcessoController;

Route::middleware(['auth'])->prefix('contratos')->group(function () {
    
    // --- ROTAS DE PROCESSOS LICITATÓRIOS ---
    Route::get('/processos', [ProcessoController::class, 'index'])->name('contratos.processos.index');
    Route::get('/processos/novo', [ProcessoController::class, 'create'])->name('contratos.processos.create');
    Route::post('/processos', [ProcessoController::class, 'store'])->name('contratos.processos.store');
    Route::delete('/processos/{id}', [ProcessoController::class, 'destroy'])->name('contratos.processos.destroy');

});