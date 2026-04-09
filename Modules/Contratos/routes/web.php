<?php

use Illuminate\Support\Facades\Route;
use Modules\Contratos\Http\Controllers\ProcessoController;
use Modules\Contratos\Http\Controllers\AtaController;
use Modules\Contratos\Http\Controllers\ContratoController;
use Modules\Contratos\Http\Controllers\AditivoController;

Route::middleware(['auth'])->prefix('contratos')->group(function () {
    
    // --- PROCESSOS ---
    Route::get('/processos', [ProcessoController::class, 'index'])->name('contratos.processos.index');
    Route::get('/processos/novo', [ProcessoController::class, 'create'])->name('contratos.processos.create');
    Route::post('/processos', [ProcessoController::class, 'store'])->name('contratos.processos.store');
    Route::delete('/processos/{id}', [ProcessoController::class, 'destroy'])->name('contratos.processos.destroy');
    Route::get('/processos/{id}/editar', [ProcessoController::class, 'edit'])->name('contratos.processos.edit');
    Route::put('/processos/{id}', [ProcessoController::class, 'update'])->name('contratos.processos.update');

    // --- ATAS DE REGISTRO DE PREÇOS---
    Route::get('/atas', [AtaController::class, 'index'])->name('contratos.atas.index');
    Route::get('/atas/nova', [AtaController::class, 'create'])->name('contratos.atas.create');
    Route::post('/atas', [AtaController::class, 'store'])->name('contratos.atas.store');
    Route::delete('/atas/{id}', [AtaController::class, 'destroy'])->name('contratos.atas.destroy');
    Route::get('/atas/{id}/editar', [AtaController::class, 'edit'])->name('contratos.atas.edit');
    Route::put('/atas/{id}', [AtaController::class, 'update'])->name('contratos.atas.update');

    // --- CONTRATOS ---
    Route::get('/lista', [ContratoController::class, 'index'])->name('contratos.lista.index');
    Route::get('/lista/novo', [ContratoController::class, 'create'])->name('contratos.lista.create');
    Route::post('/lista', [ContratoController::class, 'store'])->name('contratos.lista.store');
    Route::delete('/lista/{id}', [ContratoController::class, 'destroy'])->name('contratos.lista.destroy');
    Route::get('/lista/{id}/editar', [ContratoController::class, 'edit'])->name('contratos.lista.edit');
    Route::put('/lista/{id}', [ContratoController::class, 'update'])->name('contratos.lista.update');

    // --- ADITIVOS ---
    Route::get('/lista/{contrato}/aditivos', [AditivoController::class, 'index'])->name('contratos.aditivos.index');
    Route::post('/lista/{contrato}/aditivos', [AditivoController::class, 'store'])->name('contratos.aditivos.store');
    Route::delete('/lista/{contrato}/aditivos/{aditivo}', [AditivoController::class, 'destroy'])->name('contratos.aditivos.destroy');

    // Impressão (Ficha do Contrato)
    Route::get('/lista/{id}/imprimir', [ContratoController::class, 'print'])->name('contratos.lista.print');
});