<style>
    /* Altura fixa para o corpo do modal evitar "pulos" ao trocar de aba */
    #modal_empenho_overlay .modal-body {
        min-height: 480px; 
        display: flex;
        flex-direction: column;
    }
    
    /* Animação suave na troca de abas */
    .modal-tab-content {
        flex: 1;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>

<section class="page" id="page-empenhos">
    <div class="header">
        <h1>Gestão Financeira</h1>
        <button id="btn_novo_movimento" class="btn-primary" onclick="abrirModalEmpenho()"><i class="ph ph-plus"></i> Novo Lançamento</button>
    </div>
    
    <div class="card">
        <div class="view-selector">
            <button id="btn_view_despesas" class="view-btn active" onclick="mudarVisaoMov('despesas')">Despesas</button>
            <button id="btn_view_receitas" class="view-btn" onclick="mudarVisaoMov('receitas')">Receitas</button>
        </div>

        <div class="form-row" id="area_filtros" style="background:var(--bg-body); padding:20px; border-radius:8px; margin-bottom:24px; border:1px solid var(--border); align-items: flex-end;">
            <div class="form-group" style="flex:2">
                <label>Filtrar por Programa / Fonte</label>
                <select id="filtro_emp_programa" class="input-modern" onchange="carregarTabelaEmpenhos()">
                    <option value="todos">Todos os Programas</option>
                </select>
            </div>
            <div class="form-group" style="flex:0">
                <button id="btn_filtrar_mov" class="btn-secondary" onclick="carregarTabelaEmpenhos()"><i class="ph ph-arrows-clockwise"></i> Atualizar</button>
            </div>
        </div>

        <div class="table-wrapper" id="wrapper_despesas">
            <table class="data-table" id="tabela_empenhos">
                <thead><tr><th>Vencimento</th><th>Credor</th><th>Descrição</th><th>Valor</th><th>Status</th><th>Ação</th></tr></thead>
                <tbody id="tabela_empenhos_corpo"></tbody>
            </table>
        </div>

        <div class="table-wrapper hidden" id="wrapper_receitas">
            <table class="data-table" id="tabela_receitas">
                <thead><tr><th>Data</th><th>Programa</th><th>Conta</th><th>Descrição</th><th>Valor</th><th>Ação</th></tr></thead>
                <tbody id="tabela_receitas_corpo"></tbody>
            </table>
        </div>
    </div>
</section>

<section class="page" id="page-lancamentos">
    <div class="header"><h1>Extrato Bancário</h1></div>
    <div class="card">
        <div class="form-row" style="align-items: flex-end;">
            <div class="form-group" style="flex:2">
                <label>Conta Bancária</label>
                <select id="filtro_lanc_conta" class="input-modern" onchange="carregarDadosAcompanhamento()">
                    <option value="">Selecione uma conta para ver o Saldo...</option>
                </select>
            </div>
            <div class="form-group" style="flex:2">
                <label>Programa</label>
                <select id="filtro_lanc_programa" class="input-modern" onchange="carregarDadosAcompanhamento()"><option value="">Todos</option></select>
            </div>
            <div class="form-group"><label>Início</label><input type="date" id="filtro_lanc_data_inicio" class="input-modern"></div>
            <div class="form-group"><label>Fim</label><input type="date" id="filtro_lanc_data_fim" class="input-modern"></div>
            <div class="form-group" style="flex:0"><button class="btn-secondary" onclick="carregarDadosAcompanhamento()">Filtrar</button></div>
        </div>
    </div>
    <div class="card">
        <div class="table-wrapper">
            <table class="data-table" id="tabela_lancamentos">
                <thead><tr><th>Data</th><th>Movimento</th><th>Descrição</th><th>Valor</th><th>Saldo</th></tr></thead>
                <tbody id="tabela_lancamentos_corpo"></tbody>
            </table>
        </div>
    </div>
</section>

<section class="page" id="page-contas-fornecedores">
    <div class="header">
        <h1>Contas de Fornecedores</h1>
        <div class="status-badge warning" style="font-weight:500"><i class="ph ph-eye"></i> Modo Consulta</div>
    </div>
    <div class="card">
        <div class="form-group">
            <label>Buscar Fornecedor</label>
            <input class="input-modern" placeholder="Digite o nome ou CNPJ..." onkeyup="carregarContasFornecedores(this.value)">
        </div>
        <div class="table-wrapper" style="margin-top:20px">
            <table class="data-table" id="tabela_contas_fornecedores">
                <thead>
                    <tr>
                        <th style="width:30%">Fornecedor</th>
                        <th style="width:20%">Contato</th>
                        <th>Contas Bancárias Cadastradas</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <p style="margin-top:15px; font-size:0.85rem; color:var(--text-muted); text-align:center;">
            <i class="ph ph-info"></i> Para adicionar ou editar contas, acesse o menu <b>Configurações > Fornecedores</b>.
        </p>
    </div>
</section>

<section class="page" id="page-livro-diario">
    <div class="header">
        <h1>Livro Diário</h1>
        <button class="btn-secondary" onclick="imprimirLivroDiario()">
            <i class="ph ph-printer"></i> Imprimir Relatório
        </button>
    </div>
    
    <div class="card">
        <div class="form-row" style="margin-bottom: 20px; align-items: flex-end;">
            <div class="form-group" style="flex:1">
                <label>Conta Bancária</label>
                <select id="filtro_livro_conta" class="input-modern" onchange="carregarLivroDiario()">
                    <option value="">Todas</option>
                </select>
            </div>
            <div class="form-group"><label>Início</label><input type="date" id="filtro_livro_inicio" class="input-modern"></div>
            <div class="form-group"><label>Fim</label><input type="date" id="filtro_livro_fim" class="input-modern"></div>
            <div class="form-group" style="flex:0"><button class="btn-secondary" onclick="carregarLivroDiario()">Filtrar</button></div>
        </div>

        <div class="table-wrapper">
            <table class="data-table" id="tabela_livro">
                <thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Valor</th><th>Saldo (Projetado)</th><th>Status</th></tr></thead>
                <tbody id="tabela_livro_corpo"></tbody>
            </table>
        </div>
    </div>
</section>

<div class="modal-overlay" id="modal_empenho_overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Dados do Empenho</h3>
            <button class="modal-close" onclick="fecharModal('modal_empenho_overlay')"><i class="ph ph-x"></i></button>
        </div>
        
        <div class="modal-body">
            <input type="hidden" id="emp_id">

            <div class="tabs" style="margin-bottom: 20px; border-bottom: 1px solid var(--border);">
                <button class="tab-link active" onclick="alternarAbaEmpenho('aba_emp_cadastral', this)">
                    <i class="ph ph-identification-card"></i> 1. Cadastral
                </button>
                <button class="tab-link" onclick="alternarAbaEmpenho('aba_emp_orcamentaria', this)">
                    <i class="ph ph-files"></i> 2. Orçamentária
                </button>
                <button class="tab-link" onclick="alternarAbaEmpenho('aba_emp_financeira', this)">
                    <i class="ph ph-currency-dollar"></i> 3. Financeira
                </button>
            </div>

            <div id="aba_emp_cadastral" class="modal-tab-content active">
                <div class="form-row">
                    <div class="form-group">
                        <label>Protocolo (Automático)</label>
                        <input type="text" id="emp_protocolo" class="input-modern" placeholder="000/202X">
                    </div>
                    <div class="form-group">
                        <label>Data do Protocolo</label>
                        <input type="date" id="emp_data_protocolo" class="input-modern">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Data de Emissão</label>
                        <input type="date" id="emp_data_emissao" class="input-modern">
                    </div>
                    <div class="form-group">
                        <label>Nota Fiscal</label>
                        <input type="text" id="emp_nota_fiscal" class="input-modern" placeholder="Nº da NF">
                    </div>
                </div>

                <div class="form-group">
                    <label>Origem da Despesa</label>
                    <select id="emp_origem" class="input-modern" onchange="toggleOrigemEmp()">
                        <option value="Direta">Compra Direta / Outros</option>
                        <option value="Contrato">Vinculado a Contrato</option>
                    </select>
                </div>

                <div class="form-group">
                    <div id="div_emp_fornecedor">
                        <label>Fornecedor (Credor)</label>
                        <select id="emp_fornecedor_select" class="input-modern">
                            <option value="">Carregando...</option>
                        </select>
                    </div>
                    <div id="div_emp_contrato" class="hidden">
                        <label>Selecione o Contrato</label>
                        <select id="emp_contrato" class="input-modern">
                            <option value="">Carregando...</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Histórico / Descrição</label>
                    <textarea id="emp_descricao" class="input-modern" rows="2" placeholder="Descreva os detalhes da despesa..."></textarea>
                </div>
            </div>

            <div id="aba_emp_orcamentaria" class="modal-tab-content" style="display:none">
                <div class="form-group">
                    <label>Programa / Fonte de Recurso</label>
                    <select id="emp_programa" class="input-modern"></select>
                </div>
                
                <div class="form-group" id="div_emp_elemento">
                    <label>Elemento de Despesa (Natureza)</label>
                    <input id="emp_elemento" class="input-modern" placeholder="Ex: 3.3.90.30 - Material de Consumo">
                </div>
            </div>

            <div id="aba_emp_financeira" class="modal-tab-content" style="display:none">
                <div class="form-row">
                    <div class="form-group">
                        <label>Data de Vencimento</label>
                        <input type="date" id="emp_data_vencimento" class="input-modern">
                    </div>
                    <div class="form-group">
                        <label>Valor Total</label>
                        <input type="text" id="emp_valor" class="input-modern mask-money" placeholder="R$ 0,00" style="font-weight:bold; color:var(--danger)">
                    </div>
                </div>

                <div class="form-group">
                    <label>Conta Bancária (Fonte Pagadora)</label>
                    <select id="emp_conta_bancaria" class="input-modern"></select>
                    <small style="color:var(--text-muted)">Conta de onde sairá o recurso financeiro.</small>
                </div>
            </div>

        </div>
        
        <div class="modal-footer" style="text-align:right; margin-top:20px; border-top: 1px solid var(--border); padding-top: 15px;">
            <button class="btn-secondary" onclick="fecharModal('modal_empenho_overlay')" style="margin-right: 10px;">Cancelar</button>
            <button class="btn-primary" onclick="salvarEmpenho()">Confirmar Lançamento</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="modal_receita_overlay">
    <div class="modal-content">
        <div class="modal-header"><h3>Dados da Receita</h3><button class="modal-close" onclick="fecharModal('modal_receita_overlay')"><i class="ph ph-x"></i></button></div>
        <div class="modal-body">
            <input type="hidden" id="rec_id">
            <div class="form-group"><label>Programa</label><select id="rec_programa" class="input-modern"></select></div>
            <div class="form-row">
                <div class="form-group"><label>Data</label><input type="date" id="rec_data" class="input-modern"></div>
                <div class="form-group"><label>Conta</label><select id="rec_conta" class="input-modern"></select></div>
            </div>
            <div class="form-group"><label>Valor</label><input id="rec_valor" class="input-modern mask-money"></div>
            <div class="form-group"><label>Descrição</label><input id="rec_desc" class="input-modern"></div>
        </div>
        <div class="modal-footer" style="text-align:right; margin-top:20px;">
            <button class="btn-primary" onclick="salvarReceita()">Salvar Receita</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="modal_lancamento_overlay">
    <div class="modal-content">
        <div class="modal-header"><h3>Lançamento Manual</h3><button class="modal-close" onclick="fecharModal('modal_lancamento_overlay')"><i class="ph ph-x"></i></button></div>
        <div class="modal-body">
            <select id="lanc_tipo" class="input-modern"><option value="Receita">Receita</option><option value="Despesa">Despesa</option></select><br><br>
            <select id="lanc_programa" class="input-modern"></select><br><br>
            <input type="date" id="lanc_data" class="input-modern"><br><br>
            <input id="lanc_valor" class="input-modern mask-money" placeholder="Valor"><br><br>
            <input id="lanc_descricao" class="input-modern" placeholder="Descrição"><br><br>
            <input id="lanc_documento" class="input-modern" placeholder="Nº Documento">
        </div>
        <div class="modal-footer" style="text-align:right; margin-top:20px;"><button class="btn-primary" onclick="salvarLancamento()">Confirmar</button></div>
    </div>
</div>

<div class="modal-overlay" id="modal_pagamento_overlay">
    <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
            <h3>Realizar Pagamento</h3>
            <button class="modal-close" onclick="fecharModal('modal_pagamento_overlay')"><i class="ph ph-x"></i></button>
        </div>
        <div class="modal-body">
            <p style="color:var(--text-muted); margin-bottom:15px">Confirmar a liquidação desta despesa? Isso irá gerar um débito no extrato bancário.</p>
            <input type="hidden" id="pgto_empenho_id">
            <div class="form-group"><label>Data do Pagamento</label><input type="date" id="pgto_data" class="input-modern"></div>
        </div>
        <div class="modal-footer" style="text-align:right; margin-top:20px;">
            <button class="btn-secondary" onclick="fecharModal('modal_pagamento_overlay')" style="margin-right:8px">Cancelar</button>
            <button id="btn_confirma_pgto" class="btn-primary" onclick="confirmarPagamento()">Confirmar Pagamento</button>
        </div>
    </div>
</div>