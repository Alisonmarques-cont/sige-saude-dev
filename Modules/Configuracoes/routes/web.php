<?php

use Illuminate\Support\Facades\Route;
use Modules\Configuracoes\Http\Controllers\ConfiguracoesController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('configuracoes', ConfiguracoesController::class)->names('configuracoes');
});
