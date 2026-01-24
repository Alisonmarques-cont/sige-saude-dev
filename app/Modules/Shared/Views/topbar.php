<div class="topbar-actions">
    <div class="notification-wrapper">
        <button class="btn-icon notification-icon" onclick="document.getElementById('dropdown_alertas').classList.toggle('show')">
            <i class="ph ph-bell"></i>
            <span id="badge_alertas" class="notification-badge" style="display:none">0</span>
        </button>
        
        <div id="dropdown_alertas" class="dropdown-menu-alertas">
            <div class="dropdown-header">Notificações</div>
            <ul id="lista_alertas_global">
                <li class="alerta-empty">Carregando...</li>
            </ul>
        </div>
    </div>

    <div class="user-profile">
        </div>
</div>
<div class="mobile-header-bar">
    <div style="font-weight:700; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
        <i class="ph ph-first-aid-kit" style="font-size:1.4rem"></i> Sige Saúde
    </div>
    <button class="mobile-toggle" onclick="toggleSidebar()"><i class="ph ph-list"></i></button>
</div>