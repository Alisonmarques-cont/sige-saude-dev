import { apiPost } from '../core/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form_login');
    if(!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const btn = document.querySelector('.btn-login');
        const msg = document.getElementById('msg_erro');
        
        btn.disabled = true; 
        btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Verificando...';
        msg.style.display = 'none';
        
        const res = await apiPost('/auth/login', { email, senha });
        
        if (res.status === 'ok') {
            window.location.reload(); 
        } else {
            msg.innerHTML = `<i class="ph-bold ph-warning-circle"></i> ${res.message || "Dados incorretos."}`;
            msg.style.display = 'block';
            btn.disabled = false; 
            btn.innerText = "Acessar Painel";
        }
    });
});