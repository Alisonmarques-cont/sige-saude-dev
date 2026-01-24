import { apiFetch, apiPost, API_BASE } from '../../core/api.js';
import { formatarMoeda, formatarData, showToast } from '../../core/utils.js';
import { fecharModal } from '../../core/ui.js';
import { carregarCombosEmpenho } from './utils.js';

// =============================================================================
// LISTAGEM DE EMPENHOS
// =============================================================================

export async function carregarTabelaEmpenhos() {
    const progId = document.getElementById('filtro_emp_programa')?.value || 'todos';
    const tb = document.getElementById('tabela_empenhos')?.querySelector('tbody');
    
    if(!tb) return;
    tb.innerHTML = "<tr><td colspan='6' class='text-center'>Carregando movimentações...</td></tr>";

    const l = await apiFetch('/financeiro/empenhos/listar?programa_id=' + progId);
    
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

// =============================================================================
// MODAL DE EMPENHO (LÓGICA COMPLEXA)
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

export async function abrirModalEmpenho() {
    document.getElementById('emp_id').value = ""; 
    
    // Limpa campos
    ['emp_valor','emp_descricao', 'emp_protocolo', 'emp_data_protocolo', 'emp_nota_fiscal', 'emp_elemento'].forEach(i => {
        const el = document.getElementById(i);
        if(el) el.value = "";
    });
    
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('emp_data_emissao').value = hoje;
    document.getElementById('emp_data_vencimento').value = hoje;
    document.getElementById('emp_data_protocolo').value = hoje;
    
    document.getElementById('emp_origem').value = 'Direta';
    
    // Carrega combos completos (incluindo fornecedores e contratos)
    await carregarCombosEmpenho();
    toggleOrigemEmp();
    
    // Busca próximo protocolo sugerido
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
        // Tenta selecionar o fornecedor pelo texto (nome)
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

export async function salvarEmpenho() {
    const prog = document.getElementById('emp_programa').value;
    const conta = document.getElementById('emp_conta_bancaria').value;
    const valorStr = document.getElementById('emp_valor').value; 
    const origem = document.getElementById('emp_origem').value;

    // Limpeza para validar valor
    let clean = valorStr ? valorStr.replace(/[^\d,]/g, '') : '';
    clean = clean.replace(',', '.');
    let valorNumerico = parseFloat(clean);

    // Validações
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
        valor_total: valorStr, 
        descricao: document.getElementById('emp_descricao').value,
        conta_bancaria_id: conta,
        tipo_origem: origem,
        elemento_despesa: document.getElementById('emp_elemento').value
    };
    
    if(origem === 'Contrato') {
        const contratoId = document.getElementById('emp_contrato').value;
        if(!contratoId) {
            const btn = document.querySelectorAll('#modal_empenho_overlay .tab-link')[0]; // Aba 1
            alternarAbaEmpenho('aba_emp_cadastral', btn);
            return alert("Selecione o Contrato vinculado.");
        }
        d.contrato_id = contratoId;
    } else {
        const fornSelect = document.getElementById('emp_fornecedor_select');
        if(!fornSelect.value) {
            const btn = document.querySelectorAll('#modal_empenho_overlay .tab-link')[0]; // Aba 1
            alternarAbaEmpenho('aba_emp_cadastral', btn);
            return alert("Selecione o Fornecedor.");
        }
        d.credor = fornSelect.options[fornSelect.selectedIndex].text;
        d.contrato_id = null;
    }

    const r = await apiPost('/financeiro/empenhos/salvar', d);
    if(r.status === 'ok') { 
        showToast("Empenho Salvo!"); 
        fecharModal('modal_empenho_overlay'); 
        carregarTabelaEmpenhos(); 
    } else {
        alert(r.message || "Erro ao salvar.");
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
// PAGAMENTOS E IMPRESSÃO
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

export function imprimirNota(id) { 
    const baseUrl = API_BASE.replace('/api', ''); 
    window.open(baseUrl + '/api/financeiro/empenho/imprimir?id=' + id, '_blank'); 
}