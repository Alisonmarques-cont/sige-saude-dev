<section class="page" id="page-config">
    <div class="header">
        <h1>Configurações do Sistema</h1>
        <div class="actions">
            <button class="btn-primary" onclick="salvarConfiguracaoAtual()">
                <i class="ph ph-floppy-disk"></i> Salvar Alterações
            </button>
        </div>
    </div>

    <div class="tabs">
        <button class="tab-link active" data-tab="conf-entidade">
            <i class="ph ph-buildings"></i> Entidade
        </button>

        <button class="tab-link" data-tab="conf-pdc">
            <i class="ph ph-tree-structure"></i> Plano de Contas
        </button>

        <button class="tab-link" data-tab="conf-contas">
            <i class="ph ph-bank"></i> Contas Bancárias
        </button>

        <button class="tab-link" data-tab="conf-programas">
            <i class="ph ph-list-bullets"></i> Programas
        </button>
        
        <button class="tab-link" data-tab="conf-seguranca">
            <i class="ph ph-shield-check"></i> Segurança
        </button>
    </div>

    <div id="conf-entidade" class="tab-content active">
        <form id="form-entidade">
            <div class="card">
                <div class="card-header">
                    <h3>Dados da Prefeitura / Órgão</h3>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group" style="flex: 2;">
                            <label>Nome do Órgão</label>
                            <input type="text" id="entidade_nome" class="input-modern" placeholder="Ex: Prefeitura Municipal de Sairé">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>CNPJ</label>
                            <input type="text" id="entidade_cnpj" class="input-modern" placeholder="00.000.000/0001-00">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Cidade</label>
                            <input type="text" id="entidade_cidade" class="input-modern" value="Sairé">
                        </div>
                        <div class="form-group">
                            <label>UF</label>
                            <input type="text" id="entidade_uf" class="input-modern" value="PE" maxlength="2">
                        </div>
                        <div class="form-group">
                            <label>Exercício</label>
                            <input type="number" id="entidade_exercicio" class="input-modern" value="2026">
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3>Endereço e Contato</h3>
                </div>
                <div class="card-body">
                    <div class="form-row">
                        <div class="form-group" style="flex:2">
                            <label>Logradouro</label>
                            <input type="text" id="entidade_logradouro" class="input-modern">
                        </div>
                        <div class="form-group">
                            <label>Telefone</label>
                            <input type="text" id="entidade_telefone" class="input-modern">
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div id="conf-pdc" class="tab-content" style="display: none;">
        <?php include __DIR__ . '/../../Financeiro/Views/plano_contas.php'; ?>
    </div>

    <div id="conf-contas" class="tab-content" style="display: none;">
        <div class="toolbar">
            <button class="btn-secondary" onclick="novaContaBancaria()">
                <i class="ph ph-plus"></i> Nova Conta
            </button>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Banco</th>
                        <th>Agência</th>
                        <th>Conta</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="lista_contas_bancarias">
                    </tbody>
            </table>
        </div>
    </div>

    <div id="conf-programas" class="tab-content" style="display: none;">
        <div class="toolbar">
            <button class="btn-secondary" onclick="novoPrograma()">
                <i class="ph ph-plus"></i> Novo Programa
            </button>
        </div>
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome do Programa</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="lista_programas">
                    </tbody>
            </table>
        </div>
    </div>

    <div id="conf-seguranca" class="tab-content" style="display: none;">
        <div class="card">
            <div class="empty-state">
                <i class="ph ph-lock-key"></i>
                <p>Configurações de usuários e permissões.</p>
                <small class="text-muted">Em desenvolvimento.</small>
            </div>
        </div>
    </div>

</section>