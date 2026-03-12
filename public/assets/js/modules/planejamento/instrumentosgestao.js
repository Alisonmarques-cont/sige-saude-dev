import { apiFetch } from '../../core/api.js';
import { showToast } from '../../core/utils.js';

/**
 * Busca e renderiza a lista de instrumentos de gestão do SUS
 * @param {number} ano - Ano de referência (Padrão: ano atual)
 */
export async function buscarInstrumentosGestao(ano = new Date().getFullYear()) {
    const grid = document.getElementById('grid_instrumentos');
    
    // Evita erro caso o elemento não exista na DOM
    if (!grid) return;

    // Estado de "Carregando" (Feedback visual para o usuário)
    grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
            <i class="ph ph-spinner ph-spin" style="font-size: 2rem;"></i>
            <p style="margin-top: 10px;">Carregando instrumentos de ${ano}...</p>
        </div>
    `;

    try {
        // Chamada à nossa nova rota de API
        const dados = await apiFetch(`/api/planejamento/instrumentos/listar?ano=${ano}`);
        
        grid.innerHTML = ''; // Limpa o loading

        // Validação caso não existam dados
        if (!dados || dados.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="ph ph-folder-open" style="font-size: 2rem;"></i>
                    <p style="margin-top: 10px;">Nenhum instrumento de gestão encontrado para o ano de ${ano}.</p>
                </div>
            `;
            return;
        }

        // Renderiza cada card dinamicamente
        dados.forEach(inst => {
            // Mapeamento de Estilos baseados na Regra de Negócio (Status)
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
                    badgeClass = ''; // Vamos usar o estilo customizado (cinza) via HTML abaixo
                    btnDisabled = 'disabled';
                    btnIcon = 'ph-lock';
                    btnText = 'Bloqueado';
                    break;
                default:
                    cardModificador = 'instrumento-card--aguardando';
                    iconModificador = 'instrumento-card__icon--muted';
            }

            // Mapeamento visual de Ícones baseado na Sigla
            let iconePh = 'ph-file-text';
            if (inst.sigla === 'PMS') iconePh = 'ph-books';
            if (inst.sigla === 'PAS') iconePh = 'ph-calendar-plus';
            if (inst.sigla.includes('Quad')) iconePh = 'ph-chart-line-up';

            // HTML do Badge
            let badgeHtml = badgeClass 
                ? `<span class="status-badge ${badgeClass}">${inst.status}</span>`
                : `<span class="status-badge" style="background: var(--bg-hover); color: var(--text-muted);">${inst.status}</span>`;

            // HTML do Card (Exatamente o que criamos na View, agora preenchido com as variáveis)
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

// Stub para ação futura do botão "Ver Detalhes"
window.abrirDetalhesInstrumento = function(id) {
    showToast(`Visualização do instrumento #${id} em desenvolvimento.`, 'info');
}

// Expõe a função principal no window para ser chamada externamente (ex: onlick das abas)
window.buscarInstrumentosGestao = buscarInstrumentosGestao;

// =========================================================================
// Modal e Acções de CRUD
// =========================================================================

window.abrirModalNovoInstrumento = function() {
    const modal = document.getElementById('modal_novo_instrumento');
    if(modal) modal.style.display = 'flex'; // O seu CSS base de modals costuma usar flex para centralizar
}

window.fecharModalNovoInstrumento = function() {
    const modal = document.getElementById('modal_novo_instrumento');
    if(modal) {
        modal.style.display = 'none';
        document.getElementById('form_novo_instrumento').reset(); // Limpa o formulário ao fechar
    }
}

window.salvarInstrumento = async function(event) {
    event.preventDefault(); // Impede o refresh da página (comportamento nativo do submit)

    const form = document.getElementById('form_novo_instrumento');
    const formData = new FormData(form);
    const btnSalvar = document.getElementById('btn_salvar_instrumento');

    // UX: Estado de loading no botão
    const textoOriginal = btnSalvar.innerHTML;
    btnSalvar.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Guardando...';
    btnSalvar.disabled = true;

    try {
        const response = await apiFetch('/api/planejamento/instrumentos/salvar', {
            method: 'POST',
            body: formData 
        });

        if (response && response.success) {
            showToast('Instrumento de gestão guardado com sucesso!', 'success');
            fecharModalNovoInstrumento();
            
            // Recarrega o Grid dinamicamente baseando-se no ano atual escolhido (fallback para 2024)
            const ano = formData.get('ano_referencia') || 2024;
            buscarInstrumentosGestao(ano); 
        } else {
            showToast(response.error || 'Erro ao guardar o instrumento.', 'error');
        }
    } catch (error) {
        console.error('Erro na submissão:', error);
        showToast('Falha na comunicação com o servidor.', 'error');
    } finally {
        // Restaura o botão
        btnSalvar.innerHTML = textoOriginal;
        btnSalvar.disabled = false;
    }
}