import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, contratos }) {
    // 🧠 ESTADOS DOS FILTROS
    const [busca, setBusca] = useState('');
    const [ano, setAno] = useState('');
    const [modalidade, setModalidade] = useState('');

    // 🧠 EXTRAÇÃO DE DADOS ÚNICOS PARA OS DROPDOWNS
    // Puxa todos os anos e modalidades disponíveis nos contratos cadastrados
    const anosDisponiveis = [...new Set(contratos?.map(c => c.ata?.processo?.ano).filter(Boolean))].sort((a, b) => b - a);
    const modalidadesDisponiveis = [...new Set(contratos?.map(c => c.ata?.processo?.modalidade).filter(Boolean))].sort();

    // 🧠 FILTRO EM TEMPO REAL
    const contratosFiltrados = useMemo(() => {
        return contratos?.filter((c) => {
            const termo = busca.toLowerCase();
            const matchBusca = !busca || 
                c.numero_contrato?.toLowerCase().includes(termo) ||
                c.fornecedor?.razao_social?.toLowerCase().includes(termo) ||
                c.ata?.processo?.numero_processo?.toLowerCase().includes(termo) ||
                c.ata?.processo?.objeto?.toLowerCase().includes(termo);
            
            const matchAno = !ano || c.ata?.processo?.ano?.toString() === ano.toString();
            const matchModalidade = !modalidade || c.ata?.processo?.modalidade === modalidade;

            return matchBusca && matchAno && matchModalidade;
        });
    }, [contratos, busca, ano, modalidade]);

    // 🧠 CÁLCULO DOS INDICADORES (KPIs)
    const totalContratos = contratos?.length || 0;
    const contratosAtivos = contratos?.filter(c => c.status === 'Ativo').length || 0;
    const contratosVencidos = contratos?.filter(c => c.status === 'Vencido').length || 0;
    const contratosSuspensos = contratos?.filter(c => c.status === 'Suspenso' || c.status === 'Rescindido').length || 0;

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Gestão de Contratos</h2>}>
            <Head title="Contratos" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* CABEÇALHO SUPERIOR */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Visualização de Contratos</h3>
                        <p className="text-sm text-gray-500 mt-1">Acompanhe os indicadores e filtre os contratos firmados.</p>
                    </div>
                    <Link href={route('contratos.lista.create')} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2.5 px-6 rounded shadow flex items-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Novo Contrato
                    </Link>
                </div>

                {/* PAINEL DE INDICADORES (CARDS) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Card: Total */}
                    <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-purple-500 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase">Total de Contratos</p>
                            <h3 className="text-3xl font-black text-gray-800 mt-1">{totalContratos}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full text-purple-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                    </div>
                    {/* Card: Ativos */}
                    <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-[#00a65a] flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase">Em Andamento (Ativos)</p>
                            <h3 className="text-3xl font-black text-[#00a65a] mt-1">{contratosAtivos}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-full text-[#00a65a]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                    </div>
                    {/* Card: Vencidos */}
                    <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-red-500 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase">Vencidos</p>
                            <h3 className="text-3xl font-black text-red-500 mt-1">{contratosVencidos}</h3>
                        </div>
                        <div className="p-3 bg-red-50 rounded-full text-red-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                    {/* Card: Suspensos/Rescindidos */}
                    <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-gray-400 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase">Suspensos / Rescindidos</p>
                            <h3 className="text-3xl font-black text-gray-600 mt-1">{contratosSuspensos}</h3>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>
                </div>

                {/* BARRA DE FILTROS AVANÇADOS */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ano do Processo</label>
                        <select value={ano} onChange={e => setAno(e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] text-sm font-medium">
                            <option value="">Todos os Anos</option>
                            {anosDisponiveis.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Modalidade</label>
                        <select value={modalidade} onChange={e => setModalidade(e.target.value)} className="w-full border-gray-300 rounded focus:ring-[#3c8dbc] text-sm font-medium">
                            <option value="">Todas as Modalidades</option>
                            {modalidadesDisponiveis.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pesquisa Livre</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" value={busca} onChange={e => setBusca(e.target.value)} className="w-full pl-9 border-gray-300 rounded focus:ring-[#3c8dbc] text-sm" placeholder="Fornecedor, objeto, nº..." />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button onClick={() => { setBusca(''); setAno(''); setModalidade(''); }} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded transition-colors text-sm border border-gray-200">
                            LIMPAR FILTROS
                        </button>
                    </div>
                </div>

                {/* TABELA DE DADOS (FUNCIONAL E ROBUSTA) */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    {contratosFiltrados?.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 font-medium">Nenhum contrato encontrado com estes filtros.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nº Contrato / Processo</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fornecedor</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vigência Fim</th>
                                    <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Valor Global</th>
                                    <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contratosFiltrados?.map((c) => (
                                    <tr key={c.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-[#3c8dbc] text-base">{c.numero_contrato}</div>
                                            <div className="text-xs text-gray-500 font-medium mt-0.5">Proc: {c.ata?.processo?.numero_processo || 'N/D'} • {c.ata?.processo?.modalidade}</div>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-700">{c.fornecedor?.razao_social || 'N/D'}</td>
                                        <td className="p-4 text-sm font-medium text-gray-800">
                                            {new Date(c.vigencia_fim).toLocaleDateString('pt-BR')}
                                            <span className={`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                                                c.status === 'Ativo' ? 'bg-green-100 text-green-700 border border-green-200' : 
                                                c.status === 'Vencido' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                                'bg-gray-100 text-gray-700 border border-gray-200'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-black text-gray-800 text-base">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.valor_global)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={route('contratos.aditivos.index', c.id)} className="inline-block px-3 py-1.5 bg-white text-[#3c8dbc] hover:bg-blue-50 font-bold text-xs rounded border border-[#3c8dbc] mr-3 transition-colors shadow-sm">
                                                Aditivos {c.aditivos?.length > 0 && `(${c.aditivos.length})`}
                                            </Link>
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