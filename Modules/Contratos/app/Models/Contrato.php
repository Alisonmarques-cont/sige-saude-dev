<?php

namespace Modules\Contratos\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Financeiro\Models\Fornecedor;

class Contrato extends Model
{
    use HasFactory;

    protected $table = 'contratos';

    protected $fillable = [
        'ata_id',
        'fornecedor_id',
        'numero_contrato',
        'valor_global',
        'data_assinatura',
        'vigencia_inicio',
        'vigencia_fim',
        'status',
    ];

    public function ata()
    {
        return $this->belongsTo(Ata::class, 'ata_id');
    }

    public function fornecedor()
    {
        return $this->belongsTo(Fornecedor::class, 'fornecedor_id');
    }
    
    public function aditivos()
    {
        return $this->hasMany(Aditivo::class, 'contrato_id');
    }
}