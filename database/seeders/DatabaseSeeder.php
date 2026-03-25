<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Cria o seu utilizador mestre automaticamente!
        User::factory()->create([
            'name' => 'PROGRAMADOR',
            'email' => 'programacao@sigesaude.com',
            'password' => bcrypt('12345678'), // A senha será 12345678
        ]);

        // Se no futuro tivermos outros Seeders (ex: criar Planos de Contas padrão), chamamos aqui!
    }
}