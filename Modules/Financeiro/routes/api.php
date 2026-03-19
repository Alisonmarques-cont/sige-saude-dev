<?php

use Illuminate\Support\Facades\Route;
use Modules\Financeiro\Http\Controllers\FinanceiroController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('financeiros', FinanceiroController::class)->names('financeiro');
});
