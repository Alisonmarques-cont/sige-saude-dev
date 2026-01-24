<section class="page" id="page-config">
     <div class="header"><h1>Configurações</h1></div>
     <div class="tabs">
         <button class="tab-link active" data-tab="conf-entidade"><i class="ph ph-buildings"></i> Entidade</button>
         <button class="tab-link" data-tab="conf-contas"><i class="ph ph-bank"></i> Contas</button>
         <button class="tab-link" data-tab="conf-programas"><i class="ph ph-list-bullets"></i> Programas</button>
         <button class="tab-link" data-tab="conf-fornecedores"><i class="ph ph-users"></i> Fornecedores</button>
         <button class="tab-link" data-tab="conf-seguranca"><i class="ph ph-shield-check"></i> Segurança</button>
     </div>

     <div id="conf-entidade" class="tab-content active">
         <div class="card">
            <h4>Dados da Entidade</h4>
            <div class="form-row">
                <div class="form-group" style="flex:1"><label>Nome da Entidade</label><input id="ent_nome" class="input-modern"></div>
                <div class="form-group"><label>CNPJ</label><input id="ent_cnpj" class="input-modern mask-cnpj"></div>
            </div>
            <button class="btn-primary" onclick="salvarEntidade()">Salvar Alterações</button>
         </div>
     </div>
     
     <div id="conf-contas" class="tab-content">
         <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4>Contas Bancárias</h4>
                <button class="btn-primary" onclick="abrirModalContaEnt()"><i class="ph ph-plus"></i> Nova Conta</button>
            </div>
            <div class="table-wrapper" style="margin-top:15px">
                <table class="data-table" id="tabela_contas_ent"><thead><tr><th>Banco</th><th>Conta</th><th>Descrição</th><th>Ação</th></tr></thead><tbody></tbody></table>
            </div>
         </div>
     </div>

     <div id="conf-programas" class="tab-content">
         <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4>Programas e Fontes</h4>
                <button class="btn-primary" onclick="abrirModalNovoPrograma()"><i class="ph ph-plus"></i> Novo Programa</button>
            </div>
            <div class="table-wrapper" style="margin-top:15px">
                <table class="data-table" id="tabela_programas"><thead><tr><th>Nome do Programa</th><th>Tipo Macro</th><th>Ação</th></tr></thead><tbody></tbody></table>
            </div>
         </div>
     </div>

     <div id="conf-fornecedores" class="tab-content">
         <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4>Fornecedores</h4>
                <button class="btn-primary" onclick="abrirModalFornecedor()"><i class="ph ph-plus"></i> Novo Fornecedor</button>
            </div>
            <div class="table-wrapper" style="margin-top:15px">
                <table class="data-table" id="tabela_fornecedores"><thead><tr><th>CNPJ</th><th>Razão Social</th><th>Ação</th></tr></thead><tbody></tbody></table>
            </div>
         </div>
     </div>
     
     <div id="conf-seguranca" class="tab-content">
         <div class="card">
            <h4>Backup e Dados</h4>
            <p class="text-muted">Faça o download de uma cópia de segurança do banco de dados.</p>
            <button class="btn-secondary" onclick="window.open('api/config/backup/criar')"><i class="ph ph-download-simple"></i> Baixar SQL</button>
         </div>
     </div>
</section>

<div class="modal-overlay" id="modal_conta_ent">
    <div class="modal-content">
        <div class="modal-header"><h3>Conta Bancária</h3><button class="modal-close" onclick="fecharModal('modal_conta_ent')"><i class="ph ph-x"></i></button></div>
        <div class="modal-body">
            <input type="hidden" id="conta_ent_id">
            <div class="form-row">
                <div class="form-group"><label>Banco</label><input id="conta_ent_banco" class="input-modern"></div>
                <div class="form-group"><label>Agência</label><input id="conta_ent_ag" class="input-modern"></div>
            </div>
            <div class="form-group"><label>Conta</label><input id="conta_ent_num" class="input-modern"></div>
            <div class="form-group"><label>Descrição</label><input id="conta_ent_desc" class="input-modern"></div>
        </div>
        <div class="modal-footer" style="text-align:right; margin-top:20px;">
            <button class="btn-primary" onclick="salvarContaEnt()">Salvar Conta</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="modal_programa_overlay">
    <div class="modal-content">
        <div class="modal-header"><h3>Novo Programa</h3><button class="modal-close" onclick="fecharModal('modal_programa_overlay')"><i class="ph ph-x"></i></button></div>
        <div class="modal-body">
            <input type="hidden" id="programa_id">
            <div class="form-group"><label>Nome do Programa</label><input id="programa_nome" class="input-modern"></div>
            <div class="form-row">
                <div class="form-group" style="flex:1"><label>Tipo Macro</label><select id="programa_tipo_macro" class="input-modern"><option>Fundo a Fundo</option><option>FPM</option><option>Emenda</option><option>Outros</option></select></div>
                <div class="form-group" style="flex:1"><label>Bloco</label><input id="programa_bloco" class="input-modern"></div>
            </div>
            <div class="form-group"><label>Ação Detalhada</label><input id="programa_acao" class="input-modern"></div>
            <div class="form-group"><label>Portaria</label><input id="programa_portaria" class="input-modern"></div>
        </div>
        <div class="modal-footer" style="text-align:right; margin-top:20px;">
            <button class="btn-primary" onclick="salvarPrograma()">Salvar Programa</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="modal_fornecedor_overlay">
    <div class="modal-content">
        <div class="modal-header"><h3>Fornecedor</h3><button class="modal-close" onclick="fecharModal('modal_fornecedor_overlay')"><i class="ph ph-x"></i></button></div>
        <div class="modal-body">
            <input type="hidden" id="forn_id">
            <div class="form-row">
                <div class="form-group" style="flex:1"><label>CNPJ</label><input id="forn_cnpj" class="input-modern mask-cnpj"></div>
                <div class="form-group" style="flex:2"><label>Razão Social</label><input id="forn_razao" class="input-modern"></div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1"><label>Telefone</label><input id="forn_tel" class="input-modern"></div>
                <div class="form-group" style="flex:1"><label>Email</label><input id="forn_email" class="input-modern"></div>
            </div>
            <div style="border-top:1px solid #eee; padding-top:15px; margin-top:10px;">
                <h4>Conta Bancária</h4>
                <div class="form-row">
                    <div class="form-group"><label>Banco</label><input id="forn_conta_banco" class="input-modern"></div>
                    <div class="form-group"><label>Agência</label><input id="forn_conta_agencia" class="input-modern"></div>
                    <div class="form-group"><label>Conta</label><input id="forn_conta_num" class="input-modern"></div>
                    <div class="form-group" style="flex:0; align-self:end"><button class="btn-secondary" onclick="addContaFornUI()"><i class="ph ph-plus"></i></button></div>
                </div>
                <div id="lista_contas_forn_ui"></div>
            </div>
        </div>
        <div class="modal-footer" style="text-align:right; margin-top:20px;">
            <button class="btn-primary" onclick="salvarFornecedor()">Salvar</button>
        </div>
    </div>
</div>