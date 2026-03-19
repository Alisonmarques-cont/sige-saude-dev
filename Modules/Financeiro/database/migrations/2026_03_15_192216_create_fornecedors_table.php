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
        Schema::create('fornecedores', function (Blueprint $table) {
            $table->id();
            $table->string('razao_social', 150);
            $table->string('cnpj_cpf', 20)->unique();
            $table->string('telefone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('endereco')->nullable();
            $table->enum('tipo', ['Física', 'Jurídica'])->default('Jurídica');
            $table->enum('status', ['Ativo', 'Inativo'])->default('Ativo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fornecedors');
    }
};
