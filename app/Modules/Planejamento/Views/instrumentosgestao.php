<div id="aba_plan_obrigacoes" class="tab-content-plan" style="display:none">
    
    <div class="plan-instrumentos-header">
        <div>
            <h3>Instrumentos de Gestão do SUS</h3>
            <p class="plan-instrumentos-subtitle">
                Acompanhe os prazos legais para elaboração e envio (LC nº 141/2012 e DigiSUS).
            </p>
        </div>
        <button class="btn-primary" onclick="abrirModalNovoInstrumento()" style="display: none;">
            <i class="ph ph-plus"></i> Novo Registro
        </button>
    </div>

    <div class="plan-instrumentos-grid" id="grid_instrumentos">
        
        <div class="card instrumento-card instrumento-card--vigente">
            <div>
                <div class="instrumento-card__header">
                    <h4 class="instrumento-card__title">
                        <i class="ph ph-books instrumento-card__icon instrumento-card__icon--primary"></i> PMS
                    </h4>
                    <span class="status-badge ativo">Vigente</span>
                </div>
                <p class="instrumento-card__name">Plano Municipal de Saúde</p>
                <div class="instrumento-card__details">
                    <p><strong>Periodicidade:</strong> Quadrienal</p>
                    <p><strong>Prazo:</strong> No 1º ano da gestão.</p>
                </div>
            </div>
            <button class="btn-outline instrumento-card__action">
                <i class="ph ph-eye"></i> Ver Detalhes
            </button>
        </div>

        <div class="card instrumento-card instrumento-card--alerta">
            <div>
                <div class="instrumento-card__header">
                    <h4 class="instrumento-card__title">
                        <i class="ph ph-calendar-plus instrumento-card__icon instrumento-card__icon--warning"></i> PAS
                    </h4>
                    <span class="status-badge warning">Em Elaboração</span>
                </div>
                <p class="instrumento-card__name">Programação Anual de Saúde</p>
                <div class="instrumento-card__details">
                    <p><strong>Periodicidade:</strong> Anual</p>
                    <p><strong>Prazo:</strong> Fim do ano anterior à vigência.</p>
                </div>
            </div>
            <button class="btn-outline instrumento-card__action">
                <i class="ph ph-eye"></i> Ver Detalhes
            </button>
        </div>

        <div class="card instrumento-card instrumento-card--alerta">
            <div>
                <div class="instrumento-card__header">
                    <h4 class="instrumento-card__title">
                        <i class="ph ph-file-text instrumento-card__icon instrumento-card__icon--warning"></i> RAG
                    </h4>
                    <span class="status-badge warning">Aberto</span>
                </div>
                <p class="instrumento-card__name">Relatório Anual de Gestão</p>
                <div class="instrumento-card__details">
                    <p><strong>Periodicidade:</strong> Anual</p>
                    <p><strong>Prazo:</strong> Até 30 de março do ano seguinte.</p>
                </div>
            </div>
            <button class="btn-outline instrumento-card__action">
                <i class="ph ph-eye"></i> Ver Detalhes
            </button>
        </div>

        <div class="card instrumento-card instrumento-card--vigente">
            <div>
                <div class="instrumento-card__header">
                    <h4 class="instrumento-card__title">
                        <i class="ph ph-chart-line-up instrumento-card__icon instrumento-card__icon--primary"></i> 1º Quad.
                    </h4>
                    <span class="status-badge ativo">Entregue</span>
                </div>
                <p class="instrumento-card__name">Relatório Detalhado (RDQA)</p>
                <div class="instrumento-card__details">
                    <p><strong>Periodicidade:</strong> Quadrimestral</p>
                    <p><strong>Prazo:</strong> Até o final de Maio.</p>
                </div>
            </div>
            <button class="btn-outline instrumento-card__action">
                <i class="ph ph-eye"></i> Ver Detalhes
            </button>
        </div>

        <div class="card instrumento-card instrumento-card--aguardando">
            <div>
                <div class="instrumento-card__header">
                    <h4 class="instrumento-card__title">
                        <i class="ph ph-chart-line-up instrumento-card__icon instrumento-card__icon--muted"></i> 2º Quad.
                    </h4>
                    <span class="status-badge" style="background: var(--bg-hover); color: var(--text-muted);">Aguardando</span>
                </div>
                <p class="instrumento-card__name">Relatório Detalhado (RDQA)</p>
                <div class="instrumento-card__details">
                    <p><strong>Periodicidade:</strong> Quadrimestral</p>
                    <p><strong>Prazo:</strong> Até o final de Setembro.</p>
                </div>
            </div>
            <button class="btn-outline instrumento-card__action" disabled>
                <i class="ph ph-lock"></i> Bloqueado
            </button>
        </div>

    </div>
</div>