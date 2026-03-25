<?php

namespace Modules\Financeiro\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProgramaTrabalho extends Model
{
    use HasFactory;

    protected $table = 'programa_trabalhos';

    protected $fillable = [
        'codigo',
        'nome',
        'bloco',
        'acao_detalhada',
        'portaria',
        'tipo_repasse',
        'status',
    ];
}