// public/assets/js/modules/config.js
import { apiFetch, apiPost } from '../core/api.js';
import { showToast } from '../core/utils.js';
import { fecharModal } from '../core/ui.js';

// Variável local para contas temporárias
let contasFornTemp = [];

// =============================================================================
// LISTENER DE ABAS (O CÉREBRO DA TELA)
// =============================================================================
// Escuta o evento disparado pelo ui.js quando troca de aba
document.addEventListener('sige:tab-change', (e) => {
    const id = e.detail.id;
    if (id === 'conf-contas') carregarContasEnt();
    if (id === 'conf-programas') carregarProgramas();
    if (id === 'conf-fornecedores') carregarFornecedores();
});

// Função chamada pelo main.js ao entrar na tela via Sidebar
export function initConfig() {
    carregarDadosEntidade();
    // Garante que a primeira aba esteja carregada se estiver ativa
    if(document.getElementById('conf-entidade').classList.contains('active')) {
        carregarDadosEntidade();
    }
}

// =============================================================================
// LÓGICA DE DADOS (ENTIDADE)
// =============================================================================

export async function carregarDadosEntidade() {
    const d = await apiFetch('/config/entidade/get');
    if(d && document.getElementById('ent_nome')) {
        document.getElementById('ent_nome').value = d.nome_completo || '';
        document.getElementById('ent_cnpj').value = d.cnpj || '';
    }
}

export async function salvarEntidade() {
    await apiPost('/config/entidade/salvar', { 
        nome_completo: document.getElementById('ent_nome').value, 
        cnpj: document.getElementById('ent_cnpj').value 
    });
    showToast("Dados Salvos!");
}

// =============================================================================
// CONTAS DA ENTIDADE
// =============================================================================

export async function carregarContasEnt() {
    const l = await apiFetch('/config/contas/listar');
    const tb = document.getElementById('tabela_contas_ent').querySelector('tbody');
    if(!tb) return;

    tb.innerHTML = "";
    if(l) l.forEach(c => {
        const dados = JSON.stringify(c).replace(/"/g, '&quot;');
        tb.innerHTML += `
        <tr>
            <td>${c.banco}</td>
            <td>${c.conta}</td>
            <td>${c.descricao}</td>
            <td style="display:flex; gap:5px;">
                <button class="btn-icon-small" title="Editar" onclick="editarContaEnt(${dados})"><i class="ph ph-pencil"></i></button>
                <button class="btn-icon-small" style="color:var(--danger); border-color:var(--danger)" title="Excluir" onclick="excluirContaEnt(${c.id})"><i class="ph ph-trash"></i></button>
            </td>
        </tr>`;
    });
}

export function abrirModalContaEnt() { 
    document.getElementById('conta_ent_id').value = ""; 
    ['conta_ent_banco','conta_ent_ag','conta_ent_num','conta_ent_desc'].forEach(i => document.getElementById(i).value = "");
    document.getElementById('modal_conta_ent').classList.add('show'); 
}

export function editarContaEnt(dados) {
    document.getElementById('conta_ent_id').value = dados.id;
    document.getElementById('conta_ent_banco').value = dados.banco;
    document.getElementById('conta_ent_ag').value = dados.agencia;
    document.getElementById('conta_ent_num').value = dados.conta;
    document.getElementById('conta_ent_desc').value = dados.descricao;
    document.getElementById('modal_conta_ent').classList.add('show');
}

export async function salvarContaEnt() {
    const d = { 
        id: document.getElementById('conta_ent_id').value,
        banco: document.getElementById('conta_ent_banco').value, 
        agencia: document.getElementById('conta_ent_ag').value, 
        conta: document.getElementById('conta_ent_num').value, 
        descricao: document.getElementById('conta_ent_desc').value 
    };
    await apiPost('/config/contas/salvar', d); 
    fecharModal('modal_conta_ent'); 
    carregarContasEnt();
}

export async function excluirContaEnt(id) {
    if(!confirm("Tem certeza que deseja excluir esta conta?")) return;
    const r = await apiPost('/config/contas/excluir', {id: id});
    if(r.status === 'ok') {
        showToast("Conta excluída!");
        carregarContasEnt();
    } else {
        alert(r.message || "Erro ao excluir.");
    }
}

// =============================================================================
// PROGRAMAS
// =============================================================================

export async function carregarProgramas() {
    const l = await apiFetch('/config/programas/listar');
    const tb = document.getElementById('tabela_programas').querySelector('tbody');
    if(!tb) return;

    tb.innerHTML = "";
    if(l) l.forEach(p => {
        const dados = JSON.stringify(p).replace(/"/g, '&quot;');
        tb.innerHTML += `
        <tr>
            <td>${p.nome_programa}</td>
            <td>${p.tipo_macro}</td>
            <td style="display:flex; gap:5px;">
                <button class="btn-icon-small" title="Editar" onclick="editarPrograma(${dados})"><i class="ph ph-pencil"></i></button>
                <button class="btn-icon-small" style="color:var(--danger); border-color:var(--danger)" title="Excluir" onclick="excluirPrograma(${p.id})"><i class="ph ph-trash"></i></button>
            </td>
        </tr>`;
    });
}

export function abrirModalNovoPrograma() { 
    document.getElementById('programa_id').value = "";
    ['programa_nome','programa_bloco','programa_acao','programa_portaria'].forEach(i => document.getElementById(i).value = "");
    document.getElementById('modal_programa_overlay').classList.add('show'); 
}

export function editarPrograma(dados) {
    document.getElementById('programa_id').value = dados.id;
    document.getElementById('programa_nome').value = dados.nome_programa;
    document.getElementById('programa_tipo_macro').value = dados.tipo_macro;
    document.getElementById('programa_bloco').value = dados.bloco;
    document.getElementById('programa_acao').value = dados.acao_detalhada;
    document.getElementById('programa_portaria').value = dados.portaria;
    document.getElementById('modal_programa_overlay').classList.add('show');
}

export async function salvarPrograma() {
    await apiPost('/config/programas/salvar', {
        id: document.getElementById('programa_id').value,
        nome_programa: document.getElementById('programa_nome').value,
        tipo_macro: document.getElementById('programa_tipo_macro').value,
        bloco: document.getElementById('programa_bloco').value,
        acao_detalhada: document.getElementById('programa_acao').value,
        portaria: document.getElementById('programa_portaria').value
    });
    fecharModal('modal_programa_overlay'); 
    carregarProgramas();
}

export async function excluirPrograma(id) {
    if(!confirm("Deseja excluir este programa?")) return;
    const r = await apiPost('/config/programas/excluir', {id: id});
    if(r.status === 'ok') {
        showToast("Programa excluído!");
        carregarProgramas();
    } else {
        alert(r.message || "Erro ao excluir.");
    }
}

// =============================================================================
// FORNECEDORES
// =============================================================================

export async function carregarFornecedores() {
    const l = await apiFetch('/config/fornecedores/listar');
    const tb = document.getElementById('tabela_fornecedores').querySelector('tbody');
    if(!tb) return;

    tb.innerHTML = "";
    if(l) l.forEach(f => {
        const dados = JSON.stringify(f).replace(/"/g, '&quot;');
        tb.innerHTML += `
        <tr>
            <td>${f.cnpj}</td>
            <td>${f.razao_social}</td>
            <td style="display:flex; gap:5px;">
                <button class="btn-icon-small" title="Editar" onclick="editarFornecedor(${dados})"><i class="ph ph-pencil"></i></button>
                <button class="btn-icon-small" style="color:var(--danger); border-color:var(--danger)" title="Excluir" onclick="excluirFornecedor(${f.id})"><i class="ph ph-trash"></i></button>
            </td>
        </tr>`;
    });
}

export function abrirModalFornecedor() {
    contasFornTemp = [];
    document.getElementById('forn_id').value = "";
    ['forn_cnpj','forn_razao','forn_tel','forn_email','forn_conta_banco','forn_conta_agencia','forn_conta_num'].forEach(i => {
        if(document.getElementById(i)) document.getElementById(i).value = "";
    });
    document.getElementById('lista_contas_forn_ui').innerHTML = "";
    document.getElementById('modal_fornecedor_overlay').classList.add('show');
}

export function editarFornecedor(dados) {
    document.getElementById('forn_id').value = dados.id;
    document.getElementById('forn_cnpj').value = dados.cnpj;
    document.getElementById('forn_razao').value = dados.razao_social;
    document.getElementById('forn_tel').value = dados.telefone;
    document.getElementById('forn_email').value = dados.email;
    document.getElementById('lista_contas_forn_ui').innerHTML = "<small>(Contas bancárias devem ser gerenciadas separadamente)</small>";
    document.getElementById('modal_fornecedor_overlay').classList.add('show');
}

export function addContaFornUI() {
    const b = document.getElementById('forn_conta_banco').value;
    const a = document.getElementById('forn_conta_agencia').value;
    const c = document.getElementById('forn_conta_num').value;
    
    if(b && c) {
        contasFornTemp.push({banco:b, agencia:a, conta:c});
        document.getElementById('lista_contas_forn_ui').innerHTML += `<div style="font-size:0.9rem; margin-top:5px; border-bottom:1px dashed #eee; padding-bottom:2px;"><b>${b}</b> | Ag: ${a} | CC: ${c}</div>`;
        
        document.getElementById('forn_conta_banco').value = "";
        document.getElementById('forn_conta_agencia').value = "";
        document.getElementById('forn_conta_num').value = "";
    } else {
        alert("Preencha Banco e Conta.");
    }
}

export async function salvarFornecedor() {
    const r = await apiPost('/config/fornecedores/salvar', {
        id: document.getElementById('forn_id').value,
        cnpj: document.getElementById('forn_cnpj').value,
        razao_social: document.getElementById('forn_razao').value,
        telefone: document.getElementById('forn_tel').value,
        email: document.getElementById('forn_email').value
    });
    if(r.status === 'ok') {
        for(let c of contasFornTemp) {
            await apiPost('/config/fornecedores/conta/salvar', {
                fornecedor_id: r.id, 
                banco: c.banco, 
                agencia: c.agencia, 
                conta: c.conta
            });
        }
        fecharModal('modal_fornecedor_overlay');
        carregarFornecedores();
    } else {
        alert("Erro ao salvar fornecedor.");
    }
}

export async function excluirFornecedor(id) {
    if(!confirm("Deseja excluir este fornecedor?")) return;
    const r = await apiPost('/config/fornecedores/excluir', {id: id});
    if(r.status === 'ok') {
        showToast("Fornecedor excluído!");
        carregarFornecedores();
    } else {
        alert(r.message || "Erro ao excluir.");
    }
}

// =============================================================================
// EXPOSIÇÃO GLOBAL
// =============================================================================
window.carregarDadosEntidade = carregarDadosEntidade;
window.salvarEntidade = salvarEntidade;
window.carregarContasEnt = carregarContasEnt;
window.abrirModalContaEnt = abrirModalContaEnt;
window.editarContaEnt = editarContaEnt;
window.salvarContaEnt = salvarContaEnt;
window.excluirContaEnt = excluirContaEnt;
window.carregarProgramas = carregarProgramas;
window.abrirModalNovoPrograma = abrirModalNovoPrograma;
window.editarPrograma = editarPrograma;
window.salvarPrograma = salvarPrograma;
window.excluirPrograma = excluirPrograma;
window.carregarFornecedores = carregarFornecedores;
window.abrirModalFornecedor = abrirModalFornecedor;
window.editarFornecedor = editarFornecedor;
window.addContaFornUI = addContaFornUI;
window.salvarFornecedor = salvarFornecedor;
window.excluirFornecedor = excluirFornecedor;