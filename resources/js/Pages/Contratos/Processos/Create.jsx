import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        numero_processo: '',
        modalidade: 'Pregão Eletrônico',
        numero_modalidade: '',
        objeto: '',
        ano: new Date().getFullYear(),
        status: 'Em Andamento',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contratos.processos.store'));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={route('contratos.processos.index')} className="text-gray-500 hover:text-[#3c8dbc]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800">Abertura de Processo Licitatório</h2>
                </div>
                <button onClick={handleSubmit} disabled={processing} className="bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold py-2.5 px-6 rounded shadow flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {processing ? 'A Gravar...' : 'Salvar Processo'}
                </button>
            </div>
        }>
            <Head title="Novo Processo" />

            <div className="py-8 max-w-5xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    
                    <h3 className="text-lg font-bold text-gray-700 mb-6 border-b pb-2">Dados do Processo Administrativo</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nº do Processo Adm. *</label>
                            <input type="text" value={data.numero_processo} onChange={e => setData('numero_processo', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: 045/2026" />
                            {errors.numero_processo && <div className="text-red-500 text-xs mt-1">{errors.numero_processo}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Ano de Exercício *</label>
                            <input type="number" value={data.ano} onChange={e => setData('ano', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status Atual *</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] font-bold text-gray-700">
                                <option value="Em Andamento">Em Andamento</option>
                                <option value="Homologado">Homologado</option>
                                <option value="Deserto/Fracassado">Deserto / Fracassado</option>
                                <option value="Suspenso">Suspenso</option>
                                <option value="Concluído">Concluído</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Modalidade da Licitação *</label>
                            <select value={data.modalidade} onChange={e => setData('modalidade', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]">
                                <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                                <option value="Pregão Presencial">Pregão Presencial</option>
                                <option value="Dispensa">Dispensa de Licitação</option>
                                <option value="Inexigibilidade">Inexigibilidade</option>
                                <option value="Concorrência">Concorrência</option>
                                <option value="Adesão (Carona)">Adesão à ARP (Carona)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nº da Modalidade / Pregão</label>
                            <input type="text" value={data.numero_modalidade} onChange={e => setData('numero_modalidade', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: PE 015/2026" />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Objeto da Licitação *</label>
                            <textarea rows="4" value={data.objeto} onChange={e => setData('objeto', e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc]" placeholder="Ex: Aquisição de medicamentos básicos para suprir as necessidades da Farmácia Central..."></textarea>
                            {errors.objeto && <div className="text-red-500 text-xs mt-1">{errors.objeto}</div>}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}