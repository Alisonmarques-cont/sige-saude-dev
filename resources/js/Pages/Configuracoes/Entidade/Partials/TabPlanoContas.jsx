import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function TabPlanoContas({ planoContas }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        codigo: '',
        descricao: '',
        tipo: 'Despesa', // Começa como despesa por padrão (o mais comum)
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('configuracoes.plano_contas.store'), {
            onSuccess: () => {
                setShowForm(false);
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Tem a certeza que deseja excluir esta categoria? Ela pode fazer falta em relatórios futuros.')) {
            router.delete(route('configuracoes.plano_contas.destroy', id));
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-700">Plano de Contas</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-tight font-medium mt-1">Categorização de Receitas e Despesas do Fundo de Saúde.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white text-sm font-bold py-2 px-4 rounded shadow transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    {showForm ? 'Cancelar' : 'Nova Conta'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 shadow-inner">
                    <h4 className="text-sm font-bold text-gray-700 uppercase mb-4 border-b pb-2">Adicionar Nova Categoria</h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código Contábil</label>
                            <input type="text" value={data.codigo} onChange={e => setData('codigo', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" placeholder="Ex: 3.3.90.30" required />
                            {errors.codigo && <div className="text-red-500 text-xs mt-1 font-bold">{errors.codigo}</div>}
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Conta</label>
                            <input type="text" value={data.descricao} onChange={e => setData('descricao', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" placeholder="Ex: Material de Consumo" required />
                            {errors.descricao && <div className="text-red-500 text-xs mt-1 font-bold">{errors.descricao}</div>}
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select value={data.tipo} onChange={e => setData('tipo', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]">
                                <option value="Receita">Receita (Entrada)</option>
                                <option value="Despesa">Despesa (Saída)</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-4 flex justify-end mt-2 pt-4 border-t">
                            <button type="submit" disabled={processing} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2 px-6 rounded shadow transition-colors">
                                {processing ? 'A gravar...' : 'Salvar Categoria'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* TABELA DE PLANO DE CONTAS */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Tipo</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {planoContas && planoContas.length > 0 ? (
                            planoContas.map((conta) => (
                                <tr key={conta.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                                        {conta.codigo}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {conta.descricao}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${conta.tipo === 'Receita' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                            {conta.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(conta.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Excluir Conta">
                                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">Nenhuma conta cadastrada. O seu Plano de Contas está vazio.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}