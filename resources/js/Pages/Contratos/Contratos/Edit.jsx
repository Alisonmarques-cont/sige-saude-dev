import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, contrato }) {
    // Inicializamos o formulário com os dados que vêm da base de dados
    const { data, setData, put, processing, errors } = useForm({
        numero_contrato: contrato.numero_contrato || '',
        valor_global: contrato.valor_global || '',
        data_assinatura: contrato.data_assinatura ? contrato.data_assinatura.substring(0, 10) : '',
        vigencia_inicio: contrato.vigencia_inicio ? contrato.vigencia_inicio.substring(0, 10) : '',
        vigencia_fim: contrato.vigencia_fim ? contrato.vigencia_fim.substring(0, 10) : '',
        status: contrato.status || 'Ativo',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // O método PUT é o padrão RESTful para atualização de dados
        put(route('contratos.lista.update', contrato.id));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('contratos.processos.index')} className="text-gray-500 hover:text-[#3c8dbc] transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800">
                        Editar Contrato: <span className="text-[#3c8dbc]">{contrato.numero_contrato}</span>
                    </h2>
                </div>
                <button onClick={handleSubmit} disabled={processing} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded shadow flex items-center gap-2 transition-colors disabled:opacity-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                    Salvar Alterações
                </button>
            </div>
        }>
            <Head title={`Editar Contrato - ${contrato.numero_contrato}`} />

            <div className="py-8 max-w-5xl mx-auto sm:px-6 lg:px-8">
                
                {/* PAINEL DE CONTEXTO (Somente Leitura) */}
                <div className="mb-6 bg-gray-50 border-l-4 border-gray-400 p-5 rounded shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Origem do Contrato (Não Editável)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Processo Licitatório</p>
                            <p className="text-sm font-bold text-gray-800">{contrato.ata?.processo?.numero_processo || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Ata de Registro de Preço</p>
                            <p className="text-sm font-bold text-gray-800">Nº {contrato.ata?.numero_ata || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Teto Máximo da Ata</p>
                            <p className="text-sm font-bold text-green-700">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.ata?.valor_total_ata || 0)}</p>
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-xs text-gray-500">Fornecedor / Contratada</p>
                            <p className="text-sm font-bold text-gray-800">{contrato.fornecedor?.razao_social || 'N/D'} - CNPJ: {contrato.fornecedor?.cnpj_cpf || 'N/D'}</p>
                        </div>
                    </div>
                </div>

                {/* FORMULÁRIO DE EDIÇÃO */}
                <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Dados do Contrato</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nº do Contrato *</label>
                            <input type="text" value={data.numero_contrato} onChange={e => setData('numero_contrato', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500" placeholder="Ex: 045/2026" />
                            {errors.numero_contrato && <div className="text-red-500 text-xs mt-1 font-bold">{errors.numero_contrato}</div>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor Global (R$) *</label>
                            <input type="number" step="0.01" value={data.valor_global} onChange={e => setData('valor_global', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500 font-bold text-gray-800" placeholder="0.00" />
                            {errors.valor_global && <div className="text-red-500 text-xs mt-1 font-bold">{errors.valor_global}</div>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status Atual</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className={`w-full border-gray-300 rounded focus:ring-orange-500 font-bold ${data.status === 'Ativo' ? 'text-green-600' : data.status === 'Vencido' ? 'text-red-600' : 'text-gray-600'}`}>
                                <option value="Ativo">Ativo / Vigente</option>
                                <option value="Vencido">Vencido</option>
                                <option value="Rescindido">Rescindido</option>
                                <option value="Suspenso">Suspenso</option>
                            </select>
                            {errors.status && <div className="text-red-500 text-xs mt-1 font-bold">{errors.status}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Data de Assinatura *</label>
                            <input type="date" value={data.data_assinatura} onChange={e => setData('data_assinatura', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500" />
                            {errors.data_assinatura && <div className="text-red-500 text-xs mt-1 font-bold">{errors.data_assinatura}</div>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Início da Vigência *</label>
                            <input type="date" value={data.vigencia_inicio} onChange={e => setData('vigencia_inicio', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500" />
                            {errors.vigencia_inicio && <div className="text-red-500 text-xs mt-1 font-bold">{errors.vigencia_inicio}</div>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Fim da Vigência *</label>
                            <input type="date" value={data.vigencia_fim} onChange={e => setData('vigencia_fim', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500" />
                            {errors.vigencia_fim && <div className="text-red-500 text-xs mt-1 font-bold">{errors.vigencia_fim}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}