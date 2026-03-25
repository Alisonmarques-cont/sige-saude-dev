import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bem-vindo ao Sige Saúde" />
            
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-[#3c8dbc] selection:text-white">
                
                {/* CABEÇALHO */}
                <header className="bg-white shadow-sm border-b border-gray-100 py-4 px-6 sm:px-12 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        {/* Logo Símbolo (Cruz Médica + Gráfico) */}
                        <div className="w-10 h-10 bg-[#3c8dbc] rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">
                            Sige <span className="text-[#3c8dbc]">Saúde</span>
                        </h1>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('financeiro.dashboard')} className="text-sm font-bold text-gray-600 hover:text-[#3c8dbc] transition-colors">
                                Ir para o Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-bold text-gray-600 hover:text-[#3c8dbc] transition-colors px-4 py-2">
                                    Acessar
                                </Link>
                                <Link href={route('register')} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-md transition-all hover:shadow-lg">
                                    Criar Conta
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* CORPO / HERO SECTION */}
                <main className="flex-grow flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                    {/* Elementos decorativos de fundo */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-blue-100 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
                    <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-green-100 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>

                    <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
                        
                        {/* Texto Principal */}
                        <div className="flex flex-col gap-6">
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-[#3c8dbc] text-xs font-bold tracking-widest uppercase w-max shadow-sm">
                                Gestão Pública Inteligente
                            </span>
                            
                            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                                O controle financeiro do Fundo de Saúde nas suas mãos.
                            </h2>
                            
                            <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                Uma plataforma moderna, segura e desenhada especificamente para simplificar a gestão de empenhos, pagamentos e planificação do FMS.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 mt-4">
                                {auth.user ? (
                                    <Link href={route('financeiro.dashboard')} className="bg-[#00a65a] hover:bg-[#008d4c] text-white text-base font-bold py-3.5 px-8 rounded-lg shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                                        Entrar no Sistema
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white text-base font-bold py-3.5 px-8 rounded-lg shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2">
                                            Fazer Login
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                                        </Link>
                                        <Link href={route('register')} className="bg-white border-2 border-gray-200 text-gray-700 hover:border-[#3c8dbc] hover:text-[#3c8dbc] text-base font-bold py-3.5 px-8 rounded-lg shadow-sm transition-all flex items-center gap-2">
                                            Cadastre-se
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Imagem / Ilustração (Mockup do sistema) */}
                        <div className="hidden md:flex justify-end relative">
                            <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-4 border-b pb-3">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-24 bg-gray-50 rounded-lg border border-gray-100 p-4 flex flex-col justify-center">
                                        <div className="h-3 w-1/3 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-6 w-1/2 bg-green-500 rounded"></div>
                                    </div>
                                    <div className="h-12 bg-gray-50 rounded-lg border border-gray-100"></div>
                                    <div className="h-12 bg-gray-50 rounded-lg border border-gray-100"></div>
                                    <div className="h-12 bg-gray-50 rounded-lg border border-gray-100"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>

                {/* RODAPÉ */}
                <footer className="text-center py-6 text-sm text-gray-500 font-medium z-10">
                    &copy; {new Date().getFullYear()} Sige Saúde. Desenvolvido para a Gestão Pública.
                </footer>
            </div>
        </>
    );
}