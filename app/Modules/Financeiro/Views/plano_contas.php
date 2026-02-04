<div class="tab-pane-content">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3>Gerenciar Plano de Contas</h3>
        <button class="btn-primary" onclick="abrirModalPlanoContas()">
            <i class="ph ph-plus"></i> Nova Conta
        </button>
    </div>

    <div class="card">
        <div class="table-wrapper">
            <table class="data-table" id="tabela_plano_contas">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Nível</th>
                        <th style="width: 100px;">Ação</th>
                    </tr>
                </thead>
                <tbody id="lista_plano_contas">
                    </tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal-overlay" id="modal_plano_contas">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Conta Contábil</h3>
            <button class="modal-close" onclick="fecharModal('modal_plano_contas')"><i class="ph ph-x"></i></button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="pdc_id">
            <div class="form-row">
                <div class="form-group" style="flex:1">
                    <label>Código</label>
                    <input id="pdc_codigo" class="input-modern" placeholder="Ex: 3.3.90">
                </div>
                <div class="form-group" style="flex:2">
                    <label>Descrição</label>
                    <input id="pdc_descricao" class="input-modern" placeholder="Ex: Material de Consumo">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Tipo</label>
                    <select id="pdc_tipo" class="input-modern">
                        <option value="Despesa">Despesa</option>
                        <option value="Receita">Receita</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Nível</label>
                    <select id="pdc_nivel" class="input-modern">
                        <option value="Analitico">Analítico (Aceita Lançamento)</option>
                        <option value="Sintetico">Sintético (Apenas Título)</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="modal-footer" style="text-align:right; margin-top:20px;">
            <button class="btn-primary" onclick="salvarPlanoContas()">Salvar</button>
        </div>
    </div>
</div>