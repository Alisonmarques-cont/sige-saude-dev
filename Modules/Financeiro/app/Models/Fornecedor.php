<?php

namespace Modules\Financeiro\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Fornecedor extends Model
{
    use HasFactory;

    // 1. Apontamos o nome exato da tabela
    protected $table = 'fornecedores';

    // 2. Liberamos os campos para gravação (Mass Assignment)
    protected $fillable = [
        'razao_social',
        'cnpj_cpf',
        'telefone',
        'email',
        'endereco',
        'tipo',
        'status',
    ];
}