// public/assets/js/modules/financeiro/index.js

// 1. Imports dos Sub-módulos
import { carregarTabelaEmpenhos, salvarEmpenho, excluirEmpenho, editarEmpenho, abrirModalEmpenho, alternarAbaEmpenho, toggleOrigemEmp, abrirModalPagamento, confirmarPagamento, imprimirNota } from './empenhos.js';
import { carregarReceitas, salvarReceita, excluirReceita, editarReceita, abrirModalReceita } from './receitas.js';
import { carregarDadosExtrato, carregarDadosAcompanhamento, abrirModalLancamento, salvarLancamento } from './extrato.js';
import { carregarLivroDiario, imprimirLivroDiario } from './livro-diario.js';
import { carregarContasFornecedores } from './fornecedores.js';
import { carregarCombosEmpenho } from './utils.js';

// =============================================================================
// RE-EXPORTAÇÕES (CORREÇÃO DO ERRO)
// O main.js precisa importar isso, então precisamos exportar aqui.
// =============================================================================
export { 
    carregarDadosExtrato, 
    carregarContasFornecedores, 
    carregarLivroDiario 
};

// 2. Lógica de Inicialização (Fachada) - Já estava exportada, mantemos.
export function initFinanceiro() {
    // Carrega combos iniciais e o Livro Diário (que é uma seção fixa agora)
    carregarCombosEmpenho().then(() => {
        mudarVisaoMov('despesas');
        carregarLivroDiario();
    });
}

// 3. Controle de Abas Internas (Despesas vs Receitas) - Já estava exportada.
export function mudarVisaoMov(tipo) {
    const btnD = document.getElementById('btn_view_despesas');
    const btnR = document.getElementById('btn_view_receitas');
    const mainBtn = document.getElementById('btn_novo_movimento');

    document.getElementById('wrapper_despesas')?.classList.add('hidden');
    document.getElementById('wrapper_receitas')?.classList.add('hidden');
    
    if(btnD) btnD.classList.remove('active');
    if(btnR) btnR.classList.remove('active');

    if(tipo === 'despesas') {
        if(btnD) btnD.classList.add('active');
        document.getElementById('wrapper_despesas')?.classList.remove('hidden');
        
        if(mainBtn) {
            mainBtn.innerHTML = '<i class="ph ph-plus"></i> Novo Lançamento';
            mainBtn.setAttribute('onclick', 'abrirModalEmpenho()');
        }
        carregarTabelaEmpenhos();

    } else if (tipo === 'receitas') {
        if(btnR) btnR.classList.add('active');
        document.getElementById('wrapper_receitas')?.classList.remove('hidden');
        
        if(mainBtn) {
            mainBtn.innerHTML = '<i class="ph ph-plus"></i> Nova Receita';
            mainBtn.setAttribute('onclick', 'abrirModalReceita()');
        }
        carregarReceitas();
    }
}

// 4. EXPORTAÇÃO GLOBAL (Para compatibilidade com onclick="" no HTML)
window.initFinanceiro = initFinanceiro;
window.mudarVisaoMov = mudarVisaoMov;

// Empenhos
window.carregarTabelaEmpenhos = carregarTabelaEmpenhos;
window.salvarEmpenho = salvarEmpenho;
window.excluirEmpenho = excluirEmpenho;
window.editarEmpenho = editarEmpenho;
window.abrirModalEmpenho = abrirModalEmpenho;
window.alternarAbaEmpenho = alternarAbaEmpenho;
window.toggleOrigemEmp = toggleOrigemEmp;
window.abrirModalPagamento = abrirModalPagamento;
window.confirmarPagamento = confirmarPagamento;
window.imprimirNota = imprimirNota;
window.carregarCombosEmpenho = carregarCombosEmpenho;

// Receitas
window.carregarReceitas = carregarReceitas;
window.salvarReceita = salvarReceita;
window.excluirReceita = excluirReceita;
window.editarReceita = editarReceita;
window.abrirModalReceita = abrirModalReceita;

// Extrato
window.carregarDadosExtrato = carregarDadosExtrato;
window.carregarDadosAcompanhamento = carregarDadosAcompanhamento;
window.abrirModalLancamento = abrirModalLancamento;
window.salvarLancamento = salvarLancamento;

// Livro Diário
window.carregarLivroDiario = carregarLivroDiario;
window.imprimirLivroDiario = imprimirLivroDiario;

// Fornecedores
window.carregarContasFornecedores = carregarContasFornecedores;