import { apiFetch } from '../../core/api.js';

/**
 * Carrega os combos de Programas, Contas, Fornecedores e Contratos nos selects das modais.
 * @param {boolean} apenasBasico - Se true, carrega apenas Programas e Contas (usado em Receitas/Lançamentos).
 */
export async function carregarCombosEmpenho(apenasBasico = false) {
    // Busca dados em paralelo para agilizar
    const [progs, contas] = await Promise.all([
        apiFetch('/config/programas/listar'),
        apiFetch('/config/contas/listar')
    ]);
    
    // HTML Options
    const htmlP = progs ? progs.map(p => `<option value="${p.id}">${p.nome_programa}</option>`).join('') : '';
    
    const htmlC = contas ? contas.map(c => {
        let texto = '';
        if (c.conta) { texto = `${c.conta} (${c.banco})`; } else { texto = `${c.banco} - ${c.descricao || ''}`; }
        return `<option value="${c.id}">${texto}</option>`;
    }).join('') : '';
    
    // --- Preenche Selects da Interface ---

    // Selects de Programa
    const elsPrograma = ['emp_programa', 'rec_programa', 'lanc_programa'];
    elsPrograma.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerHTML = htmlP || '<option value="">Nenhum programa</option>';
    });

    // Selects de Conta Bancária
    const elsConta = ['emp_conta_bancaria', 'rec_conta'];
    elsConta.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerHTML = htmlC;
    });
    
    // --- Filtros ---
    const fProg = document.getElementById('filtro_emp_programa'); 
    if(fProg && fProg.options.length <= 1) fProg.innerHTML = '<option value="todos">Todos os Programas</option>' + htmlP;

    const fConta = document.getElementById('filtro_lanc_conta');
    if(fConta) fConta.innerHTML = '<option value="">Selecione uma conta...</option>' + htmlC;
    
    const fContaLivro = document.getElementById('filtro_livro_conta');
    if(fContaLivro) fContaLivro.innerHTML = '<option value="">Todas</option>' + htmlC;

    const fLancProg = document.getElementById('filtro_lanc_programa');
    if(fLancProg) fLancProg.innerHTML = '<option value="">Todos</option>' + htmlP;

    // Se for apenas básico (Receitas/Manual), para por aqui
    if (apenasBasico) return;

    // --- Carregamento Pesado (Fornecedores e Contratos) ---
    // Apenas para Empenhos
    const fornecedores = await apiFetch('/config/fornecedores/listar');
    const htmlF = fornecedores ? `<option value="">Selecione...</option>` + fornecedores.map(f => `<option value="${f.id}">${f.razao_social}</option>`).join('') : '<option>Sem fornecedores</option>';
    if(document.getElementById('emp_fornecedor_select')) document.getElementById('emp_fornecedor_select').innerHTML = htmlF;

    const contratos = await apiFetch('/financeiro/contratos/ativos');
    const htmlCont = contratos ? `<option value="">Selecione...</option>` + contratos.map(c => `<option value="${c.id}">CT ${c.numero_contrato} - ${c.fornecedor}</option>`).join('') : '<option>Nenhum ativo</option>';
    if(document.getElementById('emp_contrato')) document.getElementById('emp_contrato').innerHTML = htmlCont;
}