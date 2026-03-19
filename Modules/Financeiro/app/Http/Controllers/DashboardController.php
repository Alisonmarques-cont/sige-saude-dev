<?php

namespace Modules\Financeiro\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Financeiro\Models\ContaBancaria;
use Modules\Financeiro\Models\Lancamento;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Calcula o Saldo Total (soma de todas as contas)
        $saldoTotal = ContaBancaria::sum('saldo_atual');

        // 2. Define o início e o fim do mês atual
        $inicioMes = Carbon::now()->startOfMonth();
        $fimMes = Carbon::now()->endOfMonth();

        // 3. Soma as Despesas (A Pagar) Pendentes deste mês
        $aPagar = Lancamento::where('tipo', 'Despesa')
            ->whereIn('status', ['Pendente', 'Atrasado'])
            ->whereBetween('data_vencimento', [$inicioMes, $fimMes])
            ->sum('valor');

        // 4. Soma as Receitas (A Receber) Pendentes deste mês
        $aReceber = Lancamento::where('tipo', 'Receita')
            ->whereIn('status', ['Pendente', 'Atrasado'])
            ->whereBetween('data_vencimento', [$inicioMes, $fimMes])
            ->sum('valor');

        // Envia a matemática toda pronta para o React
        return Inertia::render('Financeiro/Dashboard/Index', [
            'saldoTotal' => (float) $saldoTotal,
            'aPagar' => (float) $aPagar,
            'aReceber' => (float) $aReceber,
            'mesAtual' => Carbon::now()->translatedFormat('F / Y') // Ex: "março / 2026"
        ]);
    }
}