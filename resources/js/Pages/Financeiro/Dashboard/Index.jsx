import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, saldoTotal, aPagar, aReceber, mesAtual }) {
    
    // Função para formatar o dinheiro para o padrão Brasileiro (R$)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Visão Geral Financeira</h2>}
        >
            <Head title="Dashboard Financeiro" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Cabeçalho do Dashboard */}
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Resumo de <span className="capitalize text-blue-600">{mesAtual}</span>
                        </h3>
                    </div>

                    {/* Grid de Cartões */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        
                        {/* Cartão 1: Saldo Total */}
                        <div className="bg-white rounded-xl shadow-sm border-l-4 border-blue-500 p-6 flex flex-col justify-between hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Saldo Total (Contas)</p>
                                    <h4 className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(saldoTotal)}</h4>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-500 text-xl">🏦</div>
                            </div>
                            <Link href="/financeiro/contas" className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 inline-block">
                                Ver Contas Bancárias →
                            </Link>
                        </div>

                        {/* Cartão 2: A Receber */}
                        <div className="bg-white rounded-xl shadow-sm border-l-4 border-green-500 p-6 flex flex-col justify-between hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">A Receber (Este Mês)</p>
                                    <h4 className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(aReceber)}</h4>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg text-green-500 text-xl">📈</div>
                            </div>
                            <Link href="/financeiro/lancamentos" className="text-sm text-green-600 hover:text-green-800 font-medium mt-4 inline-block">
                                Ver Receitas →
                            </Link>
                        </div>

                        {/* Cartão 3: A Pagar */}
                        <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-6 flex flex-col justify-between hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">A Pagar (Este Mês)</p>
                                    <h4 className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(aPagar)}</h4>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg text-red-500 text-xl">📉</div>
                            </div>
                            <Link href="/financeiro/lancamentos" className="text-sm text-red-600 hover:text-red-800 font-medium mt-4 inline-block">
                                Ver Despesas →
                            </Link>
                        </div>

                    </div>

                    {/* Aqui futuramente poderemos adicionar um gráfico de barras! */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center text-gray-400 py-12">
                        Gráficos de fluxo de caixa virão aqui na próxima versão! 📊
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}