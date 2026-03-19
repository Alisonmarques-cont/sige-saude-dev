<?php

namespace Modules\Financeiro\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lancamento extends Model
{
    use HasFactory;

    protected $table = 'lancamentos';

    protected $fillable = [
        'conta_bancaria_id',
        'fornecedor_id',
        'descricao',
        'tipo',
        'valor',
        'data_vencimento',
        'data_pagamento',
        'status',
    ];

    // MÁGICA 1: Este Lançamento pertence a uma Conta Bancária
    public function contaBancaria()
    {
        return $this->belongsTo(ContaBancaria::class, 'conta_bancaria_id');
    }

    // MÁGICA 2: Este Lançamento pertence a um Fornecedor/Cliente
    public function fornecedor()
    {
        return $this->belongsTo(Fornecedor::class, 'fornecedor_id');
    }
}