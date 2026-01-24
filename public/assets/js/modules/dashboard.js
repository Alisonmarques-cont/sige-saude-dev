import { apiFetch } from '../core/api.js';
import { formatarMoeda } from '../core/utils.js';
import { initAlertas } from './alertas.js'; 

let chartInstance = null;

/**
 * Função Principal: Carrega todos os dados da Dashboard
 */
export async function carregarDashboard() {
    // 1. Atualiza a data no topo
    atualizarDataTopo();

    // 2. Inicia os Alertas (Sininho)
    // Importante chamar aqui para garantir que carregue mesmo no F5
    initAlertas();

    // 3. Busca dados financeiros (KPIs e Gráficos)
    try {
        const d = await apiFetch('/dashboard-dados');
        if(!d) return;
        
        // Renderiza KPIs
        if(d.resumo) {
            setText('dash_ent', formatarMoeda(d.resumo.total_entradas));
            setText('dash_sai', formatarMoeda(d.resumo.total_saidas));
            setText('dash_res', formatarMoeda(d.resumo.saldo_atual));
            
            // Ajusta cor do saldo (Verde/Vermelho)
            const elSaldo = document.getElementById('dash_res');
            if(elSaldo) {
                elSaldo.className = 'saldo-valor ' + (d.resumo.saldo_atual >= 0 ? 'positivo' : 'negativo');
            }
        }
        
        // Renderiza Gráfico e Contas
        renderizarGrafico(d.grafico_programas);
        renderizarContas(d.contas);
        
    } catch (error) {
        console.error("Erro ao carregar dados da dashboard:", error);
    }
}

// --- Funções Auxiliares ---

function atualizarDataTopo() {
    const dateEl = document.getElementById('current_date');
    if (dateEl) {
        dateEl.innerText = new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if(el) el.innerText = text;
}

function renderizarGrafico(dados) {
    const chartEl = document.querySelector("#chart_programas");
    if(chartEl && dados) {
        const categories = dados.map(i => i.programa);
        const data = dados.map(i => i.saldo);

        const options = {
            series: [{ name: 'Saldo', data: data }],
            chart: { 
                type: 'bar', height: 350, toolbar: { show: false }, 
                fontFamily: 'Inter, sans-serif' 
            },
            plotOptions: { bar: { borderRadius: 4, horizontal: true } },
            dataLabels: { 
                enabled: true, 
                formatter: val => "R$ " + val.toLocaleString('pt-BR', {minimumFractionDigits: 2}) 
            },
            xaxis: { categories: categories },
            colors: ['#2563eb'],
            tooltip: { 
                y: { formatter: val => "R$ " + val.toLocaleString('pt-BR', {minimumFractionDigits: 2}) } 
            }
        };

        if(chartInstance) chartInstance.destroy();
        
        if (typeof ApexCharts !== 'undefined') {
            chartInstance = new ApexCharts(chartEl, options);
            chartInstance.render();
        }
    }
}

function renderizarContas(contas) {
    const div = document.getElementById('lista_saldos_contas');
    if(contas && div) {
        if(contas.length === 0) {
            div.innerHTML = '<p class="text-muted" style="padding:10px">Nenhuma conta cadastrada.</p>';
            return;
        }
        div.innerHTML = contas.map(c => `
            <div class="account-row">
                <div class="acc-info">
                    <span class="acc-bank">${c.banco}</span>
                    <div style="font-size:0.8rem; color:#64748b; margin-top:2px;">
                        Conta: <strong style="color:var(--text-main)">${c.conta || '-'}</strong>
                    </div>
                    <span class="acc-desc">${c.descricao}</span>
                </div>
                <div class="acc-val">${c.saldo}</div>
            </div>`).join('');
    }
}

// --- AUTO-INICIALIZAÇÃO (A CORREÇÃO) ---
// Verifica se o documento já carregou ou adiciona listener
const init = () => {
    const pageDashboard = document.getElementById('page-dashboard');
    // Se a section da dashboard existir e tiver a classe 'active' (visível)
    if (pageDashboard && pageDashboard.classList.contains('active')) {
        carregarDashboard();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}