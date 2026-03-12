<div id="aba_plan_obrigacoes" class="tab-content-plan" style="display:none">
    
    <div class="plan-instrumentos-header">
        <div>
            <h3>Instrumentos de Gestão do SUS</h3>
            <p class="plan-instrumentos-subtitle">
                Acompanhe os prazos legais para elaboração e envio (LC nº 141/2012 e DigiSUS).
            </p>
        </div>
        <button class="btn-primary" onclick="abrirModalNovoInstrumento()">
            <i class="ph ph-plus"></i> Novo Registro
        </button>
    </div>

    <div class="plan-instrumentos-grid" id="grid_instrumentos">
        </div>

        <div id="modal_novo_instrumento" class="modal" style="display: none;">
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2 id="modal_instrumento_title">Novo Instrumento de Gestão</h2>
                <button class="close-modal" onclick="fecharModalNovoInstrumento()"><i class="ph ph-x"></i></button>
            </div>
            <div class="modal-body">
                <form id="form_novo_instrumento" onsubmit="salvarInstrumento(event)">
                    
                    <input type="hidden" name="id" id="instrumento_id">

                    <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <div class="form-group" style="flex: 1;">
                            <label>Sigla *</label>
                            <input type="text" name="sigla" class="input-modern" placeholder="Ex: PMS, PAS, RAG..." required>
                        </div>
                        <div class="form-group" style="flex: 2;">
                            <label>Nome do Instrumento *</label>
                            <input type="text" name="nome" class="input-modern" placeholder="Ex: Plano Municipal de Saúde" required>
                        </div>
                    </div>

                    <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <div class="form-group" style="flex: 1;">
                            <label>Periodicidade *</label>
                            <select name="periodicidade" class="input-modern" required>
                                <option value="Quadrienal">Quadrienal</option>
                                <option value="Anual">Anual</option>
                                <option value="Quadrimestral">Quadrimestral</option>
                                <option value="Mensal">Mensal</option>
                            </select>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Ano de Referência *</label>
                            <input type="number" name="ano_referencia" class="input-modern" value="2024" required>
                        </div>
                    </div>

                    <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <div class="form-group" style="flex: 2;">
                            <label>Prazo Legal (Descrição) *</label>
                            <input type="text" name="prazo_legal" class="input-modern" placeholder="Ex: Até o final do mês de Maio" required>
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Data Limite (Opcional)</label>
                            <input type="date" name="data_limite" class="input-modern">
                        </div>
                    </div>

                    <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 25px;">
                        <div class="form-group" style="flex: 1;">
                            <label>Status Inicial *</label>
                            <select name="status" class="input-modern" required>
                                <option value="Aguardando">Aguardando</option>
                                <option value="Em Elaboração">Em Elaboração</option>
                                <option value="Aberto">Aberto</option>
                                <option value="Vigente">Vigente</option>
                                <option value="Entregue">Entregue</option>
                                <option value="Atrasado">Atrasado</option>
                                <option value="Bloqueado">Bloqueado</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 15px; border-top: 1px solid var(--border); padding-top: 15px;">
                        <button type="button" class="btn-outline" onclick="fecharModalNovoInstrumento()">Cancelar</button>
                        <button type="submit" class="btn-primary" id="btn_salvar_instrumento">
                            <i class="ph ph-floppy-disk"></i> Salvar Instrumento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>