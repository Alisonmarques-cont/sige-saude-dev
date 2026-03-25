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
        Schema::create('programa_trabalhos', function (Blueprint $table) {
            $table->id();
            
            // Identificação do Programa
            $table->string('codigo')->nullable(); // Ex: 10.301.1234.5678 (Funcional Programática)
            $table->string('nome'); // Ex: Atenção Primária à Saúde
            $table->string('bloco'); // Ex: Custeio ou Investimento
            $table->text('acao_detalhada')->nullable(); // O que o programa faz
            
            // Legislação e Repasse
            $table->string('portaria')->nullable(); // Ex: Portaria GM/MS nº 3.222/2024
            $table->enum('tipo_repasse', ['Fundo a Fundo', 'Convênio', 'Emenda Parlamentar', 'Recurso Próprio', 'Outros'])->default('Fundo a Fundo');
            
            $table->enum('status', ['Ativo', 'Inativo'])->default('Ativo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programa_trabalhos');
    }
};
