import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ auth, contas }) {
    // Estado para controlar se a Modal está aberta ou fechada
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para controlar para guardar o ID da conra que estamos a editar
    const [editingId, setEditingId] = useState(null);

    // O "useForm" do Inertia gere os campos, erros e submissão!
    const { data, setData, post, put, processing, errors, reset } = useForm({
        banco: '',
        agencia: '',
        conta: '',
        tipo: 'Corrente',
        saldo_inicial: '',
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset(); // Limpa os dados
        setIsModalOpen(true);
    };

    const openEditModal = (conta) => {
        setEditingId(conta.id);
        setData({
            banco: conta.banco,
            agencia: conta.agencia || '',
            conta: conta.conta,
            tipo: conta.tipo,
            saldo_inicial: conta.saldo_inicial,
        });
        setIsModalOpen(true);
    };

 const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingId) {
            // Se tem ID, estamos a EDITAR
            put(`/financeiro/contas/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            // Se NÃO tem ID, estamos a CRIAR
            post('/financeiro/contas', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestão de Contas Bancárias</h2>}
        >
            <Head title="Contas Bancárias" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 relative">
                        
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Lista de Contas</h3>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                            >
                                + Nova Conta
                            </button>
                        </div>
                        
                        {/* TABELA AQUI (Simplificada para foco no formulário) */}
                        {contas.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Nenhuma conta bancária registada ainda.</p>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="p-3">Banco</th>
                                        <th className="p-3">Agência / Conta</th>
                                        <th className="p-3">Tipo</th>
                                        <th className="p-3 text-right">Saldo Atual</th>
                                        <th className="p-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contas.map((conta) => (
                                        <tr key={conta.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-3 font-semibold">{conta.banco}</td>
                                            <td className="p-3">{conta.agencia || '-'} / {conta.conta}</td>
                                            <td className="p-3">
                                                <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-xs">
                                                    {conta.tipo}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right font-bold text-green-600">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.saldo_atual)}
                                            </td>
                                            <td className="p-3 text-right">
                                             <button 
                                              onClick={() => openEditModal(conta)}
                                              className="text-blue-500 hover:text-blue-700 font-medium text-sm mr-3"
                                             >
                                               Editar
                                            </button>
                                            <button 
                                             onClick={() => { /* seu codigo de excluir atual */ }}
                                             className="text-red-500 hover:text-red-700 font-medium text-sm"
                                              >
                                                Excluir
                                            </button>
                                             </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DE NOVA CONTA EM TELA CHEIA (Padrão Ouro UI) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold">Adicionar Nova Conta Bancária</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500">
                                Fechar ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6" noValidate>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Banco *</label>
                                    <input type="text" value={data.banco} onChange={e => setData('banco', e.target.value)} required
                                        className="w-full border-gray-300 rounded-md shadow-sm" placeholder="Ex: Banco do Brasil" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Agência</label>
                                    <input type="text" value={data.agencia} onChange={e => setData('agencia', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm" placeholder="Ex: 0001" />
                                </div>
                               <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nº da Conta *</label>
                                    <input type="text" value={data.conta} onChange={e => setData('conta', e.target.value)} required
                                        className="w-full border-gray-300 rounded-md shadow-sm" placeholder="Ex: 12345-6" />
                                    
                                    {/* MOSTRADOR DE ERRO AQUI */}
                                    {errors.conta && <div className="text-red-500 text-xs mt-1">{errors.conta}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta *</label>
                                    <select value={data.tipo} onChange={e => setData('tipo', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm">
                                        <option value="Corrente">Corrente</option>
                                        <option value="Poupança">Poupança</option>
                                        <option value="Investimento">Investimento</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Inicial (R$) *</label>
                                    <input type="number" step="0.01" value={data.saldo_inicial} onChange={e => setData('saldo_inicial', e.target.value)} required
                                        className="w-full border-gray-300 rounded-md shadow-sm" placeholder="0.00" />
                                    
                                    {/* MOSTRADOR DE ERRO AQUI */}
                                    {errors.saldo_inicial && <div className="text-red-500 text-xs mt-1">{errors.saldo_inicial}</div>}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                                    {processing ? 'A Guardar...' : 'Salvar Conta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}