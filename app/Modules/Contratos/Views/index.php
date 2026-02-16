<section class="page" id="page-contratos">
    <div class="header">
        <div>
            <h1>Gestão de Contratos</h1>
            <p style="color:var(--text-muted); font-size:0.9rem">Acompanhe licitações, atas e vigências contratuais.</p>
        </div>
        <button class="btn-primary" onclick="abrirWizard()">
            <i class="ph-bold ph-plus"></i> Novo Processo
        </button>
    </div>

    <div class="kpi-grid-contratos">
        <div class="kpi-card">
            <div class="kpi-icon blue"><i class="ph-fill ph-files"></i></div>
            <div class="kpi-data">
                <span class="kpi-value" id="kpi_total_contratos">0</span>
                <span class="kpi-label">Contratos Ativos</span>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon orange"><i class="ph-fill ph-warning"></i></div>
            <div class="kpi-data">
                <span class="kpi-value" id="kpi_vencendo">0</span>
                <span class="kpi-label">Vencem em 60 dias</span>
            </div>
        </div>
        <div class="kpi-card">
            <div class="kpi-icon green"><i class="ph-fill ph-money"></i></div>
            <div class="kpi-data">
                <span class="kpi-value" id="kpi_valor_total" style="font-size:1.2rem">R$ 0,00</span>
                <span class="kpi-label">Volume Contratado</span>
            </div>
        </div>
    </div>

    <div class="card" style="margin-top:24px;">
        <div class="form-group">
            <label style="font-weight:600; color:var(--text-main); margin-bottom:8px; display:block">
                <i class="ph ph-magnifying-glass"></i> Filtrar Processos
            </label>
            <input class="input-modern" placeholder="Busque por número do contrato, pregão, fornecedor ou objeto..." onkeyup="carregarPregoes(this.value)">
        </div>
        
        <div id="lista_pregoes_container" style="margin-top:20px; display:flex; flex-direction:column; gap:20px;"></div>
    </div>
</section>