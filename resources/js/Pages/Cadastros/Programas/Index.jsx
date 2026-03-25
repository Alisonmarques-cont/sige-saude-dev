import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, programas }) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Programas de Saúde</h2>}>
            <Head title="Programas" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Programas e Blocos de Financiamento</h3>
                            <p className="text-sm text-gray-500 mt-1">Gira os recursos do SUS e Emendas.</p>
                        </div>
                        
                        <Link href={route('financeiro.programas.create')} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2.5 px-6 rounded shadow transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Novo Programa
                        </Link>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-3 text-xs font-bold text-gray-500 uppercase">Programa / Bloco</th>
                                <th className="p-3 text-xs font-bold text-gray-500 uppercase">Repasse</th>
                                <th className="p-3 text-xs font-bold text-gray-500 uppercase">Portaria</th>
                                <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programas?.length > 0 ? programas.map((prog) => (
                                <tr key={prog.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="font-bold text-[#3c8dbc]">{prog.nome}</div>
                                        <div className="text-xs text-gray-500 font-medium">{prog.bloco} {prog.codigo ? `| Cód: ${prog.codigo}` : ''}</div>
                                    </td>
                                    <td className="p-3 text-sm font-medium text-gray-700">{prog.tipo_repasse}</td>
                                    <td className="p-3 text-sm text-gray-500 italic">{prog.portaria || 'N/A'}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => { if(confirm('Excluir?')) router.delete(route('financeiro.programas.destroy', prog.id)) }} className="text-red-500 hover:text-red-700 text-sm font-bold">Excluir</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Nenhum programa cadastrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}