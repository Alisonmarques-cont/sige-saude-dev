import { apiFetch, apiPost } from '../../core/api.js';
import { formatarMoeda, formatarData, showToast } from '../../core/utils.js';
import { fecharModal } from '../../core/ui.js';
import { carregarCombosEmpenho } from './utils.js';

export async function carregarDadosExtrato() {
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

    const res = await apiFetch('/financeiro/lancamentos/listar?' + params.toString()); 
    tb.innerHTML = "";
    
    // Tratamento para a nova estrutura { status, saldo_anterior, itens }
    let lista = [];
    let saldoAnterior = null;

    if (res && res.itens) {
        lista = res.itens;
        saldoAnterior = res.saldo_anterior;
    } else if (Array.isArray(res)) {
        // Fallback para estrutura antiga (caso necessário)
        lista = res;
    }

    if(lista && lista.length > 0) {
        lista.forEach(x => {
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

    // --- LINHA DE SALDO ANTERIOR (BRANCH SALDO ANTERIOR) ---
    // Exibe apenas se uma conta específica foi selecionada e o saldo foi retornado
    if (contaId && saldoAnterior !== null) {
        const dataLabel = dataIni ? formatarData(dataIni) : 'Início';
        const linhaSaldo = `
            <tr style="background-color: #f1f5f9; border-top: 2px solid var(--border); font-weight: 600; color: var(--text-muted);">
                <td>${dataLabel}</td>
                <td colspan="3" style="text-align: right; text-transform: uppercase; letter-spacing: 0.5px;">Saldo Anterior:</td>
                <td style="color: var(--primary); font-size: 1rem;">${formatarMoeda(saldoAnterior)}</td>
            </tr>
        `;
        // Adiciona ao final da tabela (já que a ordem é DESC, o saldo anterior é o estado "antes" do último item visível)
        tb.insertAdjacentHTML('beforeend', linhaSaldo);
    }
}

// Alias para manter compatibilidade caso algo chame pelo nome antigo
export const carregarDadosAcompanhamento = carregarDadosExtrato;

export function abrirModalLancamento() {
    document.getElementById('lanc_valor').value = "";
    document.getElementById('lanc_descricao').value = "";
    document.getElementById('lanc_documento').value = "";
    document.getElementById('lanc_data').value = new Date().toISOString().split('T')[0];
    
    carregarCombosEmpenho(true); // Carrega combos básicos
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
    
    // Lançamento manual só é permitido para Receitas via atalho rápido ou Ajustes.
    // Despesas devem ser via Empenho, mas mantemos a lógica caso precise de ajuste manual.
    let endpoint = (tipo === 'Receita') ? '/financeiro/receitas/salvar' : null;
    
    if (!endpoint) { 
        alert("Para despesas, utilize a tela de Empenhos ou Ajuste Técnico."); 
        return; 
    }
    
    if (tipo === 'Receita') { 
        dados.data_registro = dados.data; 
        dados.conta_bancaria_id = null; 
    }
    
    const r = await apiPost(endpoint, dados);
    if(r.status === 'ok') { 
        showToast("Lançamento realizado!"); 
        fecharModal('modal_lancamento_overlay'); 
        carregarDadosExtrato(); 
    } else {
        alert(r.message || "Erro ao salvar.");
    }
}