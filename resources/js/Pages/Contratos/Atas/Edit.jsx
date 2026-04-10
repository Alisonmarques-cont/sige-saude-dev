import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, ata }) {
    const { data, setData, put, processing, errors } = useForm({
        numero_ata: ata.numero_ata || '',
        valor_total_ata: ata.valor_total_ata || '',
        data_assinatura: ata.data_assinatura ? ata.data_assinatura.substring(0, 10) : '',
        vigencia_fim: ata.vigencia_fim ? ata.vigencia_fim.substring(0, 10) : '',
        status: ata.status || 'Ativa',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('contratos.atas.update', ata.id));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('contratos.processos.index')} className="text-gray-500 hover:text-[#3c8dbc]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800">Editar Ata de Registro: <span className="text-[#3c8dbc]">Nº {ata.numero_ata}</span></h2>
                </div>
                <button onClick={handleSubmit} disabled={processing} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded flex items-center gap-2 shadow disabled:opacity-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                    Salvar Alterações
                </button>
            </div>
        }>
            <Head title={`Editar Ata ${ata.numero_ata}`} />

            <div className="py-8 max-w-5xl mx-auto sm:px-6 lg:px-8">
                
                {/* DADOS PROTEGIDOS (Não Editáveis para não quebrar relações) */}
                <div className="mb-6 bg-gray-50 border-l-4 border-gray-400 p-4 rounded shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-sm font-bold text-gray-700 uppercase">Processo Origem</p>
                        <p className="text-gray-600 font-medium">Proc. {ata.processo?.numero_processo} - Licitado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ata.processo?.valor_total_licitado)}</p>
                    </div>
                    <div className="text-right border-l pl-4 border-gray-200">
                        <p className="text-sm font-bold text-gray-700 uppercase">Fornecedor Vencedor</p>
                        <p className="text-gray-600 font-medium">{ata.fornecedor?.razao_social}</p>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Dados da Ata</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nº da Ata *</label>
                            <input type="text" value={data.numero_ata} onChange={e => setData('numero_ata', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor Total Registrado (R$) *</label>
                            <input type="number" step="0.01" value={data.valor_total_ata} onChange={e => setData('valor_total_ata', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-orange-500 font-bold" />
                            {errors.valor_total_ata && <div className="text-red-500 text-xs mt-1">{errors.valor_total_ata}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status Atual</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500 font-bold text-gray-700">
                                <option value="Ativa">Ativa / Vigente</option>
                                <option value="Vencida">Vencida</option>
                                <option value="Cancelada">Cancelada</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Data de Assinatura *</label>
                            <input type="date" value={data.data_assinatura} onChange={e => setData('data_assinatura', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Vigência Fim *</label>
                            <input type="date" value={data.vigencia_fim} onChange={e => setData('vigencia_fim', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-orange-500" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}