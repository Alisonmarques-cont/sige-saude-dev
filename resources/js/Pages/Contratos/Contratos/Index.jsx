import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, contratos }) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Contratos Firmados</h2>}>
            <Head title="Contratos" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Gestão de Contratos</h3>
                            <p className="text-sm text-gray-500 mt-1">Acompanhe vigências e saldos globais.</p>
                        </div>
                        <Link href={route('contratos.lista.create')} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2.5 px-6 rounded shadow flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Novo Contrato
                        </Link>
                    </div>

                    {contratos?.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-medium">Nenhum contrato registado.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Nº Contrato</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Fornecedor</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Vigência Fim</th>
                                    <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Valor Global</th>
                                    <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contratos?.map((c) => (
                                    <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-[#3c8dbc] text-lg">{c.numero_contrato}</div>
                                            <div className="text-xs text-gray-500">Proc: {c.processo?.numero_processo}</div>
                                        </td>
                                        <td className="p-3 text-sm font-bold text-gray-700">{c.fornecedor?.razao_social || 'N/D'}</td>
                                        <td className="p-3 text-sm font-medium">
                                            {new Date(c.vigencia_fim).toLocaleDateString('pt-BR')}
                                            <span className={`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${c.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span>
                                        </td>
                                        <td className="p-3 text-right font-black text-gray-800 text-lg">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.valor_global)}
                                        </td>
                                        <td>
                                        <Link href={route('contratos.aditivos.index', c.id)} className="inline-block px-3 py-1 bg-gray-100 text-[#3c8dbc] hover:bg-blue-50 hover:text-blue-700 font-bold text-xs rounded border border-gray-200 mr-3 transition-colors">Aditivos {c.aditivos?.length > 0 && `(${c.aditivos.length})`}</Link>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => { if(confirm('Excluir?')) router.delete(route('contratos.lista.destroy', c.id)) }} className="text-red-500 hover:text-red-700 font-bold text-sm">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
