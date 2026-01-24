/**
 * Formata um valor numérico ou string para moeda BRL
 * @param {string|number} v - Valor a ser formatado
 * @returns {string} - Ex: "R$ 1.250,00"
 */
export function formatarMoeda(v) { 
    if(typeof v === 'string' && v.includes('R$')) return v; 
    return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v||0); 
}

/**
 * Formata uma data YYYY-MM-DD para DD/MM/YYYY
 * @param {string} d - Data em formato ISO
 * @returns {string} - Data formatada
 */
export function formatarData(d) { 
    if(!d) return '-'; 
    const [a,m,dd] = d.split('-'); 
    return `${dd}/${m}/${a}`; 
}

/**
 * Exibe um toast de notificação no canto da tela
 * @param {string} msg - Mensagem a ser exibida
 * @param {string} type - 'success' ou 'error'
 */
export function showToast(msg, type = 'success') {
    const el = document.getElementById('toast-message');
    if(el){
        el.textContent = msg;
        el.style.backgroundColor = type === 'error' ? '#ef4444' : '#0f172a';
        el.style.opacity = '1'; 
        el.style.transform = 'translateY(0)';
        
        // Remove automaticamente após 3 segundos
        setTimeout(() => { 
            el.style.opacity = '0'; 
            el.style.transform = 'translateY(100px)'; 
        }, 3000);
    }
}