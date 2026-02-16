<nav class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; background:rgba(255,255,255,0.1); border-radius:6px; display:flex; align-items:center; justify-content:center; color:#fff;">
                <i class="ph-bold ph-first-aid-kit"></i>
            </div>
            <span>Sige Saúde</span>
        </div>
    </div>
    
    <div class="nav-list">
        <a href="#" class="sidebar-link active" data-page="dashboard"><i class="ph ph-squares-four"></i> Dashboard</a>
        
        <div class="nav-item">
            <a href="#" class="sidebar-link" onclick="toggleSubmenu(this)">
                <i class="ph ph-currency-dollar"></i> Financeiro 
                <i class="ph ph-caret-down arrow-icon"></i>
            </a>
            <div class="sidebar-submenu">
                <a href="#" class="sidebar-link" data-page="empenhos">Movimentações</a>
                <a href="#" class="sidebar-link" data-page="lancamentos">Extrato Bancário</a>
                <a href="#" class="sidebar-link" data-page="contas-fornecedores">Contas de Fornecedores</a>
                <a href="#" class="sidebar-link" data-page="livro-diario">Livro Diário</a>
            </div>
        </div>
        
        <a href="#" class="sidebar-link" data-page="contratos"><i class="ph ph-file-text"></i> Contratos</a>
        <a href="#" class="sidebar-link" data-page="planejamento"><i class="ph ph-chart-line-up"></i> Planejamento</a>
        <a href="#" class="sidebar-link" data-page="relatorios"><i class="ph ph-printer"></i> Relatórios</a>
    </div>

    <div class="sidebar-bottom">
        <a href="#" class="sidebar-link" data-page="config"><i class="ph ph-gear"></i> Configurações</a>
        <a href="logout" class="sidebar-link" style="color:#fca5a5; margin-top:5px;"><i class="ph ph-sign-out"></i> Sair</a>
        <div style="margin-top:15px; font-size:0.7rem; opacity:0.5; text-align:center;">Versão Enterprise 2.4</div>
    </div>
</nav>