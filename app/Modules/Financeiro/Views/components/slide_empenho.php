<div class="modal-overlay slide-over-layout" id="modal_empenho_overlay">
    <div class="slide-over">
        <div class="slide-over-header">
            <div>
                <h3 style="margin:0; font-size:1.4rem; color:var(--text-main);">Lançamento de Despesa</h3>
                <p style="margin:4px 0 0 0; font-size:0.85rem; color:var(--text-muted);">Preencha os dados em sequência para registrar o empenho.</p>
            </div>
            <button class="modal-close" onclick="window.EmpenhoUI.fecharSlide()" style="position:static;"><i class="ph ph-x"></i></button>
        </div>
        
        <div class="slide-over-body">
            <input type="hidden" id="emp_id">

            <div class="form-section">
                <div class="form-section-title"><i class="ph-fill ph-article"></i> 1. Dados Básicos</div>
                <div class="form-row">
                    <div class="form-group"><label>Protocolo</label><input type="text" id="emp_protocolo" class="input-modern" readonly style="background:#f8fafc"></div>
                    <div class="form-group"><label>Data do Protocolo</label><input type="date" id="emp_data_protocolo" class="input-modern"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Data de Emissão</label><input type="date" id="emp_data_emissao" class="input-modern"></div>
                    <div class="form-group"><label>Nota Fiscal</label><input type="text" id="emp_nota_fiscal" class="input-modern" placeholder="Nº da NF (se houver)"></div>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label>Histórico / Descrição</label>
                    <textarea id="emp_descricao" class="input-modern" rows="3" placeholder="Detalhes da despesa..."></textarea>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section-title"><i class="ph-fill ph-users"></i> 2. Favorecido / Credor</div>
                <div class="form-group">
                    <label>Origem da Despesa</label>
                    <select id="emp_origem" class="input-modern" onchange="window.EmpenhoUI.toggleOrigem()">
                        <option value="Direta">Compra Direta / Lançamento Avulso</option>
                        <option value="Contrato">Despesa Vinculada a um Contrato</option>
                    </select>
                </div>

                <div class="form-group" id="div_emp_fornecedor" style="margin-bottom:0;">
                    <label>Fornecedor (Credor)</label>
                    <div id="box_select_fornecedor" style="display: flex; gap: 10px;">
                        <select id="emp_fornecedor_select" class="input-modern" style="flex: 1;"></select>
                        <button class="btn-secondary" onclick="window.EmpenhoUI.toggleNovoFornecedor(true)" type="button" title="Cadastrar Novo"><i class="ph ph-plus"></i> Novo</button>
                    </div>
                    <div id="box_novo_fornecedor" style="display: none; gap: 10px;">
                        <input type="text" id="emp_fornecedor_novo" class="input-modern" style="flex: 1;" placeholder="Digite a Razão Social do novo fornecedor...">
                        <button class="btn-secondary" onclick="window.EmpenhoUI.toggleNovoFornecedor(false)" type="button" title="Cancelar" style="color: var(--danger); border-color: var(--danger);"><i class="ph ph-x"></i></button>
                    </div>
                </div>

                <div class="form-group hidden" id="div_emp_contrato" style="margin-bottom:0;">
                    <label>Selecione o Contrato</label>
                    <select id="emp_contrato" class="input-modern"></select>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section-title"><i class="ph-fill ph-files"></i> 3. Classificação Orçamentária</div>
                <div class="form-group"><label>Programa / Fonte de Recurso</label><select id="emp_programa" class="input-modern"></select></div>
                <div class="form-group" id="div_emp_elemento" style="margin-bottom:0;"><label>Elemento de Despesa</label><input id="emp_elemento" class="input-modern" placeholder="Ex: 3.3.90.30 - Material de Consumo"></div>
            </div>

            <div class="form-section">
                <div class="form-section-title"><i class="ph-fill ph-currency-dollar"></i> 4. Dados Financeiros</div>
                <div class="form-row">
                    <div class="form-group"><label>Data de Vencimento</label><input type="date" id="emp_data_vencimento" class="input-modern"></div>
                    <div class="form-group"><label>Valor Total</label><input type="text" id="emp_valor" class="input-modern mask-money" placeholder="R$ 0,00" style="font-weight:bold; color:var(--danger); font-size: 1.1rem;"></div>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label>Conta Bancária (Fonte Pagadora)</label>
                    <select id="emp_conta_bancaria" class="input-modern"></select>
                </div>
            </div>
        </div>
        
        <div class="slide-over-footer">
            <button class="btn-secondary" onclick="window.EmpenhoUI.fecharSlide()">Cancelar Lançamento</button>
            <button class="btn-primary" onclick="window.EmpenhoController.salvar()"><i class="ph-bold ph-check"></i> Salvar e Registrar</button>
        </div>
    </div>
</div>