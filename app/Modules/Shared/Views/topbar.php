<div class="topbar-actions" style="display: flex; align-items: center; justify-content: flex-end;">
    
    <div class="user-profile" onclick="document.getElementById('dropdown_perfil').classList.toggle('show')" style="position: relative; cursor: pointer; display: flex; align-items: center; gap: 10px;">
        
        <div class="avatar" style="width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem;">
            <?php echo isset($_SESSION['user_nome']) ? strtoupper(substr($_SESSION['user_nome'], 0, 1)) : 'U'; ?>
        </div>
        
        <div class="user-info" style="display: flex; flex-direction: column;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">
                <?php echo isset($_SESSION['user_nome']) ? explode(' ', $_SESSION['user_nome'])[0] : 'Usuário'; ?>
            </span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Administrador</span>
        </div>
        
        <i class="ph ph-caret-down" style="color: var(--text-muted); font-size: 0.8rem; margin-left: 5px;"></i>

        <div id="dropdown_perfil" class="dropdown-menu-alertas" style="display: none; position: absolute; right: 0; top: 130%; width: 200px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-md); z-index: 1000; overflow: hidden;">
            <ul style="list-style: none; margin: 0; padding: 0;">
                <li style="border-bottom: 1px solid var(--border);">
                    <a href="#" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; color: var(--text-main); text-decoration: none; font-size: 0.9rem; transition: background 0.2s;">
                        <i class="ph ph-user" style="font-size: 1.1rem; color: var(--primary);"></i> Meu Perfil
                    </a>
                </li>
                <li>
                    <?php 
                        // Calcula dinamicamente o caminho base para não quebrar o logout
                        $basePath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
                        $basePath = ($basePath === '/') ? '' : $basePath;
                    ?>
                    <a href="<?php echo $basePath; ?>/logout" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; color: var(--danger); text-decoration: none; font-size: 0.9rem; transition: background 0.2s;">
                        <i class="ph ph-sign-out" style="font-size: 1.1rem;"></i> Sair do Sistema
                    </a>
                </li>
            </ul>
        </div>
    </div>

</div>

<div class="mobile-header-bar">
    <div style="font-weight:700; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
        <i class="ph ph-first-aid-kit" style="font-size:1.4rem"></i> Sige Saúde
    </div>
    <button class="mobile-toggle" onclick="toggleSidebar()"><i class="ph ph-list"></i></button>
</div>

<script>
document.addEventListener('click', function(event) {
    const perfilDropdown = document.getElementById('dropdown_perfil');
    
    // Fecha o perfil se clicar fora dele
    if (perfilDropdown && perfilDropdown.classList.contains('show') && !event.target.closest('.user-profile')) {
        perfilDropdown.classList.remove('show');
    }
});
</script>