import { apiFetch } from '../core/api.js';
import { showToast } from '../core/utils.js';
import { buscarInstrumentosGestao } from './planejamento/instrumentosgestao.js';

// Função para alternar abas (Exposta no window para funcionar no onclick)
window.alternarAbaPlanejamento = function(abaId, btn) {
    // Esconde todas as abas e remove classe active...
    const conteudos = document.querySelectorAll('.tab-content-plan');
    conteudos.forEach(el => el.style.display = 'none');
    
    const btns = document.querySelectorAll('#page-planejamento .tab-link');
    btns.forEach(b => b.classList.remove('active'));

    const alvo = document.getElementById(abaId);
    if(alvo) alvo.style.display = 'block';
    
    if(btn) btn.classList.add('active');

    // Se a aba selecionada for a de obrigações, dispara o Fetch!
    if (abaId === 'aba_plan_obrigacoes') {
        buscarInstrumentosGestao();
    }
}

// Função de Busca
window.buscarProtocolos = async function() {
    const numero = document.getElementById('filtro_proto_numero').value;
    const inicio = document.getElementById('filtro_proto_inicio').value;
    const fim = document.getElementById('filtro_proto_fim').value;
    const tbody = document.getElementById('tabela_protocolos_corpo');

    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Buscando...</td></tr>';

    // Monta a URL com query params
    const params = new URLSearchParams({
        numero: numero,
        inicio: inicio,
        fim: fim
    });

    // Chama a API (Caminho corrigido para bater com a rota do Router)
    const dados = await apiFetch(`/planejamento/protocolos/buscar?${params.toString()}`);

    tbody.innerHTML = '';

    if (dados && dados.length > 0) {
        dados.forEach(p => {
            const statusClass = p.status === 'Pago' ? 'ativo' : 'warning';
            // Tratamento para valores nulos
            const protocolo = p.protocolo_entrada || '-';
            const data = p.data_formatada || '-';
            
            tbody.innerHTML += `
                <tr>
                    <td>${data}</td>
                    <td style="font-weight:bold; color:var(--primary)">${protocolo}</td>
                    <td>${p.credor}</td>
                    <td>${p.descricao}</td>
                    <td style="font-weight:bold">${p.valor_formatado}</td>
                    <td><span class="status-badge ${statusClass}">${p.status}</span></td>
                </tr>
            `;
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum protocolo encontrado.</td></tr>';
    }
}

console.log("Módulo Planejamento Carregado");