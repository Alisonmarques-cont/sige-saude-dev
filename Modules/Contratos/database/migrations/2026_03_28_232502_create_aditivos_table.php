<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aditivos', function (Blueprint $table) {
            $table->id();
            
            // Relacionamento forte: Se apagar o contrato, apaga os aditivos
            $table->foreignId('contrato_id')->constrained('contratos')->onDelete('cascade');
            
            $table->string('numero_aditivo'); // Ex: 01/2026
            $table->enum('tipo', ['Valor', 'Prazo', 'Valor e Prazo', 'Outros']);
            
            // O valor pode ser zero se for só de prazo. Pode ser negativo em caso de supressão.
            $table->decimal('valor_adicionado', 15, 2)->default(0); 
            $table->date('nova_data_fim')->nullable();
            
            $table->date('data_assinatura');
            $table->text('motivo')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aditivos');
    }
};
