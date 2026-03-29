<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('atas', function (Blueprint $table) {
            $table->id();
            
            // Relacionamentos: Ata pertence a um Processo e a um Fornecedor vencedor
            $table->foreignId('processo_id')->constrained('processos')->onDelete('cascade');
            $table->foreignId('fornecedor_id')->constrained('fornecedores')->onDelete('restrict');
            
            $table->string('numero_ata'); // Ex: 01/2026
            $table->decimal('valor_total_ata', 15, 2);
            
            $table->date('data_assinatura');
            $table->date('vigencia_fim');
            
            $table->enum('status', ['Ativa', 'Vencida', 'Cancelada'])->default('Ativa');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('atas');
    }
};