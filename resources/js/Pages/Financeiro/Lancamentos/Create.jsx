import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    // Começamos na aba "dados"
    const [activeTab, setActiveTab] = useState('dados');

    const { data, setData, post, processing, errors } = useForm({
        // Aba Dados
        descricao: '',
        data_lancamento: '',
        fornecedor_id: '',
        // Aba Gestão
        numero_empenho: '',
        processo_licitatorio: '',
        fonte_recurso: '',
        // Aba Financeiro
        plano_conta_id: '',
        valor: '',
        tipo: 'Despesa',
        // Aba Pagamento
        conta_bancaria_id: '',
        data_pagamento: '',
        status: 'Pendente',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // post(route('financeiro.lancamentos.store'));
        alert("Lógica de salvar será implementada aqui!");
    };

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('financeiro.lancamentos.index')} className="text-gray-500 hover:text-gray-700 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800">Novo Lançamento Financeiro</h2>
                    </div>
                    <button onClick={handleSubmit} disabled={processing} className="bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold py-2 px-6 rounded shadow transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Salvar Lançamento
                    </button>
                </div>
            }
        >
            <Head title="Novo Lançamento" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* MENU DE ABAS INTERNO */}
                    <div className="bg-white rounded-t-lg border-b flex overflow-x-auto shadow-sm">
                        <button onClick={() => setActiveTab('dados')} className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'dados' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}>
                            📋 Dados Básicos
                        </button>
                        <button onClick={() => setActiveTab('gestao')} className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'gestao' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}>
                            🏛️ Gestão / Empenho
                        </button>
                        <button onClick={() => setActiveTab('financeiro')} className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'financeiro' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}>
                            💰 Financeiro
                        </button>
                        <button onClick={() => setActiveTab('pagamento')} className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'pagamento' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}>
                            🏦 Pagamento
                        </button>
                    </div>

                    {/* CONTEÚDO DAS ABAS */}
                    <div className="bg-white shadow-sm rounded-b-lg p-8 min-h-[400px]">
                        
                        {/* ABA 1: DADOS */}
                        {activeTab === 'dados' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Informações Iniciais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Histórico / Descrição da Despesa/Receita</label>
                                        <input type="text" value={data.descricao} onChange={e => setData('descricao', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" placeholder="Ex: Pagamento referente a aquisição de medicamentos..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data do Documento</label>
                                        <input type="date" value={data.data_lancamento} onChange={e => setData('data_lancamento', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Credor / Fornecedor</label>
                                        <select value={data.fornecedor_id} onChange={e => setData('fornecedor_id', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]">
                                            <option value="">Selecione um Fornecedor...</option>
                                            <option value="1">Distribuidora Saúde e Vida LTDA</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABA 2: GESTÃO */}
                        {activeTab === 'gestao' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Dados do Empenho e Licitação</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Empenho</label>
                                        <input type="text" value={data.numero_empenho} onChange={e => setData('numero_empenho', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" placeholder="Ex: 2024/00015" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Processo Licitatório</label>
                                        <input type="text" value={data.processo_licitatorio} onChange={e => setData('processo_licitatorio', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" placeholder="Ex: Pregão 01/2024" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fonte de Recurso</label>
                                        <select value={data.fonte_recurso} onChange={e => setData('fonte_recurso', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]">
                                            <option value="">Selecione...</option>
                                            <option value="1">1500 - Recursos Não Vinculados</option>
                                            <option value="2">1600 - Transferências Fundo a Fundo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABA 3: FINANCEIRO */}
                        {activeTab === 'financeiro' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Classificação Contábil</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimento</label>
                                        <select value={data.tipo} onChange={e => setData('tipo', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]">
                                            <option value="Despesa">Despesa (Saída)</option>
                                            <option value="Receita">Receita (Entrada)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Plano de Contas</label>
                                        <select value={data.plano_conta_id} onChange={e => setData('plano_conta_id', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]">
                                            <option value="">Selecione a Categoria...</option>
                                            <option value="1">3.3.90.30 - Material de Consumo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Bruto (R$)</label>
                                        <input type="text" value={data.valor} onChange={e => setData('valor', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc] text-lg font-bold text-right text-red-600" placeholder="0,00" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABA 4: PAGAMENTO */}
                        {activeTab === 'pagamento' && (
                            <div className="animate-fade-in">
                                <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Efetivação do Pagamento</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]">
                                            <option value="Pendente">A Pagar (Pendente)</option>
                                            <option value="Pago">Pago / Liquidado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Conta Bancária Vinculada</label>
                                        <select value={data.conta_bancaria_id} onChange={e => setData('conta_bancaria_id', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]">
                                            <option value="">Selecione o Banco...</option>
                                            <option value="1">Banco do Brasil - FUS Ag: 123-4</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data do Pagamento</label>
                                        <input type="date" value={data.data_pagamento} onChange={e => setData('data_pagamento', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}