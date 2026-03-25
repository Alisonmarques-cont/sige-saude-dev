import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const [activeTab, setActiveTab] = useState('dados');

    const { data, setData, post, processing, errors } = useForm({
        codigo: '',
        nome: '',
        bloco: '',
        acao_detalhada: '',
        portaria: '',
        tipo_repasse: 'Fundo a Fundo',
        status: 'Ativo',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('financeiro.programas.store'));
    };

    return (
        <AuthenticatedLayout 
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('financeiro.programas.index')} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800">Novo Programa de Trabalho</h2>
                    </div>
                    <button onClick={handleSubmit} disabled={processing} className="bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold py-2 px-6 rounded shadow flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Salvar Programa
                    </button>
                </div>
            }
        >
            <Head title="Novo Programa" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <div className="bg-white rounded-t-lg border-b flex overflow-x-auto shadow-sm">
                    <button onClick={() => setActiveTab('dados')} className={`px-8 py-4 text-sm font-bold uppercase tracking-wider border-b-2 ${activeTab === 'dados' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}>
                        📋 Dados do Programa
                    </button>
                    <button onClick={() => setActiveTab('legislacao')} className={`px-8 py-4 text-sm font-bold uppercase tracking-wider border-b-2 ${activeTab === 'legislacao' ? 'border-[#3c8dbc] text-[#3c8dbc]' : 'border-transparent text-gray-500 hover:text-[#3c8dbc]'}`}>
                        ⚖️ Legislação e Repasse
                    </button>
                </div>

                <div className="bg-white shadow-sm rounded-b-lg p-8 min-h-[400px]">
                    
                    {activeTab === 'dados' && (
                        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Programa/Ação *</label>
                                <input type="text" value={data.nome} onChange={e => setData('nome', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: Atenção Primária à Saúde (PAB)" />
                                {errors.nome && <div className="text-red-500 text-xs mt-1">{errors.nome}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bloco de Financiamento *</label>
                                <select value={data.bloco} onChange={e => setData('bloco', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]">
                                    <option value="">Selecione o Bloco...</option>
                                    <option value="Custeio">Bloco de Custeio das Ações e Serviços</option>
                                    <option value="Investimento">Bloco de Investimento</option>
                                </select>
                                {errors.bloco && <div className="text-red-500 text-xs mt-1">{errors.bloco}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código (Funcional Programática)</label>
                                <input type="text" value={data.codigo} onChange={e => setData('codigo', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: 10.301.0001.2001" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ação Detalhada / Finalidade</label>
                                <textarea rows="3" value={data.acao_detalhada} onChange={e => setData('acao_detalhada', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Descreva os objetivos deste recurso..."></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === 'legislacao' && (
                        <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Repasse *</label>
                                <select value={data.tipo_repasse} onChange={e => setData('tipo_repasse', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]">
                                    <option value="Fundo a Fundo">Transferência Fundo a Fundo</option>
                                    <option value="Convênio">Convênio (Estadual/Federal)</option>
                                    <option value="Emenda Parlamentar">Emenda Parlamentar</option>
                                    <option value="Recurso Próprio">Recurso Próprio (Tesouro Municipal)</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Portaria / Base Legal</label>
                                <input type="text" value={data.portaria} onChange={e => setData('portaria', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: Portaria GM/MS nº 3.222/2024" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status do Programa</label>
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] font-bold">
                                    <option value="Ativo" className="text-green-600">🟢 Ativo (Recebendo Recursos)</option>
                                    <option value="Inativo" className="text-red-600">🔴 Inativo</option>
                                </select>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}