<section class="page" id="page-planejamento">
    <div class="header">
        <h1>Planejamento & Gestão</h1>
    </div>

    <div class="tabs" style="margin-bottom: 20px; border-bottom: 1px solid var(--border);">
        <button class="tab-link active" onclick="alternarAbaPlanejamento('aba_plan_visao', this)">
            <i class="ph ph-chart-pie-slice"></i> Visão Geral
        </button>
        <button class="tab-link" onclick="alternarAbaPlanejamento('aba_plan_protocolos', this)">
            <i class="ph ph-magnifying-glass"></i> Consulta de Protocolos
        </button>
    </div>

    <div id="aba_plan_visao" class="tab-content-plan active">
        <div class="card">
            <h3>Resumo Orçamentário</h3>
            <p style="color:var(--text-muted)">Em desenvolvimento...</p>
        </div>
    </div>

    <div id="aba_plan_protocolos" class="tab-content-plan" style="display:none">
        <div class="card">
            <div class="form-row" style="align-items: flex-end; gap: 15px;">
                <div class="form-group" style="flex:1">
                    <label>Nº Protocolo</label>
                    <input type="text" id="filtro_proto_numero" class="input-modern" placeholder="Digite o número...">
                </div>
                <div class="form-group" style="flex:1">
                    <label>Data Início</label>
                    <input type="date" id="filtro_proto_inicio" class="input-modern">
                </div>
                <div class="form-group" style="flex:1">
                    <label>Data Fim</label>
                    <input type="date" id="filtro_proto_fim" class="input-modern">
                </div>
                <div class="form-group" style="flex:0">
                    <button class="btn-primary" onclick="buscarProtocolos()">
                        <i class="ph ph-magnifying-glass"></i> Buscar
                    </button>
                </div>
            </div>
        </div>

        <div class="card" style="margin-top:20px">
            <div class="table-wrapper">
                <table class="data-table" id="tabela_protocolos">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Protocolo</th>
                            <th>Credor / Interessado</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="tabela_protocolos_corpo">
                        <tr><td colspan="6" class="text-center text-muted">Utilize os filtros para buscar.</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<script type="module" src="assets/js/modules/planejamento.js"></script>