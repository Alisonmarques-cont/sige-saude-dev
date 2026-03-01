<div class="topbar-actions">
    
    <div class="exercicio-wrapper">
        <i class="ph ph-calendar-blank exercicio-icon"></i>
        <select id="seletor_ano" class="exercicio-select" onchange="mudarAnoExercicio(this.value)">
            <?php 
                $anoAtualSessao = isset($_SESSION['ano_exercicio']) ? $_SESSION['ano_exercicio'] : date('Y');
                $anos = [date('Y')-1, date('Y'), date('Y')+1, date('Y')+2];
                foreach ($anos as $a) {
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

<script>
async function mudarAnoExercicio(ano) {
    try {
        const seletor = document.getElementById('seletor_ano');
        seletor.disabled = true; 
        seletor.style.opacity = '0.5';

        const basePath = window.location.pathname.includes('/public') 
                        ? window.location.origin + window.location.pathname.split('/public')[0] + '/public'
                        : window.location.origin;

        const response = await fetch(basePath + '/api/config/mudar-ano', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ ano: ano })
        });

        const data = await response.json();
        
        if (data.status === 'ok') {
            window.location.reload(); 
        } else {
            alert('Erro: ' + (data.message || 'Desconhecido.'));
            seletor.disabled = false; seletor.style.opacity = '1';
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha na comunicação.');
        document.getElementById('seletor_ano').disabled = false;
        document.getElementById('seletor_ano').style.opacity = '1';
    }
}
</script>