<section class="page active" id="page-dashboard">
    <div class="header">
        <div>
            <h1>Visão Geral</h1>
            <p style="color: var(--text-muted); margin-top: 4px;">Bem-vindo ao painel de controle financeiro.</p>
        </div>
        
        <div style="display:flex; align-items:center; gap:12px;">
            <div class="status-badge" style="font-size: 0.9rem; padding: 8px 16px; background: #fff; border: 1px solid var(--border); color: var(--text-main);">
                <i class="ph ph-calendar-blank"></i> <span id="current_date">Carregando...</span>
            </div>

            <div class="dash-notification-wrapper">
                <button class="btn-dash-bell" id="btn_dash_alertas" onclick="toggleDashAlertas()" title="Ver Alertas">
                    <i class="ph-fill ph-bell"></i>
                    <span class="dash-badge" id="badge_dash_alertas" style="display:none">0</span>
                </button>
                
                <div class="dash-dropdown" id="dropdown_dash_alertas">
                    <div class="dash-dropdown-header">
                        <span>Alertas Pendentes</span>
                        <i class="ph ph-x" onclick="toggleDashAlertas()" style="cursor:pointer; opacity:0.6"></i>
                    </div>
                    <div class="dash-dropdown-body" id="lista_dash_alertas">
                        </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="saldo-grid">
        <div class="saldo-item">
            <div class="saldo-label">Receitas Totais ↗</div>
            <div class="saldo-valor positivo" id="dash_ent">R$ 0,00</div>
        </div>
        <div class="saldo-item">
            <div class="saldo-label">Despesas Empenhadas ↘</div>
            <div class="saldo-valor negativo" id="dash_sai">R$ 0,00</div>
        </div>
        <div class="saldo-item saldo-destaque">
            <div class="saldo-label">Saldo Disponível</div>
            <div class="saldo-valor" id="dash_res" style="color: var(--accent);">R$ 0,00</div>
        </div>
    </div>

    <div class="card" style="margin-top: 24px;">
        <h4><i class="ph ph-bank"></i> Saldos Bancários</h4>
        <div id="lista_saldos_contas" class="saldo-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px; margin-top: 15px;">
            <p class="text-muted">Carregando contas...</p>
        </div>
    </div>

    <div class="card">
        <h4><i class="ph ph-chart-bar"></i> Saldo por Programa</h4>
        <div id="chart_programas" style="min-height: 350px;"></div>
    </div>
</section>