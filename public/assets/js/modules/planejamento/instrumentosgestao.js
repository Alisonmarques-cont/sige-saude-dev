// Importamos a apiFetch e a constante API_BASE
import { apiFetch, API_BASE } from '../../core/api.js';
import { showToast } from '../../core/utils.js';

/**
 * Busca e renderiza a lista de instrumentos de gestão do SUS
 * @param {number} ano - Ano de referência (Padrão: ano atual)
 */
export async function buscarInstrumentosGestao(ano = new Date().getFullYear()) {
    const grid = document.getElementById('grid_instrumentos');
    
    if (!grid) return;

    grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="ph ph-spinner ph-spin" style="font-size: 2rem;"></i>
            <p style="margin-top: 10px;">Carregando instrumentos de ${ano}...</p>
        </div>
    `;

    try {
        // CORREÇÃO 1: Removido o '/api' do começo. A rota agora será construída corretamente.
        const dados = await apiFetch(`/planejamento/instrumentos/listar?ano=${ano}`);
        
        grid.innerHTML = '';

        if (!dados || dados.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="ph ph-folder-open" style="font-size: 2rem;"></i>
                    <p style="margin-top: 10px;">Nenhum instrumento de gestão encontrado para o ano de ${ano}.</p>
                </div>
            `;
            return;
        }

        dados.forEach(inst => {
            let cardModificador = '';
            let iconModificador = '';
            let badgeClass = '';
            let btnDisabled = '';
            let btnIcon = 'ph-eye';
            let btnText = 'Ver Detalhes';

            switch(inst.status) {
                case 'Vigente':
                case 'Entregue':
                    cardModificador = 'instrumento-card--vigente';
                    iconModificador = 'instrumento-card__icon--primary';
                    badgeClass = 'ativo';
                    break;
                case 'Em Elaboração':
                case 'Aberto':
                    cardModificador = 'instrumento-card--alerta';
                    iconModificador = 'instrumento-card__icon--warning';
                    badgeClass = 'warning';
                    break;
                case 'Aguardando':
                case 'Bloqueado':
                    cardModificador = 'instrumento-card--aguardando';
                    iconModificador = 'instrumento-card__icon--muted';
                    badgeClass = ''; 
                    btnDisabled = 'disabled';
                    btnIcon = 'ph-lock';
                    btnText = 'Bloqueado';
                    break;
                default:
                    cardModificador = 'instrumento-card--aguardando';
                    iconModificador = 'instrumento-card__icon--muted';
            }

            let iconePh = 'ph-file-text';
            if (inst.sigla === 'PMS') iconePh = 'ph-books';
            if (inst.sigla === 'PAS') iconePh = 'ph-calendar-plus';
            if (inst.sigla.includes('Quad')) iconePh = 'ph-chart-line-up';

            let badgeHtml = badgeClass 
                ? `<span class="status-badge ${badgeClass}">${inst.status}</span>`
                : `<span class="status-badge" style="background: var(--bg-hover); color: var(--text-muted);">${inst.status}</span>`;

            const cardHtml = `
                <div class="card instrumento-card ${cardModificador}">
                    <div>
                        <div class="instrumento-card__header">
                            <h4 class="instrumento-card__title">
                                <i class="ph ${iconePh} instrumento-card__icon ${iconModificador}"></i> ${inst.sigla}
                            </h4>
                            ${badgeHtml}
                        </div>
                        <p class="instrumento-card__name">${inst.nome}</p>
                        <div class="instrumento-card__details">
                            <p><strong>Periodicidade:</strong> ${inst.periodicidade}</p>
                            <p><strong>Prazo:</strong> ${inst.prazo_legal}</p>
                        </div>
                    </div>
                    <button class="btn-outline instrumento-card__action" ${btnDisabled} onclick="abrirDetalhesInstrumento(${inst.id})">
                        <i class="ph ${btnIcon}"></i> ${btnText}
                    </button>
                </div>
            `;
            
            grid.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error('Erro no JS ao buscar instrumentos:', error);
        grid.innerHTML = '<p style="color: red; grid-column: 1 / -1; text-align: center;">Ocorreu um erro ao comunicar com o servidor.</p>';
        showToast('Falha ao carregar Instrumentos de Gestão', 'error');
    }
}

window.abrirDetalhesInstrumento = function(id) {
    showToast(`Visualização do instrumento #${id} em desenvolvimento.`, 'info');
}

window.buscarInstrumentosGestao = buscarInstrumentosGestao;

// =========================================================================
// Modal e Acções de CRUD
// =========================================================================

// Para criar um novo registo, garantimos que a modal está limpa
window.abrirModalNovoInstrumento = function() {
    const modal = document.getElementById('modal_novo_instrumento');
    if(modal) {
        document.getElementById('form_novo_instrumento').reset();
        document.getElementById('instrumento_id').value = ''; // Garante que não há ID
        document.getElementById('modal_instrumento_title').innerText = 'Novo Instrumento de Gestão';
        modal.style.display = 'flex';
    }
}

// Para editar, procuramos os dados, preenchemos a modal e só depois abrimos
window.abrirDetalhesInstrumento = async function(id) {
    try {
        const response = await apiFetch(`/planejamento/instrumentos/detalhes?id=${id}`);
        
        if (response && response.success) {
            const data = response.data;
            const form = document.getElementById('form_novo_instrumento');
            
            // Preenche o formulário com os dados do banco
            document.getElementById('instrumento_id').value = data.id;
            form.elements['sigla'].value = data.sigla;
            form.elements['nome'].value = data.nome;
            form.elements['periodicidade'].value = data.periodicidade;
            form.elements['ano_referencia'].value = data.ano_referencia;
            form.elements['prazo_legal'].value = data.prazo_legal;
            form.elements['data_limite'].value = data.data_limite || '';
            form.elements['status'].value = data.status;

            // Muda o título e abre a modal
            document.getElementById('modal_instrumento_title').innerText = 'Editar Instrumento de Gestão';
            document.getElementById('modal_novo_instrumento').style.display = 'flex';
        } else {
            showToast(response?.error || 'Erro ao carregar detalhes.', 'error');
        }
    } catch (error) {
        console.error('Erro ao buscar instrumento:', error);
        showToast('Falha na comunicação ao abrir detalhes.', 'error');
    }
}

window.fecharModalNovoInstrumento = function() {
    const modal = document.getElementById('modal_novo_instrumento');
    if(modal) {
        modal.style.display = 'none';
        document.getElementById('form_novo_instrumento').reset();
    }
}

window.salvarInstrumento = async function(event) {
    event.preventDefault(); 

    const form = document.getElementById('form_novo_instrumento');
    const formData = new FormData(form);
    const btnSalvar = document.getElementById('btn_salvar_instrumento');

    // UX: Estado de Loading
    const textoOriginal = btnSalvar.innerHTML;
    btnSalvar.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Guardando...';
    btnSalvar.disabled = true;

    // LÓGICA DE ARQUITETURA: Descobre para qual rota enviar (Create ou Update)
    const id = formData.get('id');
    const endpoint = id ? '/planejamento/instrumentos/atualizar' : '/planejamento/instrumentos/salvar';

    try {
        const res = await fetch(API_BASE + endpoint, {
            method: 'POST',
            body: formData 
        });

        const response = await res.json();

        if (response && response.success) {
            showToast(response.message || 'Operação realizada com sucesso!', 'success');
            fecharModalNovoInstrumento();
            
            // Recarrega o grid para refletir a nova alteração imediatamente
            const ano = formData.get('ano_referencia') || new Date().getFullYear();
            buscarInstrumentosGestao(ano); 
        } else {
            showToast(response.error || 'Erro ao guardar.', 'error');
        }
    } catch (error) {
        console.error('Erro na submissão:', error);
        showToast('Falha na comunicação com o servidor.', 'error');
    } finally {
        btnSalvar.innerHTML = textoOriginal;
        btnSalvar.disabled = false;
    }
}