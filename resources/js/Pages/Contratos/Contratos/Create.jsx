import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, atas, fornecedores }) {
    const { data, setData, post, processing, errors } = useForm({
        ata_id: '',
        fornecedor_id: '',
        numero_contrato: '',
        valor_global: '',
        data_assinatura: '',
        vigencia_inicio: '',
        vigencia_fim: '',
        status: 'Ativo',
    });

    const [ataSelecionada, setAtaSelecionada] = useState(null);

    // 🧠 MAGIA DA UI: Quando seleciona a Ata, auto-preenche o fornecedor e mostra o Teto da Ata!
    useEffect(() => {
        if (data.ata_id) {
            const ata = atas.find(a => a.id == data.ata_id);
            setAtaSelecionada(ata);
            if(ata) {
                setData('fornecedor_id', ata.fornecedor_id);
            }
        } else {
            setAtaSelecionada(null);
            setData('fornecedor_id', '');
        }
    }, [data.ata_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contratos.lista.store'));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('contratos.lista.index')} className="text-gray-500 hover:text-[#3c8dbc]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800">Novo Contrato Firmado</h2>
                </div>
                <button onClick={handleSubmit} disabled={processing} className="bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold py-2.5 px-6 rounded shadow flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Salvar Contrato
                </button>
            </div>
        }>
            <Head title="Novo Contrato" />

            <div className="py-8 max-w-5xl mx-auto sm:px-6 lg:px-8">
                
                {ataSelecionada && (
                    <div className="mb-6 bg-green-50 border-l-4 border-[#00a65a] p-4 rounded shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-green-800 font-bold">Ata Origem: Nº {ataSelecionada.numero_ata} (Processo: {ataSelecionada.processo?.numero_processo})</p>
                                <p className="text-xs text-green-600 mt-1">Vigência até: {new Date(ataSelecionada.vigencia_fim).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Teto da Ata (Máximo)</p>
                                <p className="text-xl font-black text-green-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ataSelecionada.valor_total_ata)}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Vínculo Origem</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ata de Registro de Preços *</label>
                            <select value={data.ata_id} onChange={e => setData('ata_id', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]">
                                <option value="">Selecione a Ata...</option>
                                {atas?.map(a => (
                                    <option key={a.id} value={a.id}>Ata {a.numero_ata} - Proc: {a.processo?.numero_processo}</option>
                                ))}
                            </select>
                            {errors.ata_id && <div className="text-red-500 text-xs mt-1 font-bold">{errors.ata_id}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Fornecedor / Contratada *</label>
                            <select value={data.fornecedor_id} onChange={e => setData('fornecedor_id', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] bg-gray-50 pointer-events-none" readOnly>
                                <option value="">Auto-preenchido pela Ata...</option>
                                {fornecedores?.map(f => (
                                    <option key={f.id} value={f.id}>{f.razao_social} - {f.cnpj_cpf}</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-500 mt-1">O Fornecedor é amarrado à Ata de Registro selecionada.</p>
                            {errors.fornecedor_id && <div className="text-red-500 text-xs mt-1">{errors.fornecedor_id}</div>}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Detalhes e Prazos</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nº do Contrato *</label>
                            <input type="text" value={data.numero_contrato} onChange={e => setData('numero_contrato', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: 045/2026" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor Global (R$) *</label>
                            <input type="number" step="0.01" value={data.valor_global} onChange={e => setData('valor_global', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] font-bold text-gray-800" placeholder="0.00" />
                            {errors.valor_global && <div className="text-red-500 text-xs mt-1 font-bold">{errors.valor_global}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status Atual</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] font-bold text-[#00a65a]">
                                <option value="Ativo">Ativo / Vigente</option>
                                <option value="Vencido">Vencido</option>
                                <option value="Rescindido">Rescindido</option>
                                <option value="Suspenso">Suspenso</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Data de Assinatura *</label>
                            <input type="date" value={data.data_assinatura} onChange={e => setData('data_assinatura', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Início da Vigência *</label>
                            <input type="date" value={data.vigencia_inicio} onChange={e => setData('vigencia_inicio', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Fim da Vigência *</label>
                            <input type="date" value={data.vigencia_fim} onChange={e => setData('vigencia_fim', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}