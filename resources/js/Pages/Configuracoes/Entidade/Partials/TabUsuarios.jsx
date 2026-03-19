import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function TabUsuarios({ usuarios, auth }) {
    const [showNewUserForm, setShowNewUserForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('configuracoes.usuarios.store'), {
            onSuccess: () => {
                setShowNewUserForm(false);
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Tem a certeza que deseja excluir definitivamente este utilizador?')) {
            router.delete(route('configuracoes.usuarios.destroy', id));
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-700">Gestão de Usuários</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-tight font-medium mt-1">Lista de operadores com acesso ao Sige Saúde.</p>
                </div>
                <button 
                    onClick={() => setShowNewUserForm(!showNewUserForm)}
                    className="bg-[#00a65a] hover:bg-[#008d4c] text-white text-sm font-bold py-2 px-4 rounded shadow transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    {showNewUserForm ? 'Cancelar' : 'Novo Usuário'}
                </button>
            </div>

            {showNewUserForm && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 shadow-inner">
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 border-b pb-2">Adicionar Novo Operador</h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" required />
                            {errors.name && <div className="text-red-500 text-xs mt-1 font-bold">{errors.name}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Acesso</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" required />
                            {errors.email && <div className="text-red-500 text-xs mt-1 font-bold">{errors.email}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha Inicial</label>
                            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" required />
                            {errors.password && <div className="text-red-500 text-xs mt-1 font-bold">{errors.password}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirme a Senha</label>
                            <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" required />
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-2 pt-4 border-t">
                            <button type="submit" disabled={processing} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2 px-6 rounded shadow transition-colors">
                                {processing ? 'A criar...' : 'Registar Usuário'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Registado em</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios && usuarios.length > 0 ? (
                            usuarios.map((usr) => (
                                <tr key={usr.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#3c8dbc] flex items-center justify-center text-white font-bold uppercase text-xs">
                                                {usr.name.charAt(0)}
                                            </div>
                                            <div className="ml-4 font-medium text-gray-900">{usr.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usr.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(usr.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {auth.user.id !== usr.id ? (
                                            <button onClick={() => handleDelete(usr.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Excluir Acesso">
                                                <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        ) : (
                                            <span className="text-xs text-green-600 font-bold px-2 py-1 bg-green-100 rounded-full border border-green-200">Seu Perfil</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">Nenhum utilizador encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}