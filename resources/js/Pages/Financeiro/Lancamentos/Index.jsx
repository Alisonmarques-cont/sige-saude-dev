import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// IMPORTANTE: Adicionei o Link aqui nesta linha!
import { Head, useForm, router, Link } from '@inertiajs/react';

export default function Index({ auth, lancamentos, contas, fornecedores }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        conta_bancaria_id: contas?.length > 0 ? contas[0].id : '',
        fornecedor_id: '',
        descricao: '',
        tipo: 'Despesa',
        valor: '',
        data_vencimento: '',
        data_pagamento: '',
        status: 'Pendente',
    });

    // Mantemos a função de abrir o modal apenas para a Edição por enquanto
    const openEditModal = (lancamento) => {
        setEditingId(lancamento.id);
        setData({
            conta_bancaria_id: lancamento.conta_bancaria_id,
            fornecedor_id: lancamento.fornecedor_id || '',
            descricao: lancamento.descricao,
            tipo: lancamento.tipo,
            valor: lancamento.valor,
            data_vencimento: lancamento.data_vencimento,
            data_pagamento: lancamento.data_pagamento || '',
            status: lancamento.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = editingId ? put : post;
        const url = editingId ? `/financeiro/lancamentos/${editingId}` : '/financeiro/lancamentos';
        
        action(url, {
            preserveScroll: true,
            onSuccess: () => { setIsModalOpen(false); reset(); }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lançamentos Financeiros</h2>}
        >
            <Head title="Lançamentos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Movimentações</h3>
                                <p className="text-sm text-gray-500 mt-1">Gira as receitas e despesas do fundo de saúde.</p>
                            </div>
                            
                            {/* AQUI ESTÁ A MÁGICA: O botão agora é um Link para a página completa! */}
                            <Link 
                                href={route('financeiro.lancamentos.create')} 
                                className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2.5 px-6 rounded shadow transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                Novo Lançamento
                            </Link>
                        </div>
                        
                        {lancamentos?.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                <p className="text-gray-500 font-medium">Nenhum lançamento registado.</p>
                                <p className="text-sm text-gray-400 mt-1">Clique no botão acima para adicionar a sua primeira movimentação.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                                        <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Conta / Fornecedor</th>
                                        <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Vencimento</th>
                                        <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Valor (R$)</th>
                                        <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lancamentos?.map((lancamento) => (
                                        <tr key={lancamento.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-3 font-semibold text-gray-700">{lancamento.descricao}</td>
                                            <td className="p-3 text-sm">
                                                <div className="text-[#3c8dbc] font-bold">{lancamento.conta_bancaria?.banco}</div>
                                                <div className="text-gray-500 text-xs">{lancamento.fornecedor?.razao_social || 'S/ Fornecedor'}</div>
                                            </td>
                                            <td className="p-3 text-sm text-gray-600">{new Date(lancamento.data_vencimento + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                            <td className="p-3">
                                                <span className={`py-1 px-3 rounded-full text-xs font-bold shadow-sm
                                                    ${lancamento.status === 'Pago' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                                      lancamento.status === 'Atrasado' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                                    {lancamento.status}
                                                </span>
                                            </td>
                                            <td className={`p-3 text-right font-bold ${lancamento.tipo === 'Receita' ? 'text-green-600' : 'text-red-500'}`}>
                                                {lancamento.tipo === 'Despesa' ? '- ' : '+ '} 
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lancamento.valor)}
                                            </td>
                                            <td className="p-3 text-right">
                                                <button onClick={() => openEditModal(lancamento)} className="text-[#3c8dbc] hover:text-[#357ca5] font-medium text-sm mr-3">Editar</button>
                                                <button onClick={() => { if(confirm('Excluir este lançamento?')) router.delete(`/financeiro/lancamentos/${lancamento.id}`) }} className="text-red-500 hover:text-red-700 font-medium text-sm">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL MANTIDO APENAS PARA A EDIÇÃO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">Editar Lançamento</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6" noValidate>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Lançamento *</label>
                                    <input type="text" value={data.descricao} onChange={e => setData('descricao', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3c8dbc] focus:border-[#3c8dbc]" placeholder="Ex: Pagamento de Internet" />
                                    {errors.descricao && <div className="text-red-500 text-xs mt-1">{errors.descricao}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                                    <select value={data.tipo} onChange={e => setData('tipo', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3c8dbc] font-medium">
                                        <option value="Despesa">🔴 Despesa (Saída)</option>
                                        <option value="Receita">🟢 Receita (Entrada)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
                                    <input type="number" step="0.01" value={data.valor} onChange={e => setData('valor', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3c8dbc]" placeholder="0.00" />
                                    {errors.valor && <div className="text-red-500 text-xs mt-1">{errors.valor}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Conta Bancária *</label>
                                    <select value={data.conta_bancaria_id} onChange={e => setData('conta_bancaria_id', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3c8dbc]">
                                        {contas?.length === 0 && <option value="">Cadastre uma conta primeiro!</option>}
                                        {contas?.map(conta => (
                                            <option key={conta.id} value={conta.id}>{conta.banco} - {conta.conta}</option>
                                        ))}
                                    </select>
                                    {errors.conta_bancaria_id && <div className="text-red-500 text-xs mt-1">{errors.conta_bancaria_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor / Cliente</label>
                                    <select value={data.fornecedor_id} onChange={e => setData('fornecedor_id', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3c8dbc]">
                                        <option value="">-- Nenhum --</option>
                                        {fornecedores?.map(fornecedor => (
                                            <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.razao_social}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
                                    <input type="date" value={data.data_vencimento} onChange={e => setData('data_vencimento', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3c8dbc]" />
                                    {errors.data_vencimento && <div className="text-red-500 text-xs mt-1">{errors.data_vencimento}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#3c8dbc]">
                                        <option value="Pendente">Pendente</option>
                                        <option value="Pago">Pago</option>
                                        <option value="Atrasado">Atrasado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded transition">Cancelar</button>
                                <button type="submit" disabled={processing} className="px-6 py-2 bg-[#3c8dbc] text-white font-bold rounded shadow hover:bg-[#357ca5] disabled:opacity-50 transition">
                                    {processing ? 'A Atualizar...' : 'Atualizar Lançamento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}