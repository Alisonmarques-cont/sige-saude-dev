import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ auth, fornecedores }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        razao_social: '',
        cnpj_cpf: '',
        telefone: '',
        email: '',
        tipo: 'Jurídica',
        status: 'Ativo',
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (fornecedor) => {
        setEditingId(fornecedor.id);
        setData({
            razao_social: fornecedor.razao_social,
            cnpj_cpf: fornecedor.cnpj_cpf,
            telefone: fornecedor.telefone || '',
            email: fornecedor.email || '',
            tipo: fornecedor.tipo,
            status: fornecedor.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(`/financeiro/fornecedores/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        } else {
            post('/financeiro/fornecedores', {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestão de Fornecedores / Clientes</h2>}
        >
            <Head title="Fornecedores" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Lista de Fornecedores</h3>
                            <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">
                                + Novo Fornecedor
                            </button>
                        </div>
                        
                        {fornecedores.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">Nenhum fornecedor registado ainda.</p>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="p-3">Razão Social / Nome</th>
                                        <th className="p-3">CNPJ / CPF</th>
                                        <th className="p-3">Contato</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fornecedores.map((fornecedor) => (
                                        <tr key={fornecedor.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-3 font-semibold">{fornecedor.razao_social}</td>
                                            <td className="p-3 text-sm text-gray-600">{fornecedor.cnpj_cpf}</td>
                                            <td className="p-3 text-sm text-gray-600">
                                                <div>{fornecedor.telefone || '-'}</div>
                                                <div className="text-xs text-gray-400">{fornecedor.email}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`py-1 px-3 rounded-full text-xs ${fornecedor.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {fornecedor.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <button onClick={() => openEditModal(fornecedor)} className="text-blue-500 hover:text-blue-700 font-medium text-sm mr-3">Editar</button>
                                                <button onClick={() => { if(confirm('Excluir este fornecedor?')) router.delete(`/financeiro/fornecedores/${fornecedor.id}`) }} className="text-red-500 hover:text-red-700 font-medium text-sm">Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold">{editingId ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500">Fechar ✕</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6" noValidate>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social / Nome Completo *</label>
                                    <input type="text" value={data.razao_social} onChange={e => setData('razao_social', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm" />
                                    {errors.razao_social && <div className="text-red-500 text-xs mt-1">{errors.razao_social}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ ou CPF *</label>
                                    <input type="text" value={data.cnpj_cpf} onChange={e => setData('cnpj_cpf', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm" />
                                    {errors.cnpj_cpf && <div className="text-red-500 text-xs mt-1">{errors.cnpj_cpf}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pessoa *</label>
                                    <select value={data.tipo} onChange={e => setData('tipo', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                                        <option value="Jurídica">Jurídica (Empresa)</option>
                                        <option value="Física">Física (Indivíduo)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                    <input type="text" value={data.telefone} onChange={e => setData('telefone', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status do Cadastro *</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancelar</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                                    {processing ? 'A Guardar...' : 'Salvar Fornecedor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}