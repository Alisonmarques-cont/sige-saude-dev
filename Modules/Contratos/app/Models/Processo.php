<?php

namespace Modules\Contratos\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Contratos\Database\Factories\ProcessoFactory;

class Processo extends Model
{
    use HasFactory;

   protected $table = 'processos';

    protected $fillable = [
        'numero_processo',
        'modalidade',
        'numero_modalidade',
        'objeto',
        'ano',
        'status',
    ];
}
