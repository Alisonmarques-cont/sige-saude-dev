import { apiFetch } from '../core/api.js';

/**
 * Inicializa o módulo de alertas.
 * Chamado automaticamente pelo dashboard.js ao carregar a página.
 */
export async function initAlertas() {
    try {
        // Busca os alertas no endpoint do backend
        const res = await apiFetch('/dashboard/alertas/listar');
        
        if (res && res.status === 'ok') {
            const lista = res.dados || [];
            const total = res.total || 0;

            // Renderiza o sino específico do Dashboard (ao lado da data)
            renderizarSinoDashboard(lista, total);
        }
    } catch (error) {
        console.error("Erro ao carregar alertas:", error);
    }
}

/**
 * Atualiza o ícone do sino e a lista suspensa (dropdown)
 */
function renderizarSinoDashboard(lista, total) {
    const badge = document.getElementById('badge_dash_alertas');
    const container = document.getElementById('lista_dash_alertas');
    const btn = document.getElementById('btn_dash_alertas');
    
    // Verificação de segurança se os elementos existem na tela
    if(!container || !btn) return;

    // 1. Atualiza o Contador (Bolinha Vermelha)
    if (total > 0) {
        if(badge) {
            badge.style.display = 'flex';
            badge.innerText = total > 9 ? '9+' : total;
        }
        // Opcional: Adiciona uma classe ao botão se houver alertas (para estilização extra)
        btn.classList.add('has-alerts'); 
    } else {
        if(badge) badge.style.display = 'none';
        btn.classList.remove('has-alerts');
    }

    // 2. Renderiza o conteúdo da Lista
    container.innerHTML = '';

    if (lista.length === 0) {
        // Estado Vazio (Sem alertas)
        container.innerHTML = `
            <div class="dash-empty">
                <i class="ph ph-check-circle" style="font-size:1.5rem; margin-bottom:5px; color:var(--success)"></i>
                <br>
                Tudo certo! Nenhuma pendência.
            </div>
        `;
        return;
    }

    // Preenche com os itens de alerta
    lista.forEach(a => {
        // Define cores baseadas no tipo (erro = vermelho, aviso = amarelo/laranja)
        const isErro = a.tipo === 'erro';
        const color = isErro ? '#dc2626' : '#d97706'; // Red-600 ou Amber-600
        const bgIcon = isErro ? '#fef2f2' : '#fffbeb'; // Red-50 ou Amber-50
        
        const div = document.createElement('div');
        div.className = 'dash-alert-item';
        
        // Ao clicar, navega para a página correspondente
        div.onclick = () => window.navegarPara(a.link);
        
        div.innerHTML = `
            <div class="dash-alert-icon" style="color:${color}; background:${bgIcon}; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i class="ph-fill ${a.icone}"></i>
            </div>
            <div class="dash-alert-content">
                <h5 style="color:${color}">${a.titulo}</h5>
                <p>${a.mensagem}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Abre ou fecha o menu dropdown de alertas
 */
window.toggleDashAlertas = function() {
    const dropdown = document.getElementById('dropdown_dash_alertas');
    if(dropdown) {
        // Alterna a classe 'show' que controla a visibilidade no CSS
        dropdown.classList.toggle('show');
        
        // Se abriu, adiciona evento para fechar ao clicar fora
        if(dropdown.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', fecharAoClicarFora);
            }, 100); // Pequeno delay para evitar fechar imediatamente ao clicar no botão
        }
    }
};

/**
 * Fecha o dropdown se o usuário clicar em qualquer lugar fora dele
 */
function fecharAoClicarFora(e) {
    const wrapper = document.querySelector('.dash-notification-wrapper');
    const dropdown = document.getElementById('dropdown_dash_alertas');
    
    // Se o clique NÃO foi dentro do wrapper (botão + dropdown), fecha
    if (wrapper && !wrapper.contains(e.target)) {
        if(dropdown) dropdown.classList.remove('show');
        document.removeEventListener('click', fecharAoClicarFora);
    }
}

/**
 * Helper Global para navegação interna
 * Simula o clique no menu lateral para carregar a página sem refresh
 */
window.navegarPara = function(pageId) {
    const link = document.querySelector(`[data-page="${pageId}"]`);
    if(link) {
        link.click();
    } else {
        console.warn(`Página não encontrada no menu: ${pageId}`);
    }
    
    // Fecha o dropdown após navegar
    const dropdown = document.getElementById('dropdown_dash_alertas');
    if(dropdown) dropdown.classList.remove('show');
};

// Expõe a função de inicialização globalmente caso precise recarregar manualmente
window.atualizarAlertas = initAlertas;