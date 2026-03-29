import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, processos, fornecedores }) {
    const { data, setData, post, processing, errors } = useForm({
        processo_id: '',
        fornecedor_id: '',
        numero_ata: '',
        valor_total_ata: '',
        data_assinatura: '',
        vigencia_fim: '',
        status: 'Ativa',
    });

    const [processoSelecionado, setProcessoSelecionado] = useState(null);

    // Efeito para mostrar o saldo do Processo quando o utilizador o seleciona
    useEffect(() => {
        if (data.processo_id) {
            const proc = processos.find(p => p.id == data.processo_id);
            setProcessoSelecionado(proc);
        } else {
            setProcessoSelecionado(null);
        }
    }, [data.processo_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contratos.atas.store'));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('contratos.atas.index')} className="text-gray-500 hover:text-[#3c8dbc]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800">Nova Ata de Registro de Preços</h2>
                </div>
                <button onClick={handleSubmit} disabled={processing} className="bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold py-2.5 px-6 rounded flex items-center gap-2 shadow">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Registrar Ata
                </button>
            </div>
        }>
            <Head title="Nova Ata de Registro" />

            <div className="py-8 max-w-5xl mx-auto sm:px-6 lg:px-8">
                
                {processoSelecionado && (
                    <div className="mb-6 bg-blue-50 border-l-4 border-[#3c8dbc] p-4 rounded shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-blue-800 font-bold">Processo Origem: {processoSelecionado.numero_processo} ({processoSelecionado.modalidade})</p>
                                <p className="text-xs text-blue-600 mt-1">Objeto: {processoSelecionado.objeto}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Teto Licitado</p>
                                <p className="text-xl font-black text-blue-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(processoSelecionado.valor_total_licitado)}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Vínculos da Ata</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Processo Licitatório (Pregão) *</label>
                            <select value={data.processo_id} onChange={e => setData('processo_id', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]">
                                <option value="">Selecione o Pregão...</option>
                                {processos?.map(p => (
                                    <option key={p.id} value={p.id}>{p.numero_processo} - Licitado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor_total_licitado)}</option>
                                ))}
                            </select>
                            {errors.processo_id && <div className="text-red-500 text-xs mt-1">{errors.processo_id}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Fornecedor (Vencedor) *</label>
                            <select value={data.fornecedor_id} onChange={e => setData('fornecedor_id', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]">
                                <option value="">Selecione o Fornecedor...</option>
                                {fornecedores?.map(f => (
                                    <option key={f.id} value={f.id}>{f.razao_social} ({f.cnpj_cpf})</option>
                                ))}
                            </select>
                            {errors.fornecedor_id && <div className="text-red-500 text-xs mt-1">{errors.fornecedor_id}</div>}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Dados da Ata</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nº da Ata *</label>
                            <input type="text" value={data.numero_ata} onChange={e => setData('numero_ata', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: 01/2026" />
                            {errors.numero_ata && <div className="text-red-500 text-xs mt-1">{errors.numero_ata}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor Total Registrado (R$) *</label>
                            <input type="number" step="0.01" value={data.valor_total_ata} onChange={e => setData('valor_total_ata', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] font-bold text-gray-800" placeholder="0.00" />
                            {errors.valor_total_ata && <div className="text-red-500 text-xs mt-1 font-bold">{errors.valor_total_ata}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status Atual</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] font-bold text-[#00a65a]">
                                <option value="Ativa">Ativa / Vigente</option>
                                <option value="Vencida">Vencida</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Data de Assinatura *</label>
                            <input type="date" value={data.data_assinatura} onChange={e => setData('data_assinatura', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Vigência Fim *</label>
                            <input type="date" value={data.vigencia_fim} onChange={e => setData('vigencia_fim', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}