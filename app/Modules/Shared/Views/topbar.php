<div class="topbar-actions">
    
    <div class="exercicio-wrapper" style="margin-right: 20px; display: flex; align-items: center; gap: 8px; background: var(--bg-card); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-color);">
        <i class="ph ph-calendar-blank" style="font-size: 1.2rem; color: var(--primary-color);"></i>
        <select id="seletor_ano" onchange="mudarAnoExercicio(this.value)" style="border: none; background: transparent; font-weight: 600; color: var(--text-color); outline: none; cursor: pointer; font-family: inherit;">
            <?php 
                // Resgata o ano da sessão ou o ano real atual do servidor
                $anoAtualSessao = $_SESSION['ano_exercicio'] ?? date('Y');
                $anoAtualReal = date('Y');
                
                // Gera a lista de anos: 1 ano atrás até 2 anos à frente
                for ($a = $anoAtualReal - 1; $a <= $anoAtualReal + 2; $a++) {
                    $selected = ($a == $anoAtualSessao) ? 'selected' : '';
                    echo "<option value='{$a}' {$selected}>Exercício {$a}</option>";
                }
            ?>
        </select>
    </div>
    <div class="notification-wrapper">
        <button class="btn-icon notification-icon" onclick="document.getElementById('dropdown_alertas').classList.toggle('show')">
            <i class="ph ph-bell"></i>
            <span id="badge_alertas" class="notification-badge" style="display:none">0</span>
        </button>
        
        <div id="dropdown_alertas" class="dropdown-menu-alertas">
            <div class="dropdown-header">Notificações</div>
            <ul id="lista_alertas_global">
                <li class="alerta-empty">A carregar...</li>
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

<script>
async function mudarAnoExercicio(ano) {
    try {
        const seletor = document.getElementById('seletor_ano');
        seletor.disabled = true; // Previne múltiplos cliques

        // Identifica a basePath automaticamente (para lidar com o /sige-saude-dev/public)
        const basePath = window.location.pathname.includes('/sige-saude-dev/public') 
                        ? '/sige-saude-dev/public' 
                        : '';

        const response = await fetch(basePath + '/api/config/mudar-ano', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ ano: ano })
        });

        const data = await response.json();
        
        if (data.status === 'ok') {
            // O reload forçará todas as controllers a recalcular os dados com base no novo ano da sessão
            window.location.reload();
        } else {
            alert('Erro ao alterar o exercício: ' + (data.message || 'Erro desconhecido.'));
            seletor.disabled = false;
        }
    } catch (error) {
        console.error('Erro na requisição de mudança de ano:', error);
        alert('Falha na comunicação com o servidor.');
        document.getElementById('seletor_ano').disabled = false;
    }
}
</script>