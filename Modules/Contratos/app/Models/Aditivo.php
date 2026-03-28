<?php

namespace Modules\Contratos\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Aditivo extends Model
{
    use HasFactory;

    protected $table = 'aditivos';

    protected $fillable = [
        'contrato_id', 'numero_aditivo', 'tipo', 'valor_adicionado', 'nova_data_fim', 'data_assinatura', 'motivo'
    ];

    public function contrato()
    {
        return $this->belongsTo(Contrato::class, 'contrato_id');
    }
}