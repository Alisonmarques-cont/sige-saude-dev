<?php

namespace Modules\Contratos\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Financeiro\Models\Fornecedor;

class Ata extends Model
{
    use HasFactory;

    protected $table = 'atas';

    protected $fillable = [
        'processo_id', 'fornecedor_id', 'numero_ata', 
        'valor_total_ata', 'data_assinatura', 'vigencia_fim', 'status'
    ];

    public function processo()
    {
        return $this->belongsTo(Processo::class, 'processo_id');
    }

    public function fornecedor()
    {
        return $this->belongsTo(Fornecedor::class, 'fornecedor_id');
    }

    public function contrato()
    {
        // 1 Ata só pode ter 1 Contrato
        return $this->hasOne(Contrato::class, 'ata_id');
    }
}