// public/assets/js/core/ui.js

/**
 * Controla a abertura/fechamento da Sidebar (Menu Lateral)
 */
export function toggleSidebar() { 
    const s = document.getElementById('sidebar');
    if(s) s.classList.toggle('open'); 
}

/**
 * Controla os submenus da Sidebar (Acordeão)
 */
export function toggleSubmenu(el) {
    const parent = el.parentElement;
    parent.classList.toggle('open');
    const sub = parent.querySelector('.sidebar-submenu');
    if(sub) {
        sub.classList.toggle('show');
    }
}

/**
 * Fecha qualquer modal pelo ID e remove a classe 'show'
 */
export function fecharModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.remove('show'); 
}

/**
 * Configura o comportamento das Abas (Tabs) do sistema.
 */
export function setupTabs() {
    document.querySelectorAll('.tab-link').forEach(t => {
        // Clona o nó para remover ouvintes antigos e evitar duplicidade
        const newT = t.cloneNode(true);
        t.parentNode.replaceChild(newT, t);

        newT.addEventListener('click', e => {
            // 1. VERIFICAÇÃO DE SEGURANÇA
            const tabId = newT.getAttribute('data-tab');
            if (!tabId) return; // Ignora abas manuais (sem data-tab)

            e.preventDefault();
            
            // 2. Lógica Visual dos Botões
            const parent = newT.closest('.tabs');
            if (parent) {
                parent.querySelectorAll('.tab-link').forEach(x => x.classList.remove('active'));
            }
            newT.classList.add('active');

            // 3. Lógica de Conteúdo
            const container = newT.closest('.page') || newT.closest('.modal-content') || document;
            
            if (container) {
                // Esconde conteúdos antigos
                container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Mostra o conteúdo novo
                const target = container.querySelector(`#${tabId}`);
                if (target) target.classList.add('active');

                // 4. DISPARAR EVENTO (IMPORTANTE PARA O CONFIG.JS)
                // Isso avisa os módulos que a aba mudou, para que carreguem os dados
                const event = new CustomEvent('sige:tab-change', { detail: { id: tabId } });
                document.dispatchEvent(event);
            }
        });
    });
}

/**
 * Aplica máscaras de input (Dinheiro, etc)
 */
export function aplicarMascaras() {
    document.querySelectorAll('.mask-money').forEach(i => {
        const newI = i.cloneNode(true);
        i.parentNode.replaceChild(newI, i);

        newI.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, "");
            v = (parseInt(v) / 100).toFixed(2) + ""; 
            v = v.replace(".", ","); 
            v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
            e.target.value = "R$ " + v;
        });
    });
    
    // Máscara CNPJ (Simples)
    document.querySelectorAll('.mask-cnpj').forEach(i => {
        const newI = i.cloneNode(true);
        i.parentNode.replaceChild(newI, i);
        newI.addEventListener('input', e => {
             let v = e.target.value.replace(/\D/g,"");
             if(v.length > 14) v = v.slice(0,14);
             v=v.replace(/^(\d{2})(\d)/,"$1.$2");
             v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");
             v=v.replace(/\.(\d{3})(\d)/,".$1/$2");
             v=v.replace(/(\d{4})(\d)/,"$1-$2");
             e.target.value = v;
        });
    });
}

/**
 * Inicializa todas as funções de interface globais
 */
export function initUI(routeMap = {}) {
    window.toggleSidebar = toggleSidebar;
    window.toggleSubmenu = toggleSubmenu;
    window.fecharModal = fecharModal;

    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.addEventListener('click', e => { 
            if(e.target === m) m.classList.remove('show'); 
        });
    });

    document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('sidebar');
        const toggles = document.querySelectorAll('.mobile-toggle');
        let clickedToggle = false;
        if(toggles) toggles.forEach(t => { if(t.contains(event.target)) clickedToggle = true; });
        
        if (window.innerWidth <= 768 && sidebar && !sidebar.contains(event.target) && !clickedToggle && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            const target = document.getElementById('page-' + pageId);
            if(target) target.classList.add('active');
            
            if(window.innerWidth <= 768) toggleSidebar();

            if (routeMap[pageId]) routeMap[pageId]();
        });
    });

    setupTabs();
    aplicarMascaras();
}