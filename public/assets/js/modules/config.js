import { apiFetch, apiPost } from '../core/api.js';
import { showToast } from '../core/utils.js';
import { fecharModal } from '../core/ui.js';

// Importação do Plano de Contas (Certifique-se que o arquivo existe em modules/financeiro)
import { carregarPlanoContas } from './financeiro/plano_contas.js';

// Variável local para contas temporárias de fornecedores
let contasFornTemp = [];

// =============================================================================
// LISTENER DE ABAS (GERENCIAMENTO DE TABS)
// =============================================================================
document.addEventListener('sige:tab-change', (e) => {
    const id = e.detail.id;
    console.log("Aba alterada:", id); // Debug para verificar troca

    if (id === 'conf-entidade') carregarDadosEntidade();
    if (id === 'conf-contas') carregarContasEnt();
    if (id === 'conf-programas') carregarProgramas();
    if (id === 'conf-pdc') carregarPlanoContas();
    
    // Fornecedores (se houver aba no futuro)
    if (id === 'conf-fornecedores') carregarFornecedores();
});

// Função de inicialização chamada pelo Router
export function initConfig() {
    carregarDadosEntidade();
    // Verifica qual aba está ativa no HTML ao carregar
    const activeTab = document.querySelector('.tab-content.active');
    if(activeTab) {
        if(activeTab.id === 'conf-contas') carregarContasEnt();
        if(activeTab.id === 'conf-programas') carregarProgramas();
        if(activeTab.id === 'conf-pdc') carregarPlanoContas();
    }
}

// =============================================================================
// 1. ENTIDADE (Prefeitura / Órgão)
// =============================================================================

export async function carregarDadosEntidade() {
    try {
        const d = await apiFetch('/config/entidade/get');
        if(d && document.getElementById('entidade_nome')) {
            document.getElementById('entidade_nome').value = d.nome_completo || '';
            document.getElementById('entidade_cnpj').value = d.cnpj || '';
            if(document.getElementById('entidade_cidade')) document.getElementById('entidade_cidade').value = d.cidade || '';
            if(document.getElementById('entidade_uf')) document.getElementById('entidade_uf').value = d.uf || '';
            if(document.getElementById('entidade_logradouro')) document.getElementById('entidade_logradouro').value = d.logradouro || '';
            if(document.getElementById('entidade_telefone')) document.getElementById('entidade_telefone').value = d.telefone || '';
        }
    } catch (e) {
        console.error("Erro ao carregar entidade:", e);
    }
}

export async function salvarConfiguracaoAtual() {
    const btn = document.querySelector('button[onclick="salvarConfiguracaoAtual()"]');
    const originalText = btn ? btn.innerHTML : 'Salvar';
    if(btn) { btn.disabled = true; btn.innerHTML = 'Salvando...'; }

    try {
        const dados = {
            nome_completo: document.getElementById('entidade_nome').value, 
            cnpj: document.getElementById('entidade_cnpj').value,
            cidade: document.getElementById('entidade_cidade')?.value,
            uf: document.getElementById('entidade_uf')?.value,
            logradouro: document.getElementById('entidade_logradouro')?.value,
            telefone: document.getElementById('entidade_telefone')?.value
        };

        await apiPost('/config/entidade/salvar', dados);
        showToast("Configurações salvas com sucesso!");
    } catch (e) {
        console.error(e);
        alert("Erro ao salvar.");
    } finally {
        if(btn) { btn.disabled = false; btn.innerHTML = originalText; }
    }
}

// =============================================================================
// 2. CONTAS BANCÁRIAS DA ENTIDADE
// =============================================================================

export async function carregarContasEnt() {
    const tb = document.getElementById('lista_contas_bancarias'); 
    if(!tb) return;

    tb.innerHTML = '<tr><td colspan="5" class="text-center">Carregando...</td></tr>';

    try {
        const l = await apiFetch('/config/contas/listar');
        
        if(l && l.length > 0) {
            // Renderização otimizada com map/join
            tb.innerHTML = l.map(c => {
                const dados = JSON.stringify(c).replace(/"/g, '&quot;');
                return `
                <tr>
                    <td>${c.banco}</td>
                    <td>${c.agencia || '-'}</td>
                    <td>${c.conta}</td>
                    <td>${c.descricao}</td>
                    <td style="display:flex; gap:5px;">
                        <button class="btn-icon-small" title="Editar" onclick="editarContaEnt(${dados})"><i class="ph ph-pencil"></i></button>
                        <button class="btn-icon-small" style="color:var(--danger); border-color:var(--danger)" title="Excluir" onclick="excluirContaEnt(${c.id})"><i class="ph ph-trash"></i></button>
                    </td>
                </tr>`;
            }).join('');
        } else {
            tb.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma conta cadastrada.</td></tr>';
        }
    } catch (e) {
        console.error("Erro contas:", e);
        tb.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Erro ao carregar.</td></tr>';
    }
}

export function novaContaBancaria() { 
    const modal = document.getElementById('modal_conta_ent'); // Verifique se este ID existe no HTML (Shared/Views/modals ou Config/Views)
    if(modal) {
        // Limpa campos
        if(document.getElementById('conta_ent_id')) document.getElementById('conta_ent_id').value = ""; 
        ['conta_ent_banco','conta_ent_ag','conta_ent_num','conta_ent_desc'].forEach(i => {
            if(document.getElementById(i)) document.getElementById(i).value = "";
        });
        modal.classList.add('show');
    } else {
        // Fallback: Se o modal não estiver no HTML, avisa (provavelmente falta include dos modais)
        alert("O modal 'modal_conta_ent' não foi encontrado no HTML. Verifique os arquivos de View.");
    }
}

export function editarContaEnt(dados) {
    const modal = document.getElementById('modal_conta_ent');
    if(modal) {
        document.getElementById('conta_ent_id').value = dados.id;
        document.getElementById('conta_ent_banco').value = dados.banco;
        document.getElementById('conta_ent_ag').value = dados.agencia;
        document.getElementById('conta_ent_num').value = dados.conta;
        document.getElementById('conta_ent_desc').value = dados.descricao;
        modal.classList.add('show');
    }
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
    showToast("Conta salva!");
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
// 3. PROGRAMAS
// =============================================================================

export async function carregarProgramas() {
    const tb = document.getElementById('lista_programas');
    if(!tb) return;

    tb.innerHTML = '<tr><td colspan="4" class="text-center">Carregando...</td></tr>';

    try {
        const l = await apiFetch('/config/programas/listar');
        
        if(l && l.length > 0) {
            tb.innerHTML = l.map(p => {
                const dados = JSON.stringify(p).replace(/"/g, '&quot;');
                return `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nome_programa}</td>
                    <td>${p.tipo_macro || '-'}</td>
                    <td style="display:flex; gap:5px;">
                        <button class="btn-icon-small" title="Editar" onclick="editarPrograma(${dados})"><i class="ph ph-pencil"></i></button>
                        <button class="btn-icon-small" style="color:var(--danger); border-color:var(--danger)" title="Excluir" onclick="excluirPrograma(${p.id})"><i class="ph ph-trash"></i></button>
                    </td>
                </tr>`;
            }).join('');
        } else {
            tb.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum programa cadastrado.</td></tr>';
        }
    } catch (e) {
        console.error(e);
        tb.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erro ao carregar.</td></tr>';
    }
}

export function novoPrograma() { 
    const modal = document.getElementById('modal_programa_overlay');
    if(modal) {
        if(document.getElementById('programa_id')) document.getElementById('programa_id').value = "";
        ['programa_nome','programa_tipo_macro','programa_bloco','programa_acao','programa_portaria'].forEach(i => {
             if(document.getElementById(i)) document.getElementById(i).value = "";
        });
        modal.classList.add('show'); 
    } else {
        alert("Modal de Programa não encontrado.");
    }
}

export function editarPrograma(dados) {
    const modal = document.getElementById('modal_programa_overlay');
    if(modal) {
        document.getElementById('programa_id').value = dados.id;
        document.getElementById('programa_nome').value = dados.nome_programa;
        if(document.getElementById('programa_tipo_macro')) document.getElementById('programa_tipo_macro').value = dados.tipo_macro;
        if(document.getElementById('programa_bloco')) document.getElementById('programa_bloco').value = dados.bloco;
        if(document.getElementById('programa_acao')) document.getElementById('programa_acao').value = dados.acao_detalhada;
        if(document.getElementById('programa_portaria')) document.getElementById('programa_portaria').value = dados.portaria;
        modal.classList.add('show');
    }
}

export async function salvarPrograma() {
    await apiPost('/config/programas/salvar', {
        id: document.getElementById('programa_id').value,
        nome_programa: document.getElementById('programa_nome').value,
        tipo_macro: document.getElementById('programa_tipo_macro')?.value,
        bloco: document.getElementById('programa_bloco')?.value,
        acao_detalhada: document.getElementById('programa_acao')?.value,
        portaria: document.getElementById('programa_portaria')?.value
    });
    fecharModal('modal_programa_overlay'); 
    carregarProgramas();
    showToast("Programa salvo!");
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
// 4. FORNECEDORES (Mantido caso a aba seja adicionada futuramente)
// =============================================================================

export async function carregarFornecedores() {
    // Verifica se a tabela existe antes de tentar carregar
    const tbWrapper = document.getElementById('tabela_fornecedores');
    if(!tbWrapper) return; // Sai silenciosamente se a aba não existir no HTML

    const tb = tbWrapper.querySelector('tbody');
    if(!tb) return;

    const l = await apiFetch('/config/fornecedores/listar');
    
    tb.innerHTML = "";
    if(l) {
        tb.innerHTML = l.map(f => {
            const dados = JSON.stringify(f).replace(/"/g, '&quot;');
            return `
            <tr>
                <td>${f.cnpj}</td>
                <td>${f.razao_social}</td>
                <td style="display:flex; gap:5px;">
                    <button class="btn-icon-small" title="Editar" onclick="editarFornecedor(${dados})"><i class="ph ph-pencil"></i></button>
                    <button class="btn-icon-small" style="color:var(--danger); border-color:var(--danger)" title="Excluir" onclick="excluirFornecedor(${f.id})"><i class="ph ph-trash"></i></button>
                </td>
            </tr>`;
        }).join('');
    }
}

export function abrirModalFornecedor() {
    contasFornTemp = [];
    if(document.getElementById('forn_id')) document.getElementById('forn_id').value = "";
    ['forn_cnpj','forn_razao','forn_tel','forn_email','forn_conta_banco','forn_conta_agencia','forn_conta_num'].forEach(i => {
        if(document.getElementById(i)) document.getElementById(i).value = "";
    });
    const listaUi = document.getElementById('lista_contas_forn_ui');
    if(listaUi) listaUi.innerHTML = "";
    
    const modal = document.getElementById('modal_fornecedor_overlay');
    if(modal) modal.classList.add('show');
}

export function editarFornecedor(dados) {
    if(document.getElementById('forn_id')) document.getElementById('forn_id').value = dados.id;
    if(document.getElementById('forn_cnpj')) document.getElementById('forn_cnpj').value = dados.cnpj;
    if(document.getElementById('forn_razao')) document.getElementById('forn_razao').value = dados.razao_social;
    if(document.getElementById('forn_tel')) document.getElementById('forn_tel').value = dados.telefone;
    if(document.getElementById('forn_email')) document.getElementById('forn_email').value = dados.email;
    
    const listaUi = document.getElementById('lista_contas_forn_ui');
    if(listaUi) listaUi.innerHTML = "<small>(Contas bancárias devem ser gerenciadas separadamente)</small>";
    
    const modal = document.getElementById('modal_fornecedor_overlay');
    if(modal) modal.classList.add('show');
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
        showToast("Fornecedor Salvo!");
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
// EXPOSIÇÃO GLOBAL (Para funcionar com onclick no HTML)
// =============================================================================

// Entidade
window.carregarDadosEntidade = carregarDadosEntidade;
window.salvarConfiguracaoAtual = salvarConfiguracaoAtual;

// Contas
window.carregarContasEnt = carregarContasEnt;
window.novaContaBancaria = novaContaBancaria;
window.editarContaEnt = editarContaEnt;
window.salvarContaEnt = salvarContaEnt;
window.excluirContaEnt = excluirContaEnt;

// Programas
window.carregarProgramas = carregarProgramas;
window.novoPrograma = novoPrograma;
window.editarPrograma = editarPrograma;
window.salvarPrograma = salvarPrograma;
window.excluirPrograma = excluirPrograma;

// Fornecedores
window.carregarFornecedores = carregarFornecedores;
window.abrirModalFornecedor = abrirModalFornecedor;
window.editarFornecedor = editarFornecedor;
window.addContaFornUI = addContaFornUI;
window.salvarFornecedor = salvarFornecedor;
window.excluirFornecedor = excluirFornecedor;