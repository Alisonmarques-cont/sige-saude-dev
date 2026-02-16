// public/assets/js/modules/contratos.js
import { apiFetch, apiPost } from '../core/api.js';
import { formatarMoeda, formatarData, showToast } from '../core/utils.js';
import { fecharModal } from '../core/ui.js';

// Estado local do módulo
let tempIdLicitacao = null; 
let tempIdAta = null;
let tempIdContrato = null;
let stepAtual = 1;
let dadosWizard = {};

// =============================================================================
// VISUALIZAÇÃO HIERÁRQUICA COM KPIS
// =============================================================================

export async function carregarPregoes(termo = '') {
    const container = document.getElementById('lista_pregoes_container');
    if(!container) return;
    
    // Loading State
    container.innerHTML = "<div style='text-align:center; padding:40px; color:#94a3b8'><i class='ph ph-spinner ph-spin' style='font-size:2rem'></i><br><br>Buscando processos...</div>";
    
    const lista = await apiFetch('/contratos/pregoes/listar?termo=' + termo);
    container.innerHTML = "";

    // Variáveis para KPI
    let kpiTotal = 0;
    let kpiVencendo = 0;
    let kpiValor = 0;

    if(lista && lista.length > 0) {
        lista.forEach(p => {
            let htmlAtas = '';
            
            if(p.atas && p.atas.length > 0) {
                p.atas.forEach(ata => {
                    let htmlContratos = '';
                    
                    if(ata.contratos && ata.contratos.length > 0) {
                        ata.contratos.forEach(c => {
                            // Cálculo de KPI e Vigência
                            kpiTotal++;
                            kpiValor += parseFloat(c.valor_contratado || 0);

                            const hoje = new Date();
                            const inicio = new Date(c.data_assinatura);
                            const fim = new Date(c.data_fim_vigencia);
                            const totalDias = (fim - inicio) > 0 ? (fim - inicio) : 1;
                            const decorrido = hoje - inicio;
                            
                            let percent = (decorrido / totalDias) * 100;
                            if(percent < 0) percent = 0;
                            if(percent > 100) percent = 100;
                            
                            const diasRestantes = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
                            
                            let barClass = 'success';
                            let statusText = `<span style="color:var(--success)">● Vigente</span>`;
                            
                            if(diasRestantes < 0) {
                                barClass = 'danger';
                                statusText = `<span style="color:var(--danger)">● Vencido</span>`;
                            } else if (diasRestantes < 60) {
                                barClass = 'warning'; 
                                statusText = `<span style="color:var(--warning)">● Vence em ${diasRestantes} dias</span>`;
                                kpiVencendo++;
                            }

                            // --- NOVO CÁLCULO DE SALDO ---
                            const valTotal = parseFloat(c.valor_contratado || 0);
                            const valExec = parseFloat(c.valor_executado || 0);
                            const saldo = valTotal - valExec;
                            
                            // Define cor do saldo
                            const corSaldo = saldo < 0 ? 'var(--danger)' : 'var(--success)';

                            // Novo HTML do Card de Contrato
                            htmlContratos += `
                                <div class="contrato-card">
                                    <div class="contrato-info">
                                        <div class="contrato-title">
                                            <i class="ph-fill ph-file-text" style="color:var(--accent)"></i> 
                                            Contrato nº ${c.numero_contrato}
                                        </div>
                                        <div class="contrato-meta">
                                            <span><i class="ph ph-calendar"></i> Ass: ${formatarData(c.data_assinatura)}</span>
                                        </div>
                                    </div>

                                    <div class="contrato-vigencia">
                                        <div class="vigencia-label">
                                            <span>Progresso</span>
                                            <span>${statusText}</span>
                                        </div>
                                        <div class="vigencia-wrapper">
                                            <div class="vigencia-fill ${barClass}" style="width: ${percent}%"></div>
                                        </div>
                                        <div style="text-align:right; font-size:0.75rem; color:#64748b; margin-top:2px;">
                                            Fim: <b>${formatarData(c.data_fim_vigencia)}</b>
                                        </div>
                                    </div>

                                    <div class="contrato-financeiro">
                                        <div style="font-size:0.8rem; color:#64748b; text-transform:uppercase;">Valor Contratado</div>
                                        <div class="contrato-valor">${formatarMoeda(valTotal)}</div>
                                        
                                        <div style="font-size:0.75rem; margin-top:6px; padding-top:4px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center">
                                            <span style="color:var(--text-muted)">Saldo:</span>
                                            <span style="font-weight:700; color:${corSaldo}">${formatarMoeda(saldo)}</span>
                                        </div>
                                    </div>

                                    <div style="display:flex; gap:8px; justify-content:flex-end;">
                                        <button class="btn-icon-small" title="Detalhes" onclick="visualizarContrato(${c.id})"><i class="ph ph-eye"></i></button>
                                        <button class="btn-icon-small" title="Aditivo" onclick="abrirModalAditivo(${c.id})"><i class="ph ph-plus-circle"></i></button>
                                    </div>
                                </div>
                            `;
                        });
                    } else {
                        htmlContratos = '<div style="padding:20px; font-size:0.9rem; color:#94a3b8; font-style:italic; text-align:center; background:#fff">Nenhum contrato ativo para esta Ata.</div>';
                    }

                    htmlAtas += `
                        <div class="ata-container">
                            <div class="ata-header">
                                <div style="display:flex; align-items:center; gap:8px">
                                    <i class="ph-fill ph-scroll" style="color:#64748b"></i> 
                                    <span>Ata nº <b>${ata.numero_ata}</b></span>
                                    <span style="color:#cbd5e1">|</span>
                                    <span>${ata.fornecedor}</span>
                                </div>
                                <div style="display:flex; gap:10px; align-items:center">
                                    <div style="font-size:0.85rem; padding:4px 10px; background:#fff; border-radius:20px; border:1px solid #e2e8f0; font-weight:600">
                                        Reg: ${formatarMoeda(ata.valor_total_registrado)}
                                    </div>
                                    <button class="btn-secondary" style="padding:4px 10px; font-size:0.75rem" onclick="abrirModalNovoContrato(${ata.id})">
                                        <i class="ph-bold ph-plus"></i> Contrato
                                    </button>
                                </div>
                            </div>
                            ${htmlContratos}
                        </div>
                    `;
                });
            } else {
                htmlAtas = `<div style="text-align:center; padding:30px; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1; color:#64748b; margin-top:15px;">
                    <i class="ph ph-folder-dashed" style="font-size:1.5rem"></i>
                    <p style="margin-top:5px">Processo cadastrado. Adicione uma Ata para começar.</p>
                </div>`;
            }

            container.innerHTML += `
            <div class="processo-card">
                <div class="processo-header">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span class="badge-processo"><i class="ph-fill ph-folder"></i> Proc. ${p.processo}</span>
                        <span style="font-weight:600; color:#334155; font-size:0.95rem">Pregão Presencial ${p.pregao || 'N/A'}</span>
                    </div>
                    <div style="display:flex; gap:15px; align-items:center">
                        <div class="processo-valor" title="Valor Estimado">
                            <span style="font-size:0.75rem; color:#94a3b8; font-weight:500; text-transform:uppercase; margin-right:5px;">Estimado</span>
                            ${formatarMoeda(p.valor_estimado)}
                        </div>
                         <button class="btn-secondary" style="padding:6px 12px; font-size:0.8rem" onclick="abrirModalNovaAta(${p.id})">
                            <i class="ph-bold ph-plus"></i> Nova Ata
                         </button>
                    </div>
                </div>
                <div class="processo-body">
                    <div class="objeto-desc">
                        <i class="ph-fill ph-quotes" style="margin-right:8px; color:var(--accent); opacity:0.7"></i> ${p.objeto}
                    </div>
                    ${htmlAtas}
                </div>
            </div>`;
        });
    } else {
        container.innerHTML = `
        <div style="text-align:center; padding:80px 20px; color:#94a3b8;">
            <i class="ph ph-magnifying-glass" style="font-size:3rem; margin-bottom:15px; opacity:0.3"></i>
            <h3>Nenhum processo encontrado</h3>
            <p>Tente buscar por outro número ou crie um novo processo.</p>
        </div>`;
    }

    // Atualiza KPIs na tela
    atualizarKPIs(kpiTotal, kpiVencendo, kpiValor);
}

function atualizarKPIs(total, vencendo, valor) {
    if(document.getElementById('kpi_total_contratos')) document.getElementById('kpi_total_contratos').innerText = total;
    if(document.getElementById('kpi_vencendo')) document.getElementById('kpi_vencendo').innerText = vencendo;
    if(document.getElementById('kpi_valor_total')) document.getElementById('kpi_valor_total').innerText = formatarMoeda(valor);
}

export async function visualizarContrato(idContrato) {
    // Busca detalhes do backend para incluir o saldo calculado
    const contrato = await apiFetch('/contratos/pregoes/listar'); // Idealmente endpoint específico
    // Mas vamos usar o getContrato direto já que implementamos lá também
    const res = await apiFetch('/contratos/pregoes/listar'); // Mantendo lógica original de varredura ou usando endpoint específico se preferir
    // Para simplificar e usar os dados já carregados (ou buscar via ID se necessário):
    
    // Vamos buscar especificamente o contrato
    // Nota: O método visualizarContrato original fazia varredura no cliente. 
    // Podemos melhorar chamando o getContrato atualizado no controller.
    
    const urlParams = new URLSearchParams(window.location.search);
    const detalhe = await apiFetch('/contratos/pregoes/listar'); 
    
    let contratoEncontrado = null;
    if(detalhe) {
        detalhe.forEach(p => {
            if(p.atas) p.atas.forEach(a => {
                if(a.contratos) a.contratos.forEach(c => {
                    if(c.id == idContrato) contratoEncontrado = { ...c, fornecedor: a.fornecedor, processo: p.processo };
                });
            });
        });
    }
    
    if(contratoEncontrado) {
        const valTotal = parseFloat(contratoEncontrado.valor_contratado || 0);
        const valExec = parseFloat(contratoEncontrado.valor_executado || 0);
        const saldo = valTotal - valExec;

        alert(`DETALHES DO CONTRATO\n\nNº Contrato: ${contratoEncontrado.numero_contrato}\nFornecedor: ${contratoEncontrado.fornecedor}\nProcesso: ${contratoEncontrado.processo}\n\nValor Contratado: ${formatarMoeda(valTotal)}\nValor Executado: ${formatarMoeda(valExec)}\nSaldo Restante: ${formatarMoeda(saldo)}\n\nVigência: ${formatarData(contratoEncontrado.data_fim_vigencia)}`);
    } else {
        alert("Carregando detalhes do Contrato #" + idContrato);
    }
}

// =============================================================================
// AÇÕES: NOVA ATA, NOVO CONTRATO, ADITIVOS
// =============================================================================

export function abrirModalNovaAta(idLic) {
    tempIdLicitacao = idLic;
    ['nova_ata_num', 'nova_ata_forn', 'nova_ata_val', 'nova_ata_data'].forEach(i => {
        if(document.getElementById(i)) document.getElementById(i).value = '';
    });
    document.getElementById('modal_nova_ata').classList.add('show');
}

export async function salvarNovaAta() {
    const res = await apiPost('/contratos/salvar_ata', {
        id_licitacao: tempIdLicitacao,
        numero: document.getElementById('nova_ata_num').value,
        fornecedor: document.getElementById('nova_ata_forn').value,
        valor: document.getElementById('nova_ata_val').value,
        validade: document.getElementById('nova_ata_data').value
    });
    if(res.status === 'ok') { 
        showToast("Ata Adicionada!"); 
        fecharModal('modal_nova_ata'); 
        carregarPregoes(); 
    } else alert("Erro: " + res.msg);
}

export function abrirModalNovoContrato(idAta) {
    tempIdAta = idAta;
    ['novo_cont_num', 'novo_cont_data', 'novo_cont_val'].forEach(i => {
        if(document.getElementById(i)) document.getElementById(i).value = '';
    });
    document.getElementById('modal_novo_contrato').classList.add('show');
}

export async function salvarNovoContrato() {
    const res = await apiPost('/contratos/salvar_contrato', {
        id_ata: tempIdAta,
        numero: document.getElementById('novo_cont_num').value,
        data_assinatura: document.getElementById('novo_cont_data').value,
        valor: document.getElementById('novo_cont_val').value
    });
    if(res.status === 'ok') { 
        showToast("Contrato Criado!"); 
        fecharModal('modal_novo_contrato'); 
        carregarPregoes(); 
    } else alert("Erro: " + res.msg);
}

export function abrirModalAditivo(idContrato) {
    tempIdContrato = idContrato;
    document.getElementById('aditivo_valor').value = "";
    document.getElementById('aditivo_data').value = "";
    document.getElementById('modal_aditivo').classList.add('show');
}

export async function salvarAditivo() {
    const d = {
        id_contrato: tempIdContrato,
        nova_vigencia: document.getElementById('aditivo_data').value,
        novo_valor: document.getElementById('aditivo_valor').value
    };
    const res = await apiPost('/api/contratos/salvar_aditivo', d); 
    
    if(res.status === 'ok') {
        showToast("Aditivo Registrado!");
        fecharModal('modal_aditivo');
        carregarPregoes();
    } else {
        alert("Erro: " + (res.msg || "Erro ao salvar aditivo."));
    }
}

// =============================================================================
// WIZARD (CRIAÇÃO PASSO A PASSO)
// =============================================================================

export function abrirWizard() {
    stepAtual = 1;
    dadosWizard = {};
    mostrarPassoWizard(1);
    document.getElementById('modal_wizard_overlay').classList.add('show');
}

export async function proximoPasso() {
    if(stepAtual === 1) {
        const proc = document.getElementById('wiz_processo').value;
        const preg = document.getElementById('wiz_pregao').value;
        const obj = document.getElementById('wiz_objeto').value;
        const valor = document.getElementById('wiz_valor_est').value;
        if(!proc || !obj) return alert("Preencha Processo e Objeto.");
        
        const res = await apiPost('/contratos/salvar_licitacao', {processo:proc, pregao:preg, objeto:obj, valor:valor});
        if(res.status === 'ok') { 
            dadosWizard.id_licitacao = res.id_licitacao; 
            dadosWizard.processo = proc; 
            stepAtual = 2; 
            mostrarPassoWizard(2); 
        } else alert("Erro: " + res.msg);

    } else if(stepAtual === 2) {
        const num = document.getElementById('wiz_ata_num').value;
        const forn = document.getElementById('wiz_ata_forn').value;
        const val = document.getElementById('wiz_ata_val').value;
        const data = document.getElementById('wiz_ata_data').value;
        
        const res = await apiPost('/contratos/salvar_ata', {id_licitacao: dadosWizard.id_licitacao, numero: num, fornecedor: forn, valor: val, validade: data});
        if(res.status === 'ok') { 
            dadosWizard.id_ata = res.id_ata; 
            stepAtual = 3; 
            mostrarPassoWizard(3); 
        } else alert("Erro: " + res.msg);
    }
}

export async function finalizarWizard() {
    const num = document.getElementById('wiz_cont_num').value;
    const data = document.getElementById('wiz_cont_data').value;
    const val = document.getElementById('wiz_cont_val').value;
    
    const res = await apiPost('/contratos/salvar_contrato', {id_ata: dadosWizard.id_ata, numero: num, data_assinatura: data, valor: val});
    if(res.status === 'ok') { 
        showToast("Processo Criado!"); 
        fecharModal('modal_wizard_overlay'); 
        carregarPregoes(); 
    } else alert("Erro: " + res.msg);
}

function mostrarPassoWizard(passo) {
    document.querySelectorAll('.wizard-step').forEach(el => el.style.display = 'none');
    document.getElementById('wiz_step_' + passo).style.display = 'block';
}

// =============================================================================
// INJEÇÃO DE HTML (MODAIS DINÂMICOS)
// =============================================================================

export function verificarEInjetarModaisContratos() {
    const body = document.body;
    
    // 1. Wizard Principal
    if(!document.getElementById('modal_wizard_overlay')) {
        body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="modal_wizard_overlay">
            <div class="modal-content">
                <div class="modal-header"><h3>Novo Processo (Wizard)</h3><button class="modal-close" onclick="fecharModal('modal_wizard_overlay')"><i class="ph ph-x"></i></button></div>
                <div class="modal-body">
                    <div id="wiz_step_1" class="wizard-step">
                        <h4 style="color:var(--accent)">1. Licitação</h4><br>
                        <div class="form-row"><div class="form-group"><label>Nº Processo</label><input id="wiz_processo" class="input-modern"></div><div class="form-group"><label>Pregão</label><input id="wiz_pregao" class="input-modern"></div></div>
                        <div class="form-group"><label>Objeto</label><textarea id="wiz_objeto" class="input-modern" rows="2"></textarea></div>
                        <div class="form-group"><label>Valor Est.</label><input id="wiz_valor_est" class="input-modern mask-money"></div>
                        <div style="text-align:right"><button class="btn-primary" onclick="proximoPasso()">Próximo <i class="ph ph-arrow-right"></i></button></div>
                    </div>
                    <div id="wiz_step_2" class="wizard-step" style="display:none">
                        <h4 style="color:var(--accent)">2. Ata de Registro</h4><br>
                        <div class="form-row"><div class="form-group"><label>Nº Ata</label><input id="wiz_ata_num" class="input-modern"></div><div class="form-group"><label>Validade</label><input type="date" id="wiz_ata_data" class="input-modern"></div></div>
                        <div class="form-group"><label>Fornecedor</label><input id="wiz_ata_forn" class="input-modern"></div>
                        <div class="form-group"><label>Valor Reg.</label><input id="wiz_ata_val" class="input-modern mask-money"></div>
                        <div style="text-align:right"><button class="btn-primary" onclick="proximoPasso()">Próximo <i class="ph ph-arrow-right"></i></button></div>
                    </div>
                    <div id="wiz_step_3" class="wizard-step" style="display:none">
                        <h4 style="color:var(--accent)">3. Primeiro Contrato</h4><br>
                        <div class="form-row"><div class="form-group"><label>Nº Contrato</label><input id="wiz_cont_num" class="input-modern"></div><div class="form-group"><label>Assinatura</label><input type="date" id="wiz_cont_data" class="input-modern"></div></div>
                        <div class="form-group"><label>Valor</label><input id="wiz_cont_val" class="input-modern mask-money"></div>
                        <div style="text-align:right"><button class="btn-primary" onclick="finalizarWizard()">Concluir</button></div>
                    </div>
                </div>
            </div>
        </div>`);
    }

    // 2. Nova Ata Avulsa
    if(!document.getElementById('modal_nova_ata')) {
        body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="modal_nova_ata">
            <div class="modal-content">
                <div class="modal-header"><h3>Adicionar Ata</h3><button class="modal-close" onclick="fecharModal('modal_nova_ata')"><i class="ph ph-x"></i></button></div>
                <div class="modal-body">
                    <div class="form-row"><div class="form-group"><label>Nº Ata</label><input id="nova_ata_num" class="input-modern"></div><div class="form-group"><label>Validade</label><input type="date" id="nova_ata_data" class="input-modern"></div></div>
                    <div class="form-group"><label>Fornecedor</label><input id="nova_ata_forn" class="input-modern"></div>
                    <div class="form-group"><label>Valor Registrado</label><input id="nova_ata_val" class="input-modern mask-money"></div>
                </div>
                <div class="modal-footer" style="text-align:right; margin-top:20px"><button class="btn-primary" onclick="salvarNovaAta()">Salvar Ata</button></div>
            </div>
        </div>`);
    }

    // 3. Novo Contrato Avulso
    if(!document.getElementById('modal_novo_contrato')) {
        body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="modal_novo_contrato">
            <div class="modal-content">
                <div class="modal-header"><h3>Novo Contrato</h3><button class="modal-close" onclick="fecharModal('modal_novo_contrato')"><i class="ph ph-x"></i></button></div>
                <div class="modal-body">
                     <div class="form-row"><div class="form-group"><label>Nº Contrato</label><input id="novo_cont_num" class="input-modern"></div><div class="form-group"><label>Assinatura</label><input type="date" id="novo_cont_data" class="input-modern"></div></div>
                     <div class="form-group"><label>Valor Contratado</label><input id="novo_cont_val" class="input-modern mask-money"></div>
                </div>
                <div class="modal-footer" style="text-align:right; margin-top:20px"><button class="btn-primary" onclick="salvarNovoContrato()">Salvar Contrato</button></div>
            </div>
        </div>`);
    }

    // 4. Modal Aditivo
    if(!document.getElementById('modal_aditivo')) {
        body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="modal_aditivo">
            <div class="modal-content">
                <div class="modal-header"><h3>Novo Aditivo</h3><button class="modal-close" onclick="fecharModal('modal_aditivo')"><i class="ph ph-x"></i></button></div>
                <div class="modal-body">
                    <p style="font-size:0.9rem; color:#666; margin-bottom:15px">O aditivo atualizará a vigência ou o valor do contrato atual.</p>
                    <div class="form-group"><label>Nova Vigência (Opcional)</label><input type="date" id="aditivo_data" class="input-modern"></div>
                    <div class="form-group"><label>Novo Valor Total (Opcional)</label><input id="aditivo_valor" class="input-modern mask-money"></div>
                </div>
                <div class="modal-footer" style="text-align:right; margin-top:20px"><button class="btn-primary" onclick="salvarAditivo()">Aplicar Aditivo</button></div>
            </div>
        </div>`);
    }
}

// =============================================================================
// EXPOSIÇÃO GLOBAL
// =============================================================================
window.carregarPregoes = carregarPregoes;
window.abrirModalNovaAta = abrirModalNovaAta;
window.salvarNovaAta = salvarNovaAta;
window.abrirModalNovoContrato = abrirModalNovoContrato;
window.salvarNovoContrato = salvarNovoContrato;
window.visualizarContrato = visualizarContrato;
window.abrirModalAditivo = abrirModalAditivo;
window.salvarAditivo = salvarAditivo;
window.abrirWizard = abrirWizard;
window.proximoPasso = proximoPasso;
window.finalizarWizard = finalizarWizard;