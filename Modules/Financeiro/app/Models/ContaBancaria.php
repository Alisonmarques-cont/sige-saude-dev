<?php

namespace Modules\Financeiro\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContaBancaria extends Model
{
    use HasFactory;

    // A SOLUÇÃO: Dizemos ao Laravel exatamente qual é o nome da tabela
    protected $table = 'contas_bancarias';

    // Os campos que podem ser preenchidos via formulário (Mass Assignment)
    protected $fillable = [
        'banco',
        'agencia',
        'conta',
        'tipo',
        'saldo_inicial',
        'saldo_atual',
        'status',
    ];
}