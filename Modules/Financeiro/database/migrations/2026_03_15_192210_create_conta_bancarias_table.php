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
        Schema::create('contas_bancarias', function (Blueprint $table) {
            $table->id();
            $table->string('banco', 100);
            $table->string('agencia', 20)->nullable();
            $table->string('conta', 30);
            $table->enum('tipo', ['Corrente', 'Poupança', 'Investimento', 'Caixa'])->default('Corrente');
            $table->decimal('saldo_inicial', 15, 2)->default(0.00);
            $table->decimal('saldo_atual', 15, 2)->default(0.00);
            $table->enum('status', ['Ativa', 'Inativa'])->default('Ativa');
            $table->timestamps(); // Cria created_at e updated_at automaticamente
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conta_bancarias');
    }
};
