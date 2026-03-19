import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { url, props } = usePage();
    const user = props.auth?.user || { name: 'ALISON MARQUES' };

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    // Controles para os menus colapsáveis (Acordeão)
    const [openMenus, setOpenMenus] = useState({
        financeiro: url.includes('/financeiro') && !url.includes('dashboard'), 
        cadastros: url.includes('/cadastros'),
        planejamento: url.includes('/planejamento'),
        contratos: url.includes('/contratos'),
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    // A MÁGICA AQUI: Usamos a rota atual em vez da URL digitada
    const isActive = (routeName) => route().current(routeName);

    // Ícones SVG Discretos
    const Icons = {
        dashboard: <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
        cadastros: <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
        financeiro: <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
        planejamento: <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>,
        contratos: <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
        relatorios: <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>,
        config: <svg className="w-5 h-5 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
    };

    const Chevron = ({ isOpen }) => (
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            
            {/* SIDEBAR */}
            <aside className="w-[260px] bg-[#222d32] text-[#b8c7ce] flex-shrink-0 hidden md:flex flex-col z-20">
                
                <Link 
                    href={route('financeiro.dashboard')} 
                    className="h-16 flex items-center justify-center gap-2 bg-[#367fa9] hover:bg-[#357ca5] text-white font-bold text-xl tracking-wider flex-shrink-0 transition-colors"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z" />
                    </svg>
                    SIGE SAÚDE
                </Link>

                <div className="p-4 flex-shrink-0">
                    <div className="relative">
                        <input type="text" placeholder="Pesquisar..." className="w-full bg-[#374850] border-none rounded text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 pr-10 py-2" />
                        <button className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-white">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto flex flex-col mt-2">
                    {/* Dashboard */}
                    <Link href={route('financeiro.dashboard')} className={`flex items-center gap-3 px-4 py-3 border-l-4 transition-colors ${isActive('financeiro.dashboard') ? 'bg-[#1e282c] text-white border-[#3c8dbc]' : 'border-transparent hover:bg-[#1e282c] hover:text-white text-[#b8c7ce]'}`}>
                        {Icons.dashboard}
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>

                    {/* Cadastros */}
                    <div>
                        <button onClick={() => toggleMenu('cadastros')} className="w-full flex items-center justify-between px-4 py-3 border-l-4 border-transparent hover:bg-[#1e282c] hover:text-white text-[#b8c7ce] transition-colors text-left">
                            <div className="flex items-center gap-3">{Icons.cadastros}<span className="text-sm font-medium">Cadastros</span></div>
                            <Chevron isOpen={openMenus.cadastros} />
                        </button>
                        {openMenus.cadastros && (
                            <div className="bg-[#2c3b41] py-1">
                                <Link href="#" className="block pl-[3.25rem] pr-4 py-2.5 text-sm text-[#8aa4af] hover:text-white transition-colors">Pacientes</Link>
                                <Link href="#" className="block pl-[3.25rem] pr-4 py-2.5 text-sm text-[#8aa4af] hover:text-white transition-colors">Profissionais</Link>
                            </div>
                        )}
                    </div>

                    {/* Financeiro */}
                    <div>
                        <button onClick={() => toggleMenu('financeiro')} className={`w-full flex items-center justify-between px-4 py-3 border-l-4 transition-colors text-left ${url.includes('/financeiro') && !isActive('financeiro.dashboard') ? 'border-[#3c8dbc] text-white bg-[#1e282c]' : 'border-transparent hover:bg-[#1e282c] hover:text-white text-[#b8c7ce]'}`}>
                            <div className="flex items-center gap-3">{Icons.financeiro}<span className="text-sm font-medium">Financeiro</span></div>
                            <Chevron isOpen={openMenus.financeiro} />
                        </button>
                        {openMenus.financeiro && (
                            <div className="bg-[#2c3b41] py-1">
                                <Link href={route('financeiro.lancamentos.index')} className={`block pl-[3.25rem] pr-4 py-2.5 text-sm transition-colors ${isActive('financeiro.lancamentos.index') ? 'text-white' : 'text-[#8aa4af] hover:text-white'}`}>
                                    Lançamentos
                                </Link>
                                <Link href={route('financeiro.contas.index')} className={`block pl-[3.25rem] pr-4 py-2.5 text-sm transition-colors ${isActive('financeiro.contas.index') ? 'text-white' : 'text-[#8aa4af] hover:text-white'}`}>
                                    Contas Bancárias
                                </Link>
                                <Link href={route('financeiro.fornecedores.index')} className={`block pl-[3.25rem] pr-4 py-2.5 text-sm transition-colors ${isActive('financeiro.fornecedores.index') ? 'text-white' : 'text-[#8aa4af] hover:text-white'}`}>
                                    Fornecedores
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Planejamento */}
                    <div>
                        <button onClick={() => toggleMenu('planejamento')} className="w-full flex items-center justify-between px-4 py-3 border-l-4 border-transparent hover:bg-[#1e282c] hover:text-white text-[#b8c7ce] transition-colors text-left">
                            <div className="flex items-center gap-3">{Icons.planejamento}<span className="text-sm font-medium">Planejamento</span></div>
                            <Chevron isOpen={openMenus.planejamento} />
                        </button>
                    </div>

                    {/* Contratos */}
                    <div>
                        <button onClick={() => toggleMenu('contratos')} className="w-full flex items-center justify-between px-4 py-3 border-l-4 border-transparent hover:bg-[#1e282c] hover:text-white text-[#b8c7ce] transition-colors text-left">
                            <div className="flex items-center gap-3">{Icons.contratos}<span className="text-sm font-medium">Contratos</span></div>
                            <Chevron isOpen={openMenus.contratos} />
                        </button>
                    </div>

                    <Link href="#" className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent hover:bg-[#1e282c] hover:text-white text-[#b8c7ce] transition-colors">
                        {Icons.relatorios}
                        <span className="text-sm font-medium">Relatórios</span>
                    </Link>
                    
                    <div className="flex-grow"></div>
                </nav>

                {/* BOTÃO FIXO DE CONFIGURAÇÕES */}
                <Link 
                    href={route('configuracoes.entidade')} 
                    className={`flex-shrink-0 flex items-center gap-3 px-4 py-4 border-t border-gray-700 transition-colors bg-[#1a2226] ${isActive('configuracoes.entidade') ? 'text-white bg-[#1e282c]' : 'text-[#b8c7ce] hover:text-white hover:bg-[#1e282c]'}`}
                >
                    {Icons.config}
                    <span className="text-sm font-medium">Configurações</span>
                </Link>

            </aside>

            {/* ÁREA DE CONTEÚDO PRINCIPAL */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* TOPBAR */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
                    
                    <div className="flex items-center">
                        <button onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-4">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div className="hidden md:block">{header}</div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
                            <div className="hidden md:flex flex-col text-right">
                                <span className="text-sm font-bold text-gray-700 leading-none">{user.name}</span>
                                <span className="text-xs text-green-500 font-medium mt-1 flex items-center justify-end gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</span>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-[#3c8dbc] flex items-center justify-center text-white overflow-hidden shadow-sm">
                                <span className="font-bold text-sm uppercase">{user.name.charAt(0)}</span>
                            </div>
                        </div>
                        
                        <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-gray-500 hover:text-red-500 transition flex items-center gap-2">
                            <span className="hidden sm:block">Sair</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </Link>
                    </div>
                </header>

                {/* MENU MOBILE */}
                {showingNavigationDropdown && (
                    <div className="md:hidden bg-[#222d32] absolute top-16 inset-x-0 z-20 shadow-xl border-t border-gray-700 overflow-y-auto max-h-[calc(100vh-4rem)]">
                        <nav className="flex flex-col py-2">
                            <Link href={route('financeiro.dashboard')} className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800">Dashboard</Link>
                            <Link href={route('financeiro.lancamentos.index')} className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800">Lançamentos</Link>
                            <Link href={route('financeiro.contas.index')} className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800">Contas</Link>
                            <Link href={route('financeiro.fornecedores.index')} className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800">Fornecedores</Link>
                            <Link href={route('configuracoes.entidade')} className="px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800">Configurações</Link>
                        </nav>
                    </div>
                )}

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="md:hidden p-4 bg-white shadow-sm border-b">{header}</div>
                    {children} 
                </main>
                
            </div>
        </div>
    );
}