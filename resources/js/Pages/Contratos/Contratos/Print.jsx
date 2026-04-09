import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Print({ contrato }) {
    // Dispara a janela de impressão assim que a página carrega
    useEffect(() => {
        setTimeout(() => window.print(), 500);
    }, []);

    return (
        <div className="p-10 bg-white min-h-screen text-black print:p-0">
            <Head title={`Imprimir Contrato ${contrato.numero_contrato}`} />
            
            <div className="border-2 border-black p-6">
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <h1 className="text-2xl font-bold uppercase">Fundo Municipal de Saúde</h1>
                    <h2 className="text-xl font-bold">Ficha de Acompanhamento de Contrato</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div><strong>Contrato nº:</strong> {contrato.numero_contrato}</div>
                    <div><strong>Processo:</strong> {contrato.ata.processo.numero_processo}</div>
                    <div className="col-span-2"><strong>Fornecedor:</strong> {contrato.fornecedor.razao_social}</div>
                    <div className="col-span-2"><strong>Objeto:</strong> {contrato.ata.processo.objeto}</div>
                </div>

                <table className="w-full border-collapse border border-black mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-2">Vigência Início</th>
                            <th className="border border-black p-2">Vigência Fim</th>
                            <th className="border border-black p-2">Valor Global</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-center">
                            <td className="border border-black p-2">{new Date(contrato.vigencia_inicio).toLocaleDateString('pt-BR')}</td>
                            <td className="border border-black p-2">{new Date(contrato.vigencia_fim).toLocaleDateString('pt-BR')}</td>
                            <td className="border border-black p-2 font-bold">R$ {contrato.valor_global}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Seção de Aditivos */}
                <h3 className="font-bold mb-2">Histórico de Aditivos</h3>
                <table className="w-full border-collapse border border-black">
                    <thead>
                        <tr className="bg-gray-50 text-xs">
                            <th className="border border-black p-1">Nº</th>
                            <th className="border border-black p-1">Tipo</th>
                            <th className="border border-black p-1">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contrato.aditivos.map(a => (
                            <tr key={a.id} className="text-xs">
                                <td className="border border-black p-1">{a.numero_aditivo}</td>
                                <td className="border border-black p-1">{a.tipo}</td>
                                <td className="border border-black p-1">R$ {a.valor_adicionado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button onClick={() => window.print()} className="mt-8 bg-blue-600 text-white px-4 py-2 rounded print:hidden">
                Imprimir Documento
            </button>
        </div>
    );
}