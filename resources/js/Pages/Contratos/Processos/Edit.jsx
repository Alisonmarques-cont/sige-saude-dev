import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, processo }) {
    const { data, setData, put, processing, errors } = useForm({
        numero_processo: processo.numero_processo || '',
        modalidade: processo.modalidade || 'Pregão Eletrônico',
        numero_modalidade: processo.numero_modalidade || '',
        objeto: processo.objeto || '',
        ano: processo.ano || new Date().getFullYear(),
        valor_total_licitado: processo.valor_total_licitado || '',
        status: processo.status || 'Em Andamento',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('contratos.processos.update', processo.id));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('contratos.processos.index')} className="text-gray-500 hover:text-[#3c8dbc]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800">Editar Processo: <span className="text-[#3c8dbc]">{processo.numero_processo}</span></h2>
                </div>
                <button onClick={handleSubmit} disabled={processing} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded flex items-center gap-2 shadow disabled:opacity-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                    Salvar Alterações
                </button>
            </div>
        }>
            <Head title={`Editar Processo ${processo.numero_processo}`} />

            <div className="py-8 max-w-5xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Detalhes da Licitação</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nº do Processo *</label>
                            <input type="text" value={data.numero_processo} onChange={e => setData('numero_processo', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Modalidade da Licitação *</label>
                            <select value={data.modalidade} onChange={e => setData('modalidade', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500">
                                <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                                <option value="Pregão Presencial">Pregão Presencial</option>
                                <option value="Inexigibilidade">Inexigibilidade</option>
                                <option value="Dispensa">Dispensa</option>
                                <option value="Concorrência">Concorrência</option>
                                <option value="Adesão (Carona)">Adesão (Carona)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nº da Modalidade</label>
                            <input type="text" value={data.numero_modalidade} onChange={e => setData('numero_modalidade', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500" />
                        </div>
                        
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Objeto da Licitação *</label>
                            <textarea rows="3" value={data.objeto} onChange={e => setData('objeto', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-orange-500"></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ano *</label>
                            <input type="number" value={data.ano} onChange={e => setData('ano', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor Total Licitado (Teto) *</label>
                            <input type="number" step="0.01" value={data.valor_total_licitado} onChange={e => setData('valor_total_licitado', e.target.value)} required className="w-full border-gray-300 rounded focus:ring-orange-500 font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status do Processo</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded focus:ring-orange-500 font-bold text-gray-700">
                                <option value="Em Andamento">Em Andamento</option>
                                <option value="Homologado">Homologado / Vencedor Definido</option>
                                <option value="Concluído">Concluído</option>
                                <option value="Deserto/Fracassado">Deserto / Fracassado</option>
                                <option value="Suspenso">Suspenso</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}