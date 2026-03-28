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
        endereco: '',
        tipo: 'Jurídica',
        status: 'Ativo',
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (forn) => {
        setEditingId(forn.id);
        setData({
            razao_social: forn.razao_social,
            cnpj_cpf: forn.cnpj_cpf,
            telefone: forn.telefone || '',
            email: forn.email || '',
            endereco: forn.endereco || '',
            tipo: forn.tipo,
            status: forn.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('financeiro.fornecedores.update', editingId), {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        } else {
            post(route('financeiro.fornecedores.store'), {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); }
            });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Fornecedores e Credores</h2>}>
            <Head title="Fornecedores" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Catálogo de Fornecedores</h3>
                            <p className="text-sm text-gray-500 mt-1">Empresas e pessoas físicas que prestam serviços ou fornecem materiais.</p>
                        </div>
                        <button onClick={openCreateModal} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2.5 px-6 rounded shadow flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Novo Fornecedor
                        </button>
                    </div>

                    {fornecedores?.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-medium">Nenhum fornecedor cadastrado.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Razão Social / Nome</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">CNPJ / CPF</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Contato</th>
                                    <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fornecedores?.map((forn) => (
                                    <tr key={forn.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-[#3c8dbc]">{forn.razao_social}</div>
                                            <div className="text-xs text-gray-500 uppercase">{forn.tipo}</div>
                                        </td>
                                        <td className="p-3 text-sm font-medium text-gray-700">{forn.cnpj_cpf}</td>
                                        <td className="p-3 text-sm text-gray-600">
                                            <div>{forn.telefone || '-'}</div>
                                            <div className="text-xs text-gray-400">{forn.email || '-'}</div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${forn.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {forn.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => openEditModal(forn)} className="text-[#3c8dbc] hover:text-[#357ca5] font-bold text-sm mr-4">Editar</button>
                                            <button onClick={() => { if(confirm('Excluir este fornecedor?')) router.delete(route('financeiro.fornecedores.destroy', forn.id)) }} className="text-red-500 hover:text-red-700 font-bold text-sm">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* MODAL DE FORNECEDOR */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tipo *</label>
                                    <select value={data.tipo} onChange={e => setData('tipo', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]">
                                        <option value="Jurídica">Pessoa Jurídica (Empresa)</option>
                                        <option value="Física">Pessoa Física</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">CNPJ ou CPF *</label>
                                    <input type="text" value={data.cnpj_cpf} onChange={e => setData('cnpj_cpf', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Apenas números ou formatado" />
                                    {errors.cnpj_cpf && <div className="text-red-500 text-xs mt-1 font-bold">{errors.cnpj_cpf}</div>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Razão Social / Nome Completo *</label>
                                    <input type="text" value={data.razao_social} onChange={e => setData('razao_social', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" />
                                    {errors.razao_social && <div className="text-red-500 text-xs mt-1">{errors.razao_social}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
                                    <input type="text" value={data.telefone} onChange={e => setData('telefone', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="(00) 00000-0000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="contato@empresa.com" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Endereço Completo</label>
                                    <input type="text" value={data.endereco} onChange={e => setData('endereco', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Rua, Número, Bairro, Cidade - UF" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] font-bold">
                                        <option value="Ativo" className="text-green-600">Ativo</option>
                                        <option value="Inativo" className="text-red-600">Inativo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-[#00a65a] text-white font-bold rounded shadow-md hover:bg-[#008d4c] disabled:opacity-50 transition-all">
                                    {processing ? 'A Gravar...' : (editingId ? 'Atualizar' : 'Salvar Fornecedor')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}