/**
 * SIGE SAÚDE - Empenhos UI
 * Responsabilidade: Manipulação direta do DOM e elementos visuais.
 */

import { formatarMoeda } from '../../core/utils.js';

export const EmpenhoUI = {
    // Referências de Elementos Principais
    overlay: document.getElementById('modal_empenho_overlay'),
    
    abrirSlide() {
        this.overlay.classList.add('show');
    },

    fecharSlide() {
        this.overlay.classList.remove('show');
    },

    toggleOrigem() {
        const val = document.getElementById('emp_origem').value;
        const divContrato = document.getElementById('div_emp_contrato');
        const divFornecedor = document.getElementById('div_emp_fornecedor');
        
        if(val === 'Contrato') {
            divContrato.classList.remove('hidden');
            divFornecedor.classList.add('hidden');
        } else {
            divContrato.classList.add('hidden');
            divFornecedor.classList.remove('hidden');
        }
    },

    toggleNovoFornecedor(isNovo) {
        document.getElementById('box_select_fornecedor').style.display = isNovo ? 'none' : 'flex';
        document.getElementById('box_novo_fornecedor').style.display = isNovo ? 'flex' : 'none';
        if(!isNovo) document.getElementById('emp_fornecedor_novo').value = '';
    },

    limparFormulario() {
        const campos = ['emp_id', 'emp_valor', 'emp_descricao', 'emp_protocolo', 
                       'emp_data_protocolo', 'emp_nota_fiscal', 'emp_elemento', 'emp_fornecedor_novo'];
        campos.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.value = "";
        });
        this.toggleNovoFornecedor(false);
    },

    // Centraliza a recolha de dados para o Controlador
    getFormData() {
        const valorStr = document.getElementById('emp_valor').value;
        const isNovoAtivo = document.getElementById('box_novo_fornecedor').style.display === 'flex';
        
        return {
            id: document.getElementById('emp_id').value,
            protocolo_entrada: document.getElementById('emp_protocolo').value,
            data_protocolo: document.getElementById('emp_data_protocolo').value,
            data_emissao: document.getElementById('emp_data_emissao').value,
            data_vencimento: document.getElementById('emp_data_vencimento').value,
            nota_fiscal: document.getElementById('emp_nota_fiscal').value,
            descricao: document.getElementById('emp_descricao').value,
            programa_id: document.getElementById('emp_programa').value,
            elemento_despesa: document.getElementById('emp_elemento').value,
            conta_bancaria_id: document.getElementById('emp_conta_bancaria').value,
            tipo_origem: document.getElementById('emp_origem').value,
            contrato_id: document.getElementById('emp_contrato').value,
            // Lógica do credor
            credor_nome: isNovoAtivo 
                ? document.getElementById('emp_fornecedor_novo').value.trim() 
                : document.getElementById('emp_fornecedor_select').value,
            valor_raw: valorStr
        };
    }
};

// Expõe para o escopo global apenas o necessário para os eventos onclick do HTML
window.EmpenhoUI = EmpenhoUI;