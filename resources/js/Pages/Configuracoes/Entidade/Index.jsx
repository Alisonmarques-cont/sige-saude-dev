import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// Importando os nossos novos sub-componentes!
import TabEntidade from './Partials/TabEntidade';
import TabUnidades from './Partials/TabUnidades';
import TabUsuarios from './Partials/TabUsuarios';
import TabPlanoContas from './Partials/TabPlanoContas';

export default function Index({ auth, entidade, usuarios, planoContas }) {
    const [activeTab, setActiveTab] = useState('entidade');

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Configurações do Sistema</h2>}>
            <Head title="Configurações" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* MENU DE ABAS INTERNO */}
                    <div className="bg-white rounded-t-lg border-b flex overflow-x-auto shadow-sm">
                        <button 
                            onClick={() => setActiveTab('entidade')}
                            className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'entidade' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}
                        >
                            Entidade
                        </button>
                        <button 
                            onClick={() => setActiveTab('unidades')}
                            className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'unidades' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}
                        >
                            Unidades
                        </button>
                        <button 
                            onClick={() => setActiveTab('usuarios')}
                            className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'usuarios' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}
                        >
                            Usuários
                        </button>
                        <button 
                            onClick={() => setActiveTab('plano_contas')}
                            className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'plano_contas' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}
                        >
                            Plano de Contas
                        </button>
                    </div>

                    {/* RENDERIZAÇÃO DO COMPONENTE (Mágica da Componentização!) */}
                    <div className="bg-white shadow-sm rounded-b-lg overflow-hidden">
                        {activeTab === 'entidade' && <TabEntidade entidade={entidade} />}
                        {activeTab === 'unidades' && <TabUnidades />}
                        {activeTab === 'usuarios' && <TabUsuarios usuarios={usuarios} auth={auth} />}
                        {activeTab === 'plano_contas' && <TabPlanoContas planoContas={planoContas} />}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}