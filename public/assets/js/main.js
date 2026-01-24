import { initUI } from './core/ui.js';
import { carregarDashboard } from './modules/dashboard.js';

// --- Módulo Financeiro Refatorado ---
import { initFinanceiro, carregarDadosExtrato, carregarContasFornecedores, carregarLivroDiario } from './modules/financeiro/index.js';

import { carregarPregoes, verificarEInjetarModaisContratos } from './modules/contratos.js';
import { initConfig } from './modules/config.js';

// --- Novo Módulo de Alertas ---
import { initAlertas } from './modules/alertas.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Sige Saúde Modular Ready.");

    // 1. Inicialização do Sistema de Alertas (Global)
    try {
        initAlertas(); 
        // Verifica novas notificações a cada 5 minutos (300.000 ms)
        setInterval(initAlertas, 300000);
    } catch(e) {
        console.warn("Sistema de alertas não pôde ser iniciado:", e);
    }

    // 2. Inicialização de Modais de Contratos
    try {
        verificarEInjetarModaisContratos();
    } catch(e) {
        console.warn("Módulo Contratos (Modais) falhou na inicialização:", e);
    }

    // 3. Mapeamento das páginas para as funções de carga (Router)
    const routeMap = {
        'dashboard': carregarDashboard,
        'empenhos': initFinanceiro,
        'lancamentos': carregarDadosExtrato,
        'contas-fornecedores': () => carregarContasFornecedores(''),
        'livro-diario': carregarLivroDiario,
        'contratos': carregarPregoes,
        'config': initConfig
    };

    // 4. Inicializa a Interface do Usuário (Navegação)
    try {
        initUI(routeMap);
    } catch(e) {
        console.error("Erro crítico na UI:", e);
    }

    // 5. Carrega a dashboard inicial se nenhuma página específica for acionada
    if(!document.querySelector('.page.active')) {
         try {
            carregarDashboard();
        } catch(e) {
            console.error("Erro ao carregar Dashboard:", e);
        }
    }

    // 6. Evento Global: Fechar Dropdown de Alertas ao clicar fora
    document.addEventListener('click', (e) => {
        const wrapper = document.querySelector('.notification-wrapper');
        const dropdown = document.getElementById('dropdown_alertas');
        
        // Se existe dropdown, está aberto, e o clique NÃO foi dentro do wrapper (sino + menu)
        if (wrapper && dropdown && dropdown.classList.contains('show') && !wrapper.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
});