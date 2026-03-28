<?php

use Illuminate\Support\Facades\Route;
use Modules\Contratos\Http\Controllers\ProcessoController;
use Modules\Contratos\Http\Controllers\ContratoController;
use Modules\Contratos\Http\Controllers\AditivoController;

Route::middleware(['auth'])->prefix('contratos')->group(function () {
    
    // --- ROTAS DE PROCESSOS LICITATÓRIOS ---
    Route::get('/processos', [ProcessoController::class, 'index'])->name('contratos.processos.index');
    Route::get('/processos/novo', [ProcessoController::class, 'create'])->name('contratos.processos.create');
    Route::post('/processos', [ProcessoController::class, 'store'])->name('contratos.processos.store');
    Route::delete('/processos/{id}', [ProcessoController::class, 'destroy'])->name('contratos.processos.destroy');

    // --- ROTAS DE CONTRATOS ---
    Route::get('/lista', [ContratoController::class, 'index'])->name('contratos.lista.index');
    Route::get('/lista/novo', [ContratoController::class, 'create'])->name('contratos.lista.create');
    Route::post('/lista', [ContratoController::class, 'store'])->name('contratos.lista.store');
    Route::delete('/lista/{id}', [ContratoController::class, 'destroy'])->name('contratos.lista.destroy');

    // --- ROTAS DE ADITIVOS ---
    Route::get('/lista/{contrato}/aditivos', [AditivoController::class, 'index'])->name('contratos.aditivos.index');
    Route::post('/lista/{contrato}/aditivos', [AditivoController::class, 'store'])->name('contratos.aditivos.store');
    Route::delete('/lista/{contrato}/aditivos/{aditivo}', [AditivoController::class, 'destroy'])->name('contratos.aditivos.destroy');
});