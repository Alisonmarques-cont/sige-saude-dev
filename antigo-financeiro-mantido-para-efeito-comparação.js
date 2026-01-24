// public/assets/js/modules/financeiro.js
import { apiFetch, apiPost, API_BASE } from '../core/api.js';
import { formatarMoeda, formatarData, showToast } from '../core/utils.js';
import { fecharModal } from '../core/ui.js';

// =============================================================================
// INICIALIZAÇÃO E NAVEGAÇÃO
// =============================================================================

export function initFinanceiro() {
    // Carrega combos (programas, contas) e inicia os dados
    carregarCombosEmpenho().then(() => {
        mudarVisaoMov('despesas'); // Inicia na aba padrão de Despesas
        carregarLivroDiario();     // Carrega o livro diário (agora seção fixa)
    });
}

export function mudarVisaoMov(tipo) {
    const btnD = document.getElementById('btn_view_despesas');
    const btnR = document.getElementById('btn_view_receitas');
    const mainBtn = document.getElementById('btn_novo_movimento');

    // Esconde as áreas controladas por abas (Despesas/Receitas)
    document.getElementById('wrapper_despesas').classList.add('hidden');
    document.getElementById('wrapper_receitas').classList.add('hidden');
    
    // Reseta botões
    if(btnD) btnD.classList.remove('active');
    if(btnR) btnR.classList.remove('active');

    // Ativa a visão selecionada
    if(tipo === 'despesas') {
        if(btnD) btnD.classList.add('active');
        document.getElementById('wrapper_despesas').classList.remove('hidden');
        
        if(mainBtn) {
            mainBtn.innerHTML = '<i class="ph ph-plus"></i> Novo Lançamento';
            mainBtn.setAttribute('onclick', 'abrirModalEmpenho()');
        }
        
        carregarTabelaEmpenhos();

    } else if (tipo === 'receitas') {
        if(btnR) btnR.classList.add('active');
        document.getElementById('wrapper_receitas').classList.remove('hidden');
        
        if(mainBtn) {
            mainBtn.innerHTML = '<i class="ph ph-plus"></i> Nova Receita';
            mainBtn.setAttribute('onclick', 'abrirModalReceita()');
        }
        
        carregarReceitas();
    }
}

// =============================================================================
// CARREGAMENTO DE DADOS (LISTAGENS)
// =============================================================================

export async function carregarTabelaEmpenhos() {
    const progId = document.getElementById('filtro_emp_programa')?.value || 'todos';
    const tb = document.getElementById('tabela_empenhos').querySelector('tbody');
    
    if(tb) tb.innerHTML = "<tr><td colspan='6' class='text-center'>Carregando movimentações...</td></tr>";

    const l = await apiFetch('/financeiro/empenhos/listar?programa_id=' + progId);
    
    if(!tb) return;
    tb.innerHTML = "";
    
    if(l && l.length > 0) {
        l.forEach(e => {
            const dados = JSON.stringify(e).replace(/"/g, '&quot;');
            const iconeContrato = e.contrato_id ? '<i class="ph-fill ph-file-text" style="color:var(--accent)" title="Vinculado a Contrato"></i>' : '';
            
            let statusHtml = `<span class="status-badge warning">${e.status}</span>`;
            let btnPagar = '';

            if(e.status === 'Pendente') {
                btnPagar = `<button class="btn-icon-small" style="color:var(--success); border-color:var(--success)" title="Realizar Pagamento" onclick="abrirModalPagamento(${e.id})"><i class="ph-bold ph-check"></i></button>`;
            } else if (e.status === 'Pago') {
                statusHtml = `<span class="status-badge ativo">Pago</span>`;
                btnPagar = `<button class="btn-icon-small" disabled style="opacity:0.3; cursor:default"><i class="ph-bold ph-check"></i></button>`;
            }

            tb.innerHTML += `
            <tr>
                <td>${formatarData(e.data_vencimento)}</td>
                <td>
                    ${iconeContrato} ${e.credor}
                    <div style="font-size:0.75rem; color:var(--text-muted)">${e.nome_programa}</div>
                </td>
                <td>${e.descricao}</td>
                <td style="font-weight:bold">${formatarMoeda(e.valor_total)}</td>
                <td>${statusHtml}</td>
                <td style="display:flex; gap:5px;">
                    ${btnPagar}
                    <button class="btn-icon-small" title="Imprimir" onclick="imprimirNota(${e.id})"><i class="ph ph-printer"></i></button>
                    <button class="btn-icon-small" title="Editar" onclick="editarEmpenho(${dados})"><i class="ph ph-pencil"></i></button>
                    <button class="btn-icon-small" style="color:var(--danger); border-color:var(--danger)" title="Excluir" onclick="excluirEmpenho(${e.id})"><i class="ph ph-trash"></i></button>
                </td>
            </tr>`;
        });
    } else {
        tb.innerHTML = "<tr><td colspan='6' class='text-center text-muted'>Nenhuma despesa encontrada.</td></tr>";
    }
}

export async function carregarReceitas() {
    const progId = document.getElementById('filtro_emp_programa')?.value || 'todos';
    const l = await apiFetch('/financeiro/receitas/listar?programa_id=' + progId);
    const tb = document.getElementById('tabela_receitas').querySelector('tbody');
    if(!tb) return;

    tb.innerHTML = "";
    if(l && l.length > 0) {
        l.forEach(r => {
            const dados = JSON.stringify(r).replace(/"/g, '&quot;');
            tb.innerHTML += `
            <tr>
                <td>${formatarData(r.data_registro)}</td>
                <td>${r.nome_programa}</td>
                <td>${r.conta_nome||'-'}</td>
                <td>${r.descricao}</td>
                <td style="color:var(--success); font-weight:bold">${formatarMoeda(r.valor)}</td>
                <td style="display:flex; gap:5px;">
                    <button class="btn-icon-small" title="Editar" onclick="editarReceita(${dados})"><i class="ph ph-pencil"></i></button>
                    <button class="btn-icon-small" style="color:var(--danger); border-color:var(--danger)" title="Excluir" onclick="excluirReceita(${r.id})"><i class="ph ph-trash"></i></button>
                </td>
            </tr>`;
        });
    } else {
        tb.innerHTML = "<tr><td colspan='6' class='text-center text-muted'>Nenhuma receita encontrada.</td></tr>";
    }
}

// === LIVRO DIÁRIO (NOVA FUNCIONALIDADE) ===
export async function carregarLivroDiario() {
    const tb = document.getElementById('tabela_livro_corpo');
    if(!tb) return;
    tb.innerHTML = "<tr><td colspan='6' class='text-center'>Carregando dados unificados...</td></tr>";
    
    const contaId = document.getElementById('filtro_livro_conta')?.value || '';
    const dataIni = document.getElementById('filtro_livro_inicio')?.value || '';
    const dataFim = document.getElementById('filtro_livro_fim')?.value || '';

    const params = new URLSearchParams({
        conta_id: contaId,
        data_inicio: dataIni,
        data_fim: dataFim
    });

    // Chama a API que une Realizado + Pendente
    const l = await apiFetch('/financeiro/livro-diario/listar?' + params.toString()); 
    tb.innerHTML = "";
    
    if(l && l.length > 0) {
        l.forEach(x => {
            const cor = x.tipo_movimento === 'Receita' ? 'var(--success)' : 'var(--danger)';
            const sinal = x.tipo_movimento === 'Receita' ? '+' : '-';
            
            // Diferenciação visual para itens previstos (Pendentes)
            const styleRow = x.status_item === 'Pendente' ? 'color:var(--text-muted); font-style:italic;' : '';
            const statusBadge = x.status_item === 'Pendente' 
                ? `<span class="status-badge warning">Previsto</span>` 
                : `<span class="status-badge success">Realizado</span>`;

            tb.innerHTML += `
            <tr style="${styleRow}">
                <td>${formatarData(x.data_movimento)}</td>
                <td>${x.tipo_movimento}</td>
                <td>${x.descricao}</td>
                <td style="color:${cor}; font-weight:700">${sinal} ${formatarMoeda(x.valor)}</td>
                <td><b>${formatarMoeda(x.saldo_acumulado)}</b></td>
                <td>${statusBadge}</td>
            </tr>`;
        });
    } else {
        tb.innerHTML = "<tr><td colspan='6' class='text-center text-muted'>Nenhum registro encontrado no período.</td></tr>";
    }
}

export function imprimirLivroDiario() {
    const contaId = document.getElementById('filtro_livro_conta')?.value || '';
    const dataIni = document.getElementById('filtro_livro_inicio')?.value || '';
    const dataFim = document.getElementById('filtro_livro_fim')?.value || '';
    
    const params = new URLSearchParams({
        tipo: 'livro_diario',
        conta_id: contaId,
        data_inicio: dataIni,
        data_fim: dataFim
    });

    const baseUrl = API_BASE.replace('/api', ''); 
    window.open(baseUrl + '/financeiro/relatorio/imprimir?' + params.toString(), '_blank');
}

// =============================================================================
// MODAIS DE EMPENHO (COM ABAS E NOVOS CAMPOS)
// =============================================================================

export function alternarAbaEmpenho(abaId, btn) {
    const conteudos = document.querySelectorAll('#modal_empenho_overlay .modal-tab-content');
    conteudos.forEach(el => el.style.display = 'none');
    
    // Se o botão não for passado, tenta identificar pelo índice
    if (!btn) {
        const map = {'aba_emp_cadastral': 0, 'aba_emp_orcamentaria': 1, 'aba_emp_financeira': 2};
        const index = map[abaId];
        const allBtns = document.querySelectorAll('#modal_empenho_overlay .tab-link');
        if (allBtns[index]) btn = allBtns[index];
    }

    const btns = document.querySelectorAll('#modal_empenho_overlay .tab-link');
    btns.forEach(b => b.classList.remove('active'));

    const alvo = document.getElementById(abaId);
    if(alvo) alvo.style.display = 'block';
    
    if(btn) btn.classList.add('active');
}

export async function abrirModalEmpenho() {
    document.getElementById('emp_id').value = ""; 
    
    // Limpa campos (Incluindo os novos: Protocolo, Data, NF)
    ['emp_valor','emp_descricao', 'emp_protocolo', 'emp_data_protocolo', 'emp_nota_fiscal', 'emp_elemento'].forEach(i => {
        const el = document.getElementById(i);
        if(el) el.value = "";
    });
    
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('emp_data_emissao').value = hoje;
    document.getElementById('emp_data_vencimento').value = hoje;
    document.getElementById('emp_data_protocolo').value = hoje;
    
    document.getElementById('emp_origem').value = 'Direta';
    
    await carregarCombosEmpenho();
    toggleOrigemEmp();
    
    // --- BUSCA PRÓXIMO PROTOCOLO ---
    try {
        const res = await apiFetch('/financeiro/empenhos/proximo-protocolo');
        if (res && res.protocolo) {
            document.getElementById('emp_protocolo').value = res.protocolo;
        }
    } catch (e) {
        console.error("Erro ao gerar protocolo:", e);
    }
    
    // Inicia na primeira aba
    alternarAbaEmpenho('aba_emp_cadastral');
    
    document.getElementById('modal_empenho_overlay').classList.add('show');
}

export async function editarEmpenho(dados) {
    await carregarCombosEmpenho();
    
    // --- ABA 1: CADASTRAL ---
    document.getElementById('emp_id').value = dados.id;
    
    // Preenche campos com verificação
    if(document.getElementById('emp_protocolo')) document.getElementById('emp_protocolo').value = dados.protocolo_entrada || '';
    if(document.getElementById('emp_data_protocolo')) document.getElementById('emp_data_protocolo').value = dados.data_protocolo || '';
    if(document.getElementById('emp_nota_fiscal')) document.getElementById('emp_nota_fiscal').value = dados.nota_fiscal || '';

    document.getElementById('emp_data_emissao').value = dados.data_emissao;
    document.getElementById('emp_descricao').value = dados.descricao;

    // --- ABA 2: ORÇAMENTÁRIA ---
    document.getElementById('emp_programa').value = dados.programa_id;
    document.getElementById('emp_elemento').value = dados.elemento_despesa || '';

    // --- ABA 3: FINANCEIRA ---
    document.getElementById('emp_data_vencimento').value = dados.data_vencimento;
    
    // Formatação de valor segura
    const valFloat = parseFloat(dados.valor_total);
    document.getElementById('emp_valor').value = formatarMoeda(valFloat);
    
    document.getElementById('emp_conta_bancaria').value = dados.conta_bancaria_id;
    
    // Origem (Contrato ou Direta)
    if (dados.contrato_id) {
        document.getElementById('emp_origem').value = 'Contrato';
        document.getElementById('emp_contrato').value = dados.contrato_id;
    } else {
        document.getElementById('emp_origem').value = 'Direta';
        const sel = document.getElementById('emp_fornecedor_select');
        for (let i = 0; i < sel.options.length; i++) {
            if (sel.options[i].text === dados.credor) {
                sel.selectedIndex = i;
                break;
            }
        }
    }
    
    toggleOrigemEmp();
    alternarAbaEmpenho('aba_emp_cadastral');
    document.getElementById('modal_empenho_overlay').classList.add('show');
}

// === SALVAR COM VALIDAÇÃO CORRIGIDA ===
export async function salvarEmpenho() {
    const prog = document.getElementById('emp_programa').value;
    const conta = document.getElementById('emp_conta_bancaria').value;
    const valorStr = document.getElementById('emp_valor').value; 
    const origem = document.getElementById('emp_origem').value;

    // 1. Limpeza para validar valor
    let clean = valorStr ? valorStr.replace(/[^\d,]/g, '') : '';
    clean = clean.replace(',', '.');
    let valorNumerico = parseFloat(clean);

    // 2. Validação
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
        const btn = document.querySelectorAll('#modal_empenho_overlay .tab-link')[2]; // Aba 3
        alternarAbaEmpenho('aba_emp_financeira', btn);
        return alert("O Valor Total deve ser maior que zero.");
    }

    if (!prog) {
        const btn = document.querySelectorAll('#modal_empenho_overlay .tab-link')[1]; // Aba 2
        alternarAbaEmpenho('aba_emp_orcamentaria', btn);
        return alert("Selecione o Programa na aba Orçamentária.");
    }
    if (!conta) {
        const btn = document.querySelectorAll('#modal_empenho_overlay .tab-link')[2]; // Aba 3
        alternarAbaEmpenho('aba_emp_financeira', btn);
        return alert("Selecione a Conta Bancária na aba Financeira.");
    }

    const d = {
        id: document.getElementById('emp_id').value,
        protocolo_entrada: document.getElementById('emp_protocolo').value,
        data_protocolo: document.getElementById('emp_data_protocolo')?.value || null,
        nota_fiscal: document.getElementById('emp_nota_fiscal')?.value || null,
        programa_id: prog,
        data_emissao: document.getElementById('emp_data_emissao').value,
        data_vencimento: document.getElementById('emp_data_vencimento').value,
        valor_total: valorStr, // Envia formatado
        descricao: document.getElementById('emp_descricao').value,
        conta_bancaria_id: conta,
        tipo_origem: origem,
        elemento_despesa: document.getElementById('emp_elemento').value
    };
    
    if(origem === 'Contrato') {
        const contratoId = document.getElementById('emp_contrato').value;
        if(!contratoId) {
            const btn = document.querySelectorAll('#modal_empenho_overlay .tab-link')[0];
            alternarAbaEmpenho('aba_emp_cadastral', btn);
            return alert("Selecione o Contrato vinculado.");
        }
        d.contrato_id = contratoId;
    } else {
        const fornSelect = document.getElementById('emp_fornecedor_select');
        if(!fornSelect.value) {
            const btn = document.querySelectorAll('#modal_empenho_overlay .tab-link')[0];
            alternarAbaEmpenho('aba_emp_cadastral', btn);
            return alert("Selecione o Fornecedor.");
        }
        d.credor = fornSelect.options[fornSelect.selectedIndex].text;
        d.contrato_id = null;
    }

    const r = await apiPost('/financeiro/empenhos/salvar', d);
    if(r.status === 'ok') { 
        showToast("Salvo com sucesso!"); 
        fecharModal('modal_empenho_overlay'); 
        carregarTabelaEmpenhos(); 
    } else {
        alert(r.message || "Erro ao salvar.");
    }
}

// =============================================================================
// RECEITAS
// =============================================================================

export function abrirModalReceita() {
    document.getElementById('rec_id').value = ""; 
    ['rec_valor','rec_desc'].forEach(i => document.getElementById(i).value="");
    document.getElementById('rec_data').value = new Date().toISOString().split('T')[0];
    carregarCombosEmpenho(true); 
    document.getElementById('modal_receita_overlay').classList.add('show');
}

export function editarReceita(dados) {
    carregarCombosEmpenho(true).then(() => {
        document.getElementById('rec_id').value = dados.id;
        document.getElementById('rec_programa').value = dados.programa_id;
        document.getElementById('rec_data').value = dados.data_registro;
        document.getElementById('rec_conta').value = dados.conta_bancaria_id;
        document.getElementById('rec_valor').value = formatarMoeda(dados.valor);
        document.getElementById('rec_desc').value = dados.descricao;
        document.getElementById('modal_receita_overlay').classList.add('show');
    });
}

export async function salvarReceita() {
    const d = {
        id: document.getElementById('rec_id').value,
        programa_id: document.getElementById('rec_programa').value,
        data_registro: document.getElementById('rec_data').value,
        conta_bancaria_id: document.getElementById('rec_conta').value,
        valor: document.getElementById('rec_valor').value,
        descricao: document.getElementById('rec_desc').value
    };
    const r = await apiPost('/financeiro/receitas/salvar', d);
    if(r.status === 'ok') { 
        showToast("Salvo!"); 
        fecharModal('modal_receita_overlay'); 
        carregarReceitas(); 
    } else { alert(r.message); }
}

export async function excluirReceita(id) {
    if(!confirm("Tem certeza que deseja excluir esta receita?")) return;
    const r = await apiPost('/financeiro/receitas/excluir', {id: id});
    if(r.status === 'ok') { 
        showToast("Receita excluída!"); 
        carregarReceitas(); 
    } else alert(r.message);
}

// =============================================================================
// PAGAMENTO E OUTROS MODAIS
// =============================================================================

export function abrirModalPagamento(id) {
    document.getElementById('pgto_empenho_id').value = id;
    document.getElementById('pgto_data').value = new Date().toISOString().split('T')[0];
    document.getElementById('modal_pagamento_overlay').classList.add('show');
}

export async function confirmarPagamento() {
    const id = document.getElementById('pgto_empenho_id').value;
    const data = document.getElementById('pgto_data').value;
    const btn = document.getElementById('btn_confirma_pgto');

    if(!data) return alert("Selecione a data do pagamento.");

    btn.disabled = true;
    btn.innerText = "Processando...";

    const r = await apiPost('/financeiro/empenhos/pagar', { id: id, data_pagamento: data });
    
    btn.disabled = false;
    btn.innerText = "Confirmar Pagamento";

    if(r.status === 'ok') {
        showToast("Pagamento Confirmado!");
        fecharModal('modal_pagamento_overlay');
        carregarTabelaEmpenhos();
    } else {
        alert(r.message || "Erro ao pagar.");
    }
}

export async function excluirEmpenho(id) {
    if(!confirm("Tem certeza que deseja excluir este empenho?")) return;
    const r = await apiPost('/financeiro/empenhos/excluir', {id: id});
    if(r.status === 'ok') { 
        showToast("Excluído com sucesso!"); 
        carregarTabelaEmpenhos(); 
    } else alert(r.message);
}

// =============================================================================
// EXTRATO, FORNECEDORES E UTILITÁRIOS
// =============================================================================

export async function carregarDadosExtrato() { // Usado na aba "Extrato Bancário"
    const tb = document.getElementById('tabela_lancamentos_corpo');
    if(!tb) return;
    tb.innerHTML = "<tr><td colspan='5' class='text-center'>Atualizando extrato...</td></tr>";
    
    const contaId = document.getElementById('filtro_lanc_conta')?.value || '';
    const progId = document.getElementById('filtro_lanc_programa')?.value || '';
    const dataIni = document.getElementById('filtro_lanc_data_inicio')?.value || '';
    const dataFim = document.getElementById('filtro_lanc_data_fim')?.value || '';

    const params = new URLSearchParams({
        conta_id: contaId,
        programa_id: progId,
        data_inicio: dataIni,
        data_fim: dataFim
    });

    const l = await apiFetch('/financeiro/lancamentos/listar?' + params.toString()); 
    tb.innerHTML = "";
    
    if(l && l.length > 0) {
        l.forEach(x => {
            const cor = x.tipo_movimento === 'Receita' ? 'var(--success)' : 'var(--danger)';
            const sinal = x.tipo_movimento === 'Receita' ? '+' : '-';
            const saldoDisplay = (x.saldo_acumulado !== undefined) ? `<b>${formatarMoeda(x.saldo_acumulado)}</b>` : '-';

            tb.innerHTML += `<tr>
                <td>${formatarData(x.data_movimento)}</td>
                <td>${x.tipo_movimento}</td>
                <td>${x.descricao}</td>
                <td style="color:${cor}; font-weight:700">${sinal} ${formatarMoeda(x.valor)}</td>
                <td>${saldoDisplay}</td>
            </tr>`;
        });
    } else {
        tb.innerHTML = "<tr><td colspan='5' class='text-center text-muted'>Nenhum lançamento registrado no período.</td></tr>";
    }
}

// Alias para compatibilidade com o HTML (que chama carregarDadosAcompanhamento)
export const carregarDadosAcompanhamento = carregarDadosExtrato;

export function abrirModalLancamento() {
    document.getElementById('lanc_valor').value = "";
    document.getElementById('lanc_descricao').value = "";
    document.getElementById('lanc_documento').value = "";
    document.getElementById('lanc_data').value = new Date().toISOString().split('T')[0];
    carregarCombosEmpenho(true); 
    document.getElementById('modal_lancamento_overlay').classList.add('show');
}

export async function salvarLancamento() {
    const tipo = document.getElementById('lanc_tipo').value;
    const dados = {
        programa_id: document.getElementById('lanc_programa').value,
        data: document.getElementById('lanc_data').value,
        valor: document.getElementById('lanc_valor').value,
        descricao: document.getElementById('lanc_descricao').value,
        documento: document.getElementById('lanc_documento').value
    };
    
    let endpoint = (tipo === 'Receita') ? '/financeiro/receitas/salvar' : null;
    if (!endpoint) { alert("Lançamento manual de Despesa indisponível via este atalho."); return; }
    
    if (tipo === 'Receita') { 
        dados.data_registro = dados.data; 
        dados.conta_bancaria_id = null; 
    }
    
    const r = await apiPost(endpoint, dados);
    if(r.status === 'ok') { 
        showToast("Lançamento realizado!"); 
        fecharModal('modal_lancamento_overlay'); 
        carregarDadosExtrato(); // Atualiza o extrato se estiver na tela
    }
}

export async function carregarContasFornecedores(termo = '') {
    const tbl = document.getElementById('tabela_contas_fornecedores');
    if (!tbl) return; 
    
    const container = tbl.querySelector('tbody');
    if(container.innerHTML.trim() === "") container.innerHTML = "<tr><td colspan='3' class='text-center'>Buscando dados...</td></tr>";
    
    const lista = await apiFetch('/financeiro/fornecedores-com-contas?termo=' + termo);
    container.innerHTML = "";

    if(lista && lista.length > 0) {
        lista.forEach(f => {
            let contasHtml = '';
            if(f.contas && f.contas.length > 0) {
                f.contas.forEach(c => {
                    contasHtml += `<div style="font-size:0.9rem; margin-bottom:4px; border-bottom:1px dashed #e2e8f0; padding-bottom:2px;">
                        <span style="font-weight:600; color:var(--primary)">${c.banco}</span> | 
                        Ag: ${c.agencia || '-'} | CC: ${c.conta} 
                        ${c.pix ? `<span style="color:var(--success); font-size:0.8rem">| PIX: ${c.pix}</span>` : ''}
                    </div>`;
                });
            } else {
                contasHtml = '<span style="color:#94a3b8; font-style:italic; font-size:0.85rem">Nenhuma conta cadastrada</span>';
            }

            container.innerHTML += `
                <tr>
                    <td style="vertical-align:top">
                        <div style="font-weight:600; color:var(--text-main); font-size:0.95rem">${f.razao_social}</div>
                        <div style="font-size:0.8rem; color:#64748b; margin-top:2px;">${f.cnpj}</div>
                    </td>
                    <td style="vertical-align:top; font-size:0.9rem">
                        <div><i class="ph ph-phone"></i> ${f.telefone || '-'}</div>
                        <div style="margin-top:2px"><i class="ph ph-envelope-simple"></i> ${f.email || '-'}</div>
                    </td>
                    <td style="vertical-align:top">${contasHtml}</td>
                </tr>
            `;
        });
    } else {
        container.innerHTML = "<tr><td colspan='3' class='text-center' style='padding:30px; color:#94a3b8'>Nenhum fornecedor encontrado.</td></tr>";
    }
}

export async function carregarCombosEmpenho(apenasBasico = false) {
    const progs = await apiFetch('/config/programas/listar');
    const contas = await apiFetch('/config/contas/listar');
    
    const htmlP = progs ? progs.map(p => `<option value="${p.id}">${p.nome_programa}</option>`).join('') : '';
    
    const htmlC = contas ? contas.map(c => {
        let texto = '';
        if (c.conta) { texto = `${c.conta} (${c.banco})`; } else { texto = `${c.banco} - ${c.descricao || ''}`; }
        return `<option value="${c.id}">${texto}</option>`;
    }).join('') : '';
    
    // Preenche selects
    if(document.getElementById('emp_programa')) document.getElementById('emp_programa').innerHTML = htmlP;
    if(document.getElementById('rec_programa')) document.getElementById('rec_programa').innerHTML = htmlP;
    if(document.getElementById('emp_conta_bancaria')) document.getElementById('emp_conta_bancaria').innerHTML = htmlC;
    if(document.getElementById('rec_conta')) document.getElementById('rec_conta').innerHTML = htmlC;
    
    // Preenche filtros
    const f = document.getElementById('filtro_emp_programa'); 
    if(f && f.options.length <= 1) f.innerHTML = '<option value="todos">Todos os Programas</option>' + htmlP;

    const fConta = document.getElementById('filtro_lanc_conta');
    if(fConta) fConta.innerHTML = '<option value="">Selecione uma conta...</option>' + htmlC;
    
    const fContaLivro = document.getElementById('filtro_livro_conta');
    if(fContaLivro) fContaLivro.innerHTML = '<option value="">Todas</option>' + htmlC;

    const f3 = document.getElementById('lanc_programa');
    if(f3) f3.innerHTML = htmlP || '<option value="">Nenhum programa</option>';

    const f4 = document.getElementById('filtro_lanc_programa');
    if(f4) f4.innerHTML = '<option value="">Todos</option>' + htmlP;

    if (apenasBasico) return;

    const fornecedores = await apiFetch('/config/fornecedores/listar');
    const htmlF = fornecedores ? `<option value="">Selecione...</option>` + fornecedores.map(f => `<option value="${f.id}">${f.razao_social}</option>`).join('') : '<option>Sem fornecedores</option>';
    if(document.getElementById('emp_fornecedor_select')) document.getElementById('emp_fornecedor_select').innerHTML = htmlF;

    const contratos = await apiFetch('/financeiro/contratos/ativos');
    const htmlCont = contratos ? `<option value="">Selecione...</option>` + contratos.map(c => `<option value="${c.id}">CT ${c.numero_contrato} - ${c.fornecedor}</option>`).join('') : '<option>Nenhum ativo</option>';
    if(document.getElementById('emp_contrato')) document.getElementById('emp_contrato').innerHTML = htmlCont;
}

export function toggleOrigemEmp() {
    const val = document.getElementById('emp_origem').value;
    const divContrato = document.getElementById('div_emp_contrato');
    const divFornecedor = document.getElementById('div_emp_fornecedor');
    
    if(val === 'Contrato') {
        if(divContrato) divContrato.classList.remove('hidden');
        if(divFornecedor) divFornecedor.classList.add('hidden');
    } else {
        if(divContrato) divContrato.classList.add('hidden');
        if(divFornecedor) divFornecedor.classList.remove('hidden');
    }
}

export function imprimirNota(id) { 
    const baseUrl = API_BASE.replace('/api', ''); 
    window.open(baseUrl + '/api/financeiro/empenho/imprimir?id=' + id, '_blank'); 
}

// =============================================================================
// EXPOSIÇÃO GLOBAL
// =============================================================================
window.initFinanceiro = initFinanceiro;
window.mudarVisaoMov = mudarVisaoMov;
window.carregarTabelaEmpenhos = carregarTabelaEmpenhos;
window.carregarReceitas = carregarReceitas;
window.carregarLivroDiario = carregarLivroDiario;
window.imprimirLivroDiario = imprimirLivroDiario;
window.abrirModalEmpenho = abrirModalEmpenho;
window.abrirModalReceita = abrirModalReceita;
window.editarEmpenho = editarEmpenho;
window.excluirEmpenho = excluirEmpenho;
window.editarReceita = editarReceita;
window.excluirReceita = excluirReceita;
window.toggleOrigemEmp = toggleOrigemEmp;
window.salvarEmpenho = salvarEmpenho;
window.salvarReceita = salvarReceita;
window.imprimirNota = imprimirNota;
window.carregarDadosAcompanhamento = carregarDadosAcompanhamento;
window.abrirModalLancamento = abrirModalLancamento;
window.salvarLancamento = salvarLancamento;
window.carregarContasFornecedores = carregarContasFornecedores;
window.carregarCombosEmpenho = carregarCombosEmpenho;
window.abrirModalPagamento = abrirModalPagamento;
window.confirmarPagamento = confirmarPagamento;
window.alternarAbaEmpenho = alternarAbaEmpenho;