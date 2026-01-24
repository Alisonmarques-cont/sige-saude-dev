import { apiFetch, apiPost } from '../../core/api.js';
import { formatarMoeda, formatarData, showToast } from '../../core/utils.js';
import { fecharModal } from '../../core/ui.js';
import { carregarCombosEmpenho } from './utils.js';

export async function carregarReceitas() {
    const progId = document.getElementById('filtro_emp_programa')?.value || 'todos';
    const tb = document.getElementById('tabela_receitas')?.querySelector('tbody');
    if(!tb) return;

    tb.innerHTML = "<tr><td colspan='6' class='text-center'>Carregando...</td></tr>";

    const l = await apiFetch('/financeiro/receitas/listar?programa_id=' + progId);
    
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

export function abrirModalReceita() {
    document.getElementById('rec_id').value = ""; 
    ['rec_valor','rec_desc'].forEach(i => document.getElementById(i).value="");
    document.getElementById('rec_data').value = new Date().toISOString().split('T')[0];
    
    // Carrega apenas combos básicos (Programas/Contas)
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
        showToast("Receita salva com sucesso!"); 
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