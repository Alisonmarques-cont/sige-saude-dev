import { apiFetch } from '../../core/api.js';

export async function carregarContasFornecedores(termo = '') {
    const tbl = document.getElementById('tabela_contas_fornecedores');
    if (!tbl) return; 
    
    const container = tbl.querySelector('tbody');
    if(container.innerHTML.trim() === "") container.innerHTML = "<tr><td colspan='3' class='text-center'>Buscando dados...</td></tr>";
    
    const lista = await apiFetch('/financeiro/fornecedores-com-contas?termo=' + termo);
    container.innerHTML = "";

    if(lista && lista.length > 0) {
        lista.forEach(f => {
            let contasHtml = '';
            if(f.contas && f.contas.length > 0) {
                f.contas.forEach(c => {
                    contasHtml += `<div style="font-size:0.9rem; margin-bottom:4px; border-bottom:1px dashed #e2e8f0; padding-bottom:2px;">
                        <span style="font-weight:600; color:var(--primary)">${c.banco}</span> | 
                        Ag: ${c.agencia || '-'} | CC: ${c.conta} 
                        ${c.pix ? `<span style="color:var(--success); font-size:0.8rem">| PIX: ${c.pix}</span>` : ''}
                    </div>`;
                });
            } else {
                contasHtml = '<span style="color:#94a3b8; font-style:italic; font-size:0.85rem">Nenhuma conta cadastrada</span>';
            }

            container.innerHTML += `
                <tr>
                    <td style="vertical-align:top">
                        <div style="font-weight:600; color:var(--text-main); font-size:0.95rem">${f.razao_social}</div>
                        <div style="font-size:0.8rem; color:#64748b; margin-top:2px;">${f.cnpj}</div>
                    </td>
                    <td style="vertical-align:top; font-size:0.9rem">
                        <div><i class="ph ph-phone"></i> ${f.telefone || '-'}</div>
                        <div style="margin-top:2px"><i class="ph ph-envelope-simple"></i> ${f.email || '-'}</div>
                    </td>
                    <td style="vertical-align:top">${contasHtml}</td>
                </tr>
            `;
        });
    } else {
        container.innerHTML = "<tr><td colspan='3' class='text-center' style='padding:30px; color:#94a3b8'>Nenhum fornecedor encontrado.</td></tr>";
    }
}