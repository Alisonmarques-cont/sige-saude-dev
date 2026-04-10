import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Hub({ auth, processos }) {
    const [busca, setBusca] = useState('');

    // 🧠 Cálculos Inteligentes para os KPIs
    let contratosAtivos = 0;
    let volumeContratado = 0;
    let vencemEm60Dias = 0;

    const hoje = new Date();
    const sessentaDias = new Date();
    sessentaDias.setDate(hoje.getDate() + 60);

    // Varre a árvore para calcular os KPIs
    processos?.forEach(p => {
        p.atas?.forEach(a => {
            if (a.contrato) {
                if (a.contrato.status === 'Ativo') contratosAtivos++;
                volumeContratado += parseFloat(a.contrato.valor_global);
                
                const dataFim = new Date(a.contrato.vigencia_fim);
                if (dataFim > hoje && dataFim <= sessentaDias) vencemEm60Dias++;
            }
        });
    });

    // Filtro da barra de pesquisa
    const processosFiltrados = processos?.filter(p => {
        const termo = busca.toLowerCase();
        return p.numero_processo?.toLowerCase().includes(termo) ||
               p.objeto?.toLowerCase().includes(termo) ||
               p.atas?.some(a => a.fornecedor?.razao_social?.toLowerCase().includes(termo)) ||
               p.atas?.some(a => a.contrato?.numero_contrato?.toLowerCase().includes(termo));
    });

    // Função para calcular a percentagem da barra de progresso do tempo do contrato
    const calcularProgressoTempo = (inicio, fim) => {
        const dataInicio = new Date(inicio).getTime();
        const dataFim = new Date(fim).getTime();
        const dataHoje = new Date().getTime();
        
        if (dataHoje <= dataInicio) return 0;
        if (dataHoje >= dataFim) return 100;
        
        return ((dataHoje - dataInicio) / (dataFim - dataInicio)) * 100;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestão de Contratos" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* CABEÇALHO */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-[#1a202c]">Gestão de Contratos</h2>
                        <p className="text-sm text-gray-500 mt-1">Acompanhe licitações, atas e vigências contratuais.</p>
                    </div>
                    <Link href={route('contratos.processos.create')} className="bg-[#0f172a] hover:bg-black text-white font-bold py-2.5 px-5 rounded flex items-center gap-2 shadow-sm transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Novo Processo
                    </Link>
                </div>

                {/* KPIs (CARDS) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-800">{contratosAtivos}</h3>
                            <p className="text-sm font-medium text-gray-500">Contratos Ativos</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-800">{vencemEm60Dias}</h3>
                            <p className="text-sm font-medium text-gray-500">Vencem em 60 dias</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(volumeContratado)}</h3>
                            <p className="text-sm font-medium text-gray-500">Volume Contratado</p>
                        </div>
                    </div>
                </div>

                {/* CONTAINER PRINCIPAL E BUSCA */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            Filtrar Processos
                        </label>
                        <input 
                            type="text" 
                            className="w-full border-gray-200 rounded-lg focus:ring-[#3c8dbc] text-sm py-2.5" 
                            placeholder="Busque por número do contrato, pregão, fornecedor ou objeto..." 
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                        />
                    </div>

                    <div className="p-6 bg-white">
                        {processosFiltrados?.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                <p className="text-gray-500 font-bold">Nenhum processo encontrado</p>
                                <p className="text-sm text-gray-400">Tente buscar por outro número ou crie um novo processo.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {processosFiltrados?.map(proc => (
                                    // CARTÃO DO PROCESSO (NÍVEL 1)
                                    <div key={proc.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        
                                        {/* CABEÇALHO PROCESSO */}
                                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 bg-white">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-[#1a202c] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                                                    Proc. {proc.numero_processo}
                                                </span>
                                                <span className="font-bold text-gray-700 text-sm">{proc.modalidade} {proc.numero_modalidade}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3 md:mt-0">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 hidden md:inline-block">
                                                    Estimado <span className="text-gray-700 ml-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proc.valor_total_licitado)}</span>
                                                </span>
                                                
                                                {/* Ações do Processo */}
                                                <Link href={route('contratos.processos.edit', proc.id)} className="p-1.5 text-gray-400 hover:text-orange-500 bg-gray-50 hover:bg-orange-50 rounded border border-gray-200 transition-colors" title="Editar Processo">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </Link>
                                                <button onClick={() => { if(confirm('Atenção: Excluir este processo apagará também TODAS as Atas e Contratos vinculados. Deseja continuar?')) router.delete(route('contratos.processos.destroy', proc.id)) }} className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded border border-gray-200 transition-colors" title="Excluir Processo">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>

                                                <Link href={route('contratos.atas.create', { processo_id: proc.id })} className="ml-2 text-sm font-bold text-gray-600 border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors">
                                                    + Nova Ata
                                                </Link>
                                            </div>
                                        </div>

                                        {/* OBJETO */}
                                        <div className="p-4 bg-gray-50/50">
                                            <div className="flex gap-2">
                                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M18 13v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6h16zM4 3a2 2 0 012-2h8a2 2 0 012 2v6H4V3z" /></svg>
                                                <p className="text-sm text-gray-600 font-medium uppercase leading-relaxed">{proc.objeto}</p>
                                            </div>
                                        </div>

                                        {/* LISTA DE ATAS (NÍVEL 2) */}
                                        <div className="flex flex-col">
                                            {proc.atas?.map(ata => (
                                                <div key={ata.id} className="border-t border-gray-100">
                                                    {/* CABEÇALHO ATA */}
                                                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                                                            <span className="text-sm font-bold text-gray-700">Ata nº {ata.numero_ata}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span className="text-sm font-bold text-gray-600 truncate max-w-[200px] md:max-w-md">{ata.fornecedor?.razao_social}</span>
                                                        </div>
                                                       <div className="flex items-center gap-2 mt-3 md:mt-0">
                                                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 mr-2 hidden md:inline-block">
                                                                Reg: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ata.valor_total_ata)}
                                                            </span>
                                                            
                                                            {/* Ações da Ata */}
                                                            <Link href={route('contratos.atas.edit', ata.id)} className="p-1.5 text-gray-400 hover:text-orange-500 bg-white hover:bg-orange-50 rounded border border-gray-200 transition-colors" title="Editar Ata">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                            </Link>
                                                            <button onClick={() => { if(confirm('Excluir esta Ata? Contratos vinculados também serão apagados.')) router.delete(route('contratos.atas.destroy', ata.id)) }} className="p-1.5 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded border border-gray-200 transition-colors" title="Excluir Ata">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                            </button>

                                                            {!ata.contrato && (
                                                                <Link href={route('contratos.lista.create', { ata_id: ata.id })} className="ml-2 text-sm font-bold text-gray-600 border border-gray-300 rounded px-3 py-1.5 hover:bg-white transition-colors bg-gray-50 shadow-sm">
                                                                    + Contrato
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* CONTRATO DA ATA (NÍVEL 3) */}
                                                    {ata.contrato && (
                                                        <div className="p-4 ml-0 md:ml-4 border-t border-gray-100 bg-white grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                                            <div className="md:col-span-3">
                                                                <div className="flex items-center gap-2 text-blue-600 font-black text-sm">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                                                                    Contrato nº {ata.contrato.numero_contrato}
                                                                </div>
                                                                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                                    Ass: {new Date(ata.contrato.data_assinatura).toLocaleDateString('pt-BR')}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="md:col-span-5 flex flex-col">
                                                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                                                                    <span>Progresso</span>
                                                                    <span className={ata.contrato.status === 'Ativo' ? 'text-green-500' : 'text-red-500'}>• {ata.contrato.status}</span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                    <div className={`h-2.5 rounded-full ${ata.contrato.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${calcularProgressoTempo(ata.contrato.vigencia_inicio, ata.contrato.vigencia_fim)}%` }}></div>
                                                                </div>
                                                                <div className="text-[10px] text-right font-bold text-gray-500 mt-1">
                                                                    Fim: {new Date(ata.contrato.vigencia_fim).toLocaleDateString('pt-BR')}
                                                                </div>
                                                            </div>

                                                            <div className="md:col-span-3 flex flex-col items-end border-l border-gray-100 pl-4">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Valor Contratado</span>
                                                                <span className="text-sm font-black text-gray-700">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ata.contrato.valor_global)}</span>
                                                                <div className="flex justify-between w-full mt-1">
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Saldo:</span>
                                                                    <span className="text-[11px] font-bold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ata.contrato.valor_global)}</span>
                                                                </div>
                                                            </div>

                                                            <div className="md:col-span-1 flex justify-end gap-1.5">
    {/* IMPRIMIR */}
    <a 
        href={route('contratos.lista.print', ata.contrato.id)} 
        target="_blank"
        className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        title="Imprimir Ficha"
    >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
    </a>

    {/* EDITAR */}
    <Link 
        href={route('contratos.lista.edit', ata.contrato.id)} 
        className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
        title="Editar Contrato"
    >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
    </Link>

    {/* EXCLUIR */}
    <button 
        onClick={() => { if(confirm('Deseja realmente excluir este contrato?')) router.delete(route('contratos.lista.destroy', ata.contrato.id)) }}
        className="p-1.5 border border-gray-200 rounded text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Excluir"
    >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
    </button>
</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}