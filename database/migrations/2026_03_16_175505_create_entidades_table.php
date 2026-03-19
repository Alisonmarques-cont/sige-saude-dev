<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('entidades', function (Blueprint $table) {
        $table->id();
        $table->string('nome_fundo'); // Ex: Fundo Municipal de Saúde
        $table->string('cnpj');
        $table->string('gestor_nome')->nullable(); // Nome do Secretário(a)
        $table->string('gestor_cpf')->nullable();  // Necessário para prestação de contas
        $table->string('cep')->nullable();
        $table->string('endereco')->nullable();
        $table->string('numero')->nullable();
        $table->string('bairro')->nullable();
        $table->string('cidade')->default('Sairé'); // Puxando a sua localidade!
        $table->string('uf', 2)->default('PE');
        $table->string('telefone')->nullable();
        $table->string('email')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entidades');
    }
};
