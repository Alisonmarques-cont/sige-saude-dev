<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
    {
        Schema::create('contratos', function (Blueprint $table) {
            $table->id();
            
            // RELACIONAMENTOS
            // Ligação ao Processo (Módulo Contratos)
            $table->foreignId('processo_id')->constrained('processos')->onDelete('restrict');
            // Ligação ao Fornecedor (Módulo Financeiro)
            $table->foreignId('fornecedor_id')->constrained('fornecedores')->onDelete('restrict');
            
            // DADOS DO CONTRATO
            $table->string('numero_contrato'); // Ex: 045/2026
            $table->decimal('valor_global', 15, 2);
            
            // VIGÊNCIA E PRAZOS
            $table->date('data_assinatura');
            $table->date('vigencia_inicio');
            $table->date('vigencia_fim');
            
            // STATUS
            $table->enum('status', ['Ativo', 'Vencido', 'Rescindido', 'Suspenso'])->default('Ativo');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contratos');
    }
};
