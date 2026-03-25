<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lancamentos', function (Blueprint $table) {
            $table->id();
            
            // RELACIONAMENTOS (Foreign Keys)
            $table->foreignId('conta_bancaria_id')->constrained('contas_bancarias')->onDelete('restrict');
            $table->foreignId('fornecedor_id')->nullable()->constrained('fornecedores')->onDelete('restrict');
            $table->foreignId('plano_conta_id')->nullable()->constrained('plano_contas')->onDelete('restrict'); // <- NOVA
            
            // DADOS DA GESTÃO (Novos)
            $table->string('numero_empenho')->nullable();
            $table->string('processo_licitatorio')->nullable();
            $table->string('fonte_recurso')->nullable();

            // DADOS DO LANÇAMENTO
            $table->string('descricao', 255);
            $table->enum('tipo', ['Receita', 'Despesa']);
            $table->decimal('valor', 15, 2);
            $table->date('data_vencimento');
            $table->date('data_pagamento')->nullable();
            
            // STATUS DO PAGAMENTO
            $table->enum('status', ['Pendente', 'Pago', 'Atrasado', 'Cancelado'])->default('Pendente');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lancamentos');
    }
};
