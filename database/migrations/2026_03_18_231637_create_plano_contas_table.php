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
    Schema::create('plano_contas', function (Blueprint $table) {
        $table->id();
        $table->string('codigo'); // Ex: 3.3.90.30
        $table->string('descricao'); // Ex: Material de Consumo
        $table->enum('tipo', ['Receita', 'Despesa']); // Para separar o que entra do que sai
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plano_contas');
    }
};
