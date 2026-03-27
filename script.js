const GITHUB_USER = 'snovais';
let repositoryCache = [];

async function initialize() {
    const gridProjetos = document.getElementById('grid-projetos');
    const searchInput = document.getElementById('repo-search');
    const logoHome = document.getElementById('logo-home');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=15`);
        repositoryCache = await response.json();
        render(repositoryCache);
    } catch (err) {
        if(gridProjetos) gridProjetos.innerHTML = `<p>Sincronização falhou.</p>`;
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = repositoryCache.filter(repo => 
                repo.name.toLowerCase().includes(term) || 
                (repo.language && repo.language.toLowerCase().includes(term))
            );
            render(filtered);
        });
    }

    // LOGICA DE RESET
    if (logoHome) {
        logoHome.addEventListener('click', (e) => {
            if (searchInput) searchInput.value = ''; // Limpa busca
            render(repositoryCache); // Restaura todos os cards
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta ao topo
        });
    }
}

function render(data) {
    const grid = document.getElementById('grid-projetos');
    if (!grid) return;

    grid.innerHTML = data.map(repo => `
        <div class="repo-card">
            <small style="color:var(--primary); font-weight:800; font-size:0.65rem; text-transform:uppercase;">${repo.language || 'Technical Project'}</small>
            <h3>${repo.name.replace(/-/g, ' ')}</h3>
            <p>${repo.description || 'Engenharia de Computação focada em inovação e IA.'}</p>
            <a href="${repo.html_url}" target="_blank" class="repo-link">Abrir Repositório</a>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', initialize);