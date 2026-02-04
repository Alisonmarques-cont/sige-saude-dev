import { apiFetch, apiPost } from '../../core/api.js';
import { showToast } from '../../core/utils.js';
import { fecharModal } from '../../core/ui.js';

// Função principal que carrega a lista
export async function carregarPlanoContas() {
    const tbody = document.getElementById('lista_plano_contas');
    if(!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Carregando...</td></tr>';

    const dados = await apiFetch('/financeiro/plano-contas/listar');
    tbody.innerHTML = "";

    if(dados && dados.length > 0) {
        dados.forEach(c => {
            // Convertemos o objeto em string para passar pro botão editar
            const json = JSON.stringify(c).replace(/"/g, '&quot;');
            
            // Estilo visual: negrito se for Sintético (Título)
            const estilo = c.nivel === 'Sintetico' ? 'font-weight:bold; background-color:#f8fafc' : '';

            tbody.innerHTML += `
            <tr style="${estilo}">
                <td>${c.codigo}</td>
                <td>${c.descricao}</td>
                <td><span class="status-badge ${c.tipo === 'Receita' ? 'ativo' : 'warning'}">${c.tipo}</span></td>
                <td>${c.nivel}</td>
                <td style="display:flex; gap:5px;">
                    <button class="btn-icon-small" onclick="editarPlanoContas(${json})"><i class="ph ph-pencil"></i></button>
                    <button class="btn-icon-small" style="color:red; border-color:red" onclick="excluirPlanoContas(${c.id})"><i class="ph ph-trash"></i></button>
                </td>
            </tr>`;
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhuma conta cadastrada.</td></tr>';
    }
}

// Abre o modal limpo para novo cadastro
export function abrirModalPlanoContas() {
    document.getElementById('pdc_id').value = "";
    document.getElementById('pdc_codigo').value = "";
    document.getElementById('pdc_descricao').value = "";
    document.getElementById('modal_plano_contas').classList.add('show');
}

// Preenche o modal com dados existentes para editar
export function editarPlanoContas(dados) {
    document.getElementById('pdc_id').value = dados.id;
    document.getElementById('pdc_codigo').value = dados.codigo;
    document.getElementById('pdc_descricao').value = dados.descricao;
    document.getElementById('pdc_tipo').value = dados.tipo;
    document.getElementById('pdc_nivel').value = dados.nivel;
    document.getElementById('modal_plano_contas').classList.add('show');
}

// Envia os dados para o servidor
export async function salvarPlanoContas() {
    const dados = {
        id: document.getElementById('pdc_id').value,
        codigo: document.getElementById('pdc_codigo').value,
        descricao: document.getElementById('pdc_descricao').value,
        tipo: document.getElementById('pdc_tipo').value,
        nivel: document.getElementById('pdc_nivel').value
    };

    if(!dados.codigo || !dados.descricao) return alert("Preencha Código e Descrição");

    const res = await apiPost('/financeiro/plano-contas/salvar', dados);
    
    if(res.status === 'ok') {
        showToast("Salvo com sucesso!");
        fecharModal('modal_plano_contas');
        carregarPlanoContas();
    } else {
        alert("Erro ao salvar: " + res.message);
    }
}

export async function excluirPlanoContas(id) {
    if(!confirm("Tem certeza?")) return;
    const res = await apiPost('/financeiro/plano-contas/excluir', {id: id});
    if(res.status === 'ok') {
        showToast("Excluído!");
        carregarPlanoContas();
    }
}

// Expõe as funções para o HTML poder chamar (onclick="...")
window.carregarPlanoContas = carregarPlanoContas;
window.abrirModalPlanoContas = abrirModalPlanoContas;
window.editarPlanoContas = editarPlanoContas;
window.salvarPlanoContas = salvarPlanoContas;
window.excluirPlanoContas = excluirPlanoContas;