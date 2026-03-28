<?php

use Illuminate\Support\Facades\Route;
use Modules\Contratos\Http\Controllers\ContratosController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('contratos', ContratosController::class)->names('contratos');
});
