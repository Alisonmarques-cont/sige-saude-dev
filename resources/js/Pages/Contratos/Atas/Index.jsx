import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, atas }) {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Atas de Registro de Preços</h2>}>
            <Head title="Atas" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Gestão de ARP</h3>
                            <p className="text-sm text-gray-500 mt-1">Gira as atas registadas antes de se tornarem contratos.</p>
                        </div>
                        <Link href={route('contratos.atas.create')} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2.5 px-6 rounded shadow flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Nova Ata
                        </Link>
                    </div>

                    {atas?.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-medium">Nenhuma ata registada.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Nº Ata / Processo</th>
                                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">Fornecedor</th>
                                    <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Valor Total</th>
                                    <th className="p-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atas?.map((a) => (
                                    <tr key={a.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">
                                            <div className="font-bold text-[#3c8dbc] text-lg">{a.numero_ata}</div>
                                            <div className="text-xs text-gray-500">Proc: {a.processo?.numero_processo}</div>
                                        </td>
                                        <td className="p-3 text-sm font-bold text-gray-700">{a.fornecedor?.razao_social}</td>
                                        <td className="p-3 text-right font-black text-gray-800">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(a.valor_total_ata)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${a.status === 'Ativa' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => { if(confirm('Excluir Ata?')) router.delete(route('contratos.atas.destroy', a.id)) }} className="text-red-500 hover:text-red-700 font-bold text-sm">Excluir</button>
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