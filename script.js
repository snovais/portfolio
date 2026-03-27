/**
 * Portfólio Sérgio Novais - Engenharia de Computação & IA
 * Script Completo: Integração GitHub + Filtro Dinâmico
 */

const CONFIG = {
    username: 'snovais',
    perPage: 12, // Quantidade de projetos para exibir
    defaultDescription: 'Desenvolvimento técnico em Engenharia de Computação e Inteligência Artificial.'
};

let repositoryCache = [];

/**
 * Inicialização do Sistema
 */
async function initPortfolio() {
    const gridProjetos = document.getElementById('grid-projetos');
    const searchInput = document.getElementById('repo-search');

    if (!gridProjetos) return;

    // 1. Busca dados da API do GitHub
    try {
        gridProjetos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--primary);">Sincronizando com GitHub...</p>`;
        
        const response = await fetch(`https://api.github.com/users/${CONFIG.username}/repos?sort=updated&per_page=${CONFIG.perPage}`);
        
        if (!response.ok) throw new Error("Falha na comunicação com a API");

        repositoryCache = await response.json();
        renderProjects(repositoryCache);

    } catch (error) {
        console.error("Erro ao carregar repositórios:", error);
        gridProjetos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar projetos. Verifique a conexão.</p>`;
    }

    // 2. Configura o Filtro de Busca
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            const filtered = repositoryCache.filter(repo => {
                const name = repo.name.toLowerCase();
                const lang = (repo.language || "").toLowerCase();
                const desc = (repo.description || "").toLowerCase();
                
                return name.includes(searchTerm) || lang.includes(searchTerm) || desc.includes(searchTerm);
            });

            renderProjects(filtered);
        });
    }
}

/**
 * Função de Renderização de Cards
 * Garante que a estrutura do HTML permaneça intacta
 */
function renderProjects(projects) {
    const grid = document.getElementById('grid-projetos');
    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 3rem; opacity: 0.5;">Nenhum repositório corresponde à busca.</p>`;
        return;
    }

    grid.innerHTML = projects.map(repo => {
        // Limpeza do nome (remove hífens para exibição)
        const displayName = repo.name.replace(/-/g, ' ');
        const language = repo.language || 'Deep Learning';
        const description = repo.description || CONFIG.defaultDescription;

        return `
            <div class="repo-card">
                <small>${language}</small>
                <h3>${displayName}</h3>
                <p>${description}</p>
                <a href="${repo.html_url}" target="_blank" class="repo-link">
                    ABRIR REPOSITÓRIO <i class="fas fa-external-link-alt" style="font-size: 0.7rem; margin-left: 5px;"></i>
                </a>
            </div>
        `;
    }).join('');
}

/**
 * Event Listener de Inicialização
 */
document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
    
    // Log de debug para o engenheiro
    console.log("Sistema de Portfólio Sérgio Novais inicializado.");
});
