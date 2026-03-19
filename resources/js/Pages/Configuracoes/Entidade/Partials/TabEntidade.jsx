import React from 'react';
import { useForm } from '@inertiajs/react';

export default function TabEntidade({ entidade }) {
    const { data, setData, post, processing, errors } = useForm({
        nome_fundo: entidade.nome_fundo || '',
        cnpj: entidade.cnpj || '',
        gestor_nome: entidade.gestor_nome || '',
        gestor_cpf: entidade.gestor_cpf || '',
        cep: entidade.cep || '',
        endereco: entidade.endereco || '',
        numero: entidade.numero || '',
        bairro: entidade.bairro || '',
        cidade: entidade.cidade || 'Sairé',
        uf: entidade.uf || 'PE',
        telefone: entidade.telefone || '',
        email: entidade.email || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('configuracoes.entidade.store'));
    };

    return (
        <div className="p-8">
            <div className="mb-6 border-b pb-4">
                <h3 className="text-lg font-bold text-gray-700">Informações da Entidade (FMS)</h3>
                <p className="text-sm text-gray-500 uppercase tracking-tight font-medium mt-1">Estes dados serão utilizados no cabeçalho de empenhos, relatórios e instrumentos de gestão.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <h4 className="text-sm font-bold text-[#3c8dbc] uppercase mb-4 border-b pb-2">Identificação</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Fundo de Saúde *</label>
                        <input type="text" value={data.nome_fundo} onChange={e => setData('nome_fundo', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" placeholder="Ex: Fundo Municipal de Saúde de Sairé" />
                        {errors.nome_fundo && <div className="text-red-500 text-xs mt-1 font-bold">{errors.nome_fundo}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ *</label>
                        <input type="text" value={data.cnpj} onChange={e => setData('cnpj', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" placeholder="00.000.000/0001-00" />
                        {errors.cnpj && <div className="text-red-500 text-xs mt-1 font-bold">{errors.cnpj}</div>}
                    </div>
                </div>

                <h4 className="text-sm font-bold text-[#3c8dbc] uppercase mb-4 border-b pb-2">Gestão Autárquica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Secretário(a) / Gestor</label>
                        <input type="text" value={data.gestor_nome} onChange={e => setData('gestor_nome', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Gestor</label>
                        <input type="text" value={data.gestor_cpf} onChange={e => setData('gestor_cpf', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                </div>

                <h4 className="text-sm font-bold text-[#3c8dbc] uppercase mb-4 border-b pb-2">Localização e Contato</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                        <input type="text" value={data.cep} onChange={e => setData('cep', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Rua, Av)</label>
                        <input type="text" value={data.endereco} onChange={e => setData('endereco', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                        <input type="text" value={data.numero} onChange={e => setData('numero', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                        <input type="text" value={data.bairro} onChange={e => setData('bairro', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                        <input type="text" value={data.cidade} onChange={e => setData('cidade', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                        <input type="text" value={data.uf} onChange={e => setData('uf', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input type="text" value={data.telefone} onChange={e => setData('telefone', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full border-gray-300 rounded shadow-sm focus:ring-[#3c8dbc]" />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t mt-6">
                    <button type="submit" disabled={processing} className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white font-bold py-2.5 px-8 rounded shadow-md transition-all active:scale-95">
                        {processing ? 'Gravando...' : 'Salvar Dados da Entidade'}
                    </button>
                </div>
            </form>
        </div>
    );
}