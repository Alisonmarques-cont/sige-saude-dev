<?php

namespace Modules\Financeiro\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lancamento extends Model
{
    use HasFactory;

    protected $table = 'lancamentos';

    // Adicionámos as novas colunas aqui:
    protected $fillable = [
        'conta_bancaria_id',
        'fornecedor_id',
        'plano_conta_id',
        'numero_empenho',
        'processo_licitatorio',
        'fonte_recurso',
        'descricao',
        'tipo',
        'valor',
        'data_vencimento',
        'data_pagamento',
        'status',
    ];

    public function contaBancaria()
    {
        return $this->belongsTo(ContaBancaria::class, 'conta_bancaria_id');
    }

    public function fornecedor()
    {
        return $this->belongsTo(Fornecedor::class, 'fornecedor_id');
    }

    // NOVA MÁGICA: Ligação com o Plano de Contas
    public function planoConta()
    {
        return $this->belongsTo(\App\Models\PlanoConta::class, 'plano_conta_id');
    }
}