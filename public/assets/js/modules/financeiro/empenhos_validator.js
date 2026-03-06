/**
 * SIGE SAÚDE - Empenhos Validator
 * Responsabilidade: Validação de regras de negócio e integridade de dados.
 */

export const EmpenhoValidator = {
    validar(dados) {
        // 1. Limpeza do Valor para Numérico
        let clean = dados.valor_raw ? dados.valor_raw.replace(/[^\d,]/g, '').replace(',', '.') : '';
        const valorNumerico = parseFloat(clean);

        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            return { valido: false, erro: "O Valor Total deve ser maior que zero." };
        }

        if (!dados.programa_id) {
            return { valido: false, erro: "Selecione o Programa / Fonte de Recurso." };
        }

        if (!dados.conta_bancaria_id) {
            return { valido: false, erro: "Selecione a Conta Bancária pagadora." };
        }

        if (dados.tipo_origem === 'Contrato' && !dados.contrato_id) {
            return { valido: false, erro: "Selecione o Contrato vinculado." };
        }

        if (dados.tipo_origem === 'Direta' && !dados.credor_nome) {
            return { valido: false, erro: "Informe o Fornecedor (Credor)." };
        }

        return { valido: true, valorLimpo: valorNumerico };
    }
};