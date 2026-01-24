// public/assets/js/core/api.js

// Define a URL base automaticamente (local ou produção) e EXPORTA para uso em outros módulos
export const API_BASE = window.location.pathname.includes('/public') 
    ? window.location.origin + window.location.pathname.split('/public')[0] + '/public/api'
    : window.location.origin + '/api';

/**
 * Realiza uma requisição GET para a API
 */
export async function apiFetch(endpoint) {
    try {
        const res = await fetch(API_BASE + endpoint);
        const text = await res.text(); 

        try {
            const json = JSON.parse(text);
            
            if(!res.ok) {
                console.error("API Server Error:", json.message || json);
                if(res.status === 500) alert("Erro no Servidor: " + (json.message || "Erro desconhecido"));
                return null;
            }
            return json;
        } catch(e) {
            console.error("API Invalid JSON:", text);
            return null;
        }
    } catch (e) { 
        console.error("Network/Fetch Error:", e); 
        return null; 
    }
}

/**
 * Realiza uma requisição POST para a API
 */
export async function apiPost(endpoint, data) {
    try {
        const res = await fetch(API_BASE + endpoint, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(data)
        });
        
        const text = await res.text();
        
        try {
            return JSON.parse(text);
        } catch(e) {
            console.error("API POST Invalid JSON:", text);
            return {status: 'error', message: 'Resposta inválida do servidor'};
        }
    } catch (e) { 
        return {status:'error', message: e.toString()}; 
    }
}