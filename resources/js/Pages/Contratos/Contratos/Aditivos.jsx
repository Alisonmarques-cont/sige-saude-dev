import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Aditivos({ auth, contrato }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        numero_aditivo: '',
        tipo: 'Valor e Prazo',
        valor_adicionado: '0',
        nova_data_fim: '',
        data_assinatura: '',
        motivo: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contratos.aditivos.store', contrato.id), {
            preserveScroll: true,
            onSuccess: () => { setIsModalOpen(false); reset(); }
        });
    };

    // 🧠 MAGIA DA ARQUITETURA: Cálculos em Tempo Real!
    const valorAditivado = contrato.aditivos.reduce((acc, curr) => acc + parseFloat(curr.valor_adicionado), 0);
    const valorAtualizado = parseFloat(contrato.valor_global) + valorAditivado;
    
    // Busca a maior data de fim entre os aditivos que alteram prazo
    const datasFim = contrato.aditivos.filter(a => a.nova_data_fim).map(a => new Date(a.nova_data_fim));
    const dataFimAtualizada = datasFim.length > 0 ? new Date(Math.max(...datasFim)) : new Date(contrato.vigencia_fim);

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-4">
                <Link href={route('contratos.lista.index')} className="text-gray-500 hover:text-[#3c8dbc]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </Link>
                <h2 className="font-semibold text-xl text-gray-800">Aditivos do Contrato: <span className="text-[#3c8dbc]">{contrato.numero_contrato}</span></h2>
            </div>
        }>
            <Head title={`Aditivos - ${contrato.numero_contrato}`} />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* PAINEL DE BORDO (RESUMO) */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-[#3c8dbc] grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Fornecedor</p>
                        <p className="text-sm font-bold text-gray-800 mt-1 truncate" title={contrato.fornecedor.razao_social}>{contrato.fornecedor.razao_social}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Valor Inicial</p>
                        <p className="text-sm font-bold text-gray-800 mt-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.valor_global)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#00a65a] font-bold uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            Valor Atualizado
                        </p>
                        <p className="text-xl font-black text-[#00a65a] mt-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorAtualizado)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Vigência Atualizada</p>
                        <p className="text-xl font-black text-gray-800 mt-1">{dataFimAtualizada.toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                {/* TABELA DE ADITIVOS */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="text-lg font-bold text-gray-800">Histórico de Aditivos e Supressões</h3>
                        <button onClick={() => { reset(); setIsModalOpen(true); }} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Novo Aditivo
                        </button>
                    </div>

                    {contrato.aditivos?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 font-medium">Nenhum termo aditivo registado para este contrato.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Nº Aditivo / Data</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Tipo</th>
                                    <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Acréscimo/Supressão</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Nova Data Fim</th>
                                    <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contrato.aditivos.map((aditivo) => (
                                    <tr key={aditivo.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-gray-800">{aditivo.numero_aditivo}</div>
                                            <div className="text-xs text-gray-500">Assinado: {new Date(aditivo.data_assinatura).toLocaleDateString('pt-BR')}</div>
                                        </td>
                                        <td className="p-3"><span className="px-2 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded border border-blue-100 uppercase">{aditivo.tipo}</span></td>
                                        <td className={`p-3 text-right font-bold ${aditivo.valor_adicionado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {aditivo.valor_adicionado != 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(aditivo.valor_adicionado) : '-'}
                                        </td>
                                        <td className="p-3 text-sm font-bold text-gray-700">{aditivo.nova_data_fim ? new Date(aditivo.nova_data_fim).toLocaleDateString('pt-BR') : '-'}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => { if(confirm('Excluir Aditivo? Isto recalculará o contrato.')) router.delete(route('contratos.aditivos.destroy', { contrato: contrato.id, aditivo: aditivo.id })) }} className="text-red-500 hover:text-red-700 font-bold text-sm">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* MODAL CRIAR ADITIVO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Lançar Termo Aditivo</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-5 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nº do Aditivo *</label>
                                    <input type="text" value={data.numero_aditivo} onChange={e => setData('numero_aditivo', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: 01/2026" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Finalidade (Tipo) *</label>
                                    <select value={data.tipo} onChange={e => setData('tipo', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]">
                                        <option value="Valor">Acréscimo/Supressão de Valor</option>
                                        <option value="Prazo">Prorrogação de Prazo</option>
                                        <option value="Valor e Prazo">Valor e Prazo</option>
                                        <option value="Outros">Outros motivos</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Acréscimo/Supressão (R$)</label>
                                    <input type="number" step="0.01" value={data.valor_adicionado} onChange={e => setData('valor_adicionado', e.target.value)} disabled={data.tipo === 'Prazo' || data.tipo === 'Outros'} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] disabled:bg-gray-100" placeholder="0.00" />
                                    <p className="text-[10px] text-gray-500 mt-1">Use sinal de menos (-) para supressões.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nova Data de Término</label>
                                    <input type="date" value={data.nova_data_fim} onChange={e => setData('nova_data_fim', e.target.value)} disabled={data.tipo === 'Valor'} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] disabled:bg-gray-100" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Data de Assinatura *</label>
                                    <input type="date" value={data.data_assinatura} onChange={e => setData('data_assinatura', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Justificativa / Objeto do Aditivo</label>
                                    <textarea rows="2" value={data.motivo} onChange={e => setData('motivo', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]"></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-[#00a65a] text-white font-bold rounded shadow-md hover:bg-[#008d4c] disabled:opacity-50">Lançar Aditivo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}