import { apiFetch, API_BASE } from '../../core/api.js';
import { formatarMoeda, formatarData } from '../../core/utils.js';

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