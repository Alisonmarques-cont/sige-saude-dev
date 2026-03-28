<?php

namespace Modules\Contratos\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Contratos\Database\Factories\ContratoFactory;

class Contrato extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): ContratoFactory
    // {
    //     // return ContratoFactory::new();
    // }
}
