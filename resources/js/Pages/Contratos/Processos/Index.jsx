import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, processos }) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Processos Licitatórios</h2>}>
            <Head title="Processos" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Gestão de Licitações</h3>
                            <p className="text-sm text-gray-500 mt-1">Pregões, Dispensas, Inexigibilidades e Contratos.</p>
                        </div>
                        <Link href={route('contratos.processos.create')} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2.5 px-6 rounded shadow transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Novo Processo
                        </Link>
                    </div>

                    {processos?.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-medium">Nenhum processo licitatório registado.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Processo / Ano</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Modalidade</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Objeto</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processos?.map((proc) => (
                                    <tr key={proc.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-gray-800 text-lg">{proc.numero_processo}</div>
                                            <div className="text-xs font-bold text-gray-500">Ano: {proc.ano}</div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <div className="font-bold text-[#3c8dbc]">{proc.modalidade}</div>
                                            {proc.numero_modalidade && <div className="text-xs text-gray-500">Nº {proc.numero_modalidade}</div>}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600 font-medium max-w-xs truncate" title={proc.objeto}>
                                            {proc.objeto}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${proc.status === 'Homologado' || proc.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {proc.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => { if(confirm('Excluir este processo?')) router.delete(route('contratos.processos.destroy', proc.id)) }} className="text-red-500 hover:text-red-700 font-bold text-sm">Excluir</button>
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