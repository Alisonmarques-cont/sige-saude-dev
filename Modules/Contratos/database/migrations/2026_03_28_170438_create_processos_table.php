<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('processos', function (Blueprint $table) {
            $table->id();
            
            // Identificação do Processo
            $table->string('numero_processo'); // Ex: 125/2026
            $table->enum('modalidade', ['Pregão Eletrônico', 'Pregão Presencial', 'Inexigibilidade', 'Dispensa', 'Concorrência', 'Adesão (Carona)']);
            $table->string('numero_modalidade')->nullable(); // Ex: 015/2026
            
            // Detalhes
            $table->text('objeto'); // O que está a ser licitado
            $table->year('ano');
            $table->enum('status', ['Em Andamento', 'Homologado', 'Deserto/Fracassado', 'Suspenso', 'Concluído'])->default('Em Andamento');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('processos');
    }
};
