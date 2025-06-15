// URL da API de Filmes
const FILMES_API_URL = "http://localhost:3000/filmes";

// Variável global para armazenar os filmes carregados
let todosOsFilmes = [];

/**
 * ATUALIZA A UI (MENU PRINCIPAL) COM BASE NO ESTADO DE LOGIN
 * Lê a variável global `usuarioCorrente` (definida e preenchida por login.js)
 */
function updateUIBasedOnLogin() {
    const userMenu = document.getElementById('user-menu');
    const navFavoritos = document.getElementById('nav-favoritos');
    const navCadastro = document.getElementById('nav-cadastro-filmes'); // Pega o novo item de menu

    if (userMenu) {
        if (usuarioCorrente && usuarioCorrente.login) {
            // Usuário está LOGADO
            if (navFavoritos) navFavoritos.classList.remove('d-none');

            // ATUALIZADO: Mostra o link de cadastro apenas se o usuário for admin
            if (navCadastro) {
                if (usuarioCorrente.admin) {
                    navCadastro.classList.remove('d-none');
                } else {
                    navCadastro.classList.add('d-none');
                }
            }

            userMenu.innerHTML = `
                <span class="text-white me-3">Olá, ${usuarioCorrente.nome}</span>
                <button id="btn-logout" class="btn btn-limpar">Logout</button>
            `;
            document.getElementById('btn-logout').addEventListener('click', logoutUser);
        } else {
            // Usuário está DESLOGADO
            if (navFavoritos) navFavoritos.classList.add('d-none');
            if (navCadastro) navCadastro.classList.add('d-none'); // Garante que esteja escondido

            userMenu.innerHTML = `
                <a href="login.html">Login</a>
                <a href="login.html">Cadastre-se</a>
            `;
        }
    }
}


// ===================================================================
// LÓGICA DE FILMES E FAVORITOS
// ===================================================================

async function buscarFilmes() {
    try {
        const response = await fetch(FILMES_API_URL);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        todosOsFilmes = await response.json();
        return todosOsFilmes;
    } catch (error) {
        console.error("Falha ao buscar filmes:", error);
        return [];
    }
}

async function buscarFilmePorId(filmeId) {
    try {
        const response = await fetch(`${FILMES_API_URL}/${filmeId}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Falha ao buscar filme com ID ${filmeId}:`, error);
        return null;
    }
}

async function toggleFavorito(filmeId) {
    if (!usuarioCorrente || !usuarioCorrente.id) {
        alert("Você precisa estar logado para favoritar filmes.");
        window.location.href = "login.html";
        return;
    }

    const filmeIdNum = parseInt(filmeId, 10);
    const index = usuarioCorrente.favoritos.indexOf(filmeIdNum);

    if (index > -1) {
        usuarioCorrente.favoritos.splice(index, 1);
    } else {
        usuarioCorrente.favoritos.push(filmeIdNum);
    }

    try {
        await fetch(`${USUARIOS_API_URL}/${usuarioCorrente.id}`, { // USUARIOS_API_URL é definida em login.js
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favoritos: usuarioCorrente.favoritos })
        });
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
        
        const path = window.location.pathname.split('/').pop();
        if (path === '' || path === 'index.html') {
            montarCardsTop10('top10-container', todosOsFilmes.slice(0, 10));
            montarCardsGerais('filmes-container', todosOsFilmes);
        } else if (path === 'favoritos.html') {
            carregarPaginaFavoritos();
        } else if (path === 'detalhes.html') {
             carregarPaginaDetalhes();
        }

    } catch (error) {
        console.error("Erro ao atualizar favoritos:", error);
    }
}


// ===================================================================
// FUNÇÕES DE RENDERIZAÇÃO DE INTERFACE
// ===================================================================

function montarCarouselDinamico(filmesParaCarousel) {
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselInner = document.querySelector('.carousel-inner');
    if (!carouselIndicators || !carouselInner) return;

    carouselIndicators.innerHTML = '';
    carouselInner.innerHTML = '';

    filmesParaCarousel.forEach((filme, index) => {
        const indicator = document.createElement('button');
        indicator.setAttribute('data-bs-target', '#ads');
        indicator.setAttribute('data-bs-slide-to', index.toString());
        if (index === 0) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        }
        carouselIndicators.appendChild(indicator);

        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        const imagemSrc = (filme.fotos && filme.fotos.length > 0) ? filme.fotos[0] : filme.imagem;
        carouselItem.innerHTML = `
            <a href="detalhes.html?id=${filme.id}">
                <img src="${imagemSrc}" class="d-block w-100" alt="Banner do filme ${filme.nome}">
                <div class="carousel-caption d-none d-md-block mb-3">
                    <h1>${filme.nome}</h1>
                    <p>${filme.descricao}</p>
                </div>
            </a>
        `;
        carouselInner.appendChild(carouselItem);
    });
}

function montarCardsTop10(containerId, filmesArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    filmesArray.forEach((filme, index) => {
        const isFavorito = usuarioCorrente.favoritos?.includes(parseInt(filme.id));
        const article = document.createElement("article");
        article.className = "banner-filme-top10";
        
        const link = document.createElement("a");
        link.href = `detalhes.html?id=${filme.id}`;
        
        const img = document.createElement('img');
        img.src = filme.imagem;
        img.alt = `Pôster de ${filme.nome}`;
        img.onerror = function() { this.onerror=null; this.src='assets/img/placeholder.png'; };
        
        const heartIcon = document.createElement('i');
        heartIcon.className = `fa-solid fa-heart favorite-icon ${isFavorito ? 'favoritado' : ''}`;
        heartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorito(filme.id);
        });
        
        link.appendChild(img);
        article.innerHTML = `<p class="top10-number">${index + 1}</p>`;
        article.appendChild(link);
        article.querySelector('a').prepend(heartIcon);
        container.appendChild(article);
    });
}

function montarCardsGerais(containerId, filmesArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    if (!filmesArray || filmesArray.length === 0) {
        container.innerHTML = `<p class="text-center col-12">Nenhum filme encontrado.</p>`;
        return;
    }

    filmesArray.forEach(filme => {
        const isFavorito = usuarioCorrente.favoritos?.includes(parseInt(filme.id));
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3";
        
        const card = document.createElement("div");
        card.className = "card-filme";

        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';
        imgContainer.innerHTML = `<a href="detalhes.html?id=${filme.id}"><img src="${filme.imagem}" alt="${filme.nome}" onerror="this.onerror=null; this.src='assets/img/placeholder.png';"></a>`;

        const heartIcon = document.createElement('i');
        heartIcon.className = `fa-solid fa-heart favorite-icon ${isFavorito ? 'favoritado' : ''}`;
        heartIcon.addEventListener('click', (e) => {
             e.preventDefault();
             e.stopPropagation();
             toggleFavorito(filme.id)
        });
        imgContainer.prepend(heartIcon);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        cardBody.innerHTML = `
            <h5 class="card-title">${filme.nome}</h5>
            <p class="card-details">${filme.ano} • ${filme.duracao}</p>
        `;

        card.appendChild(imgContainer);
        card.appendChild(cardBody);
        col.appendChild(card);
        container.appendChild(col);
    });
}

function setupBusca() {
    const formBusca = document.getElementById('form-busca');
    const inputBusca = document.getElementById('input-busca');
    const conteudoPrincipal = document.getElementById('conteudo-principal');
    const allFilmsTitle = document.getElementById('all-films-title');

    if (!formBusca) return;

    formBusca.addEventListener('submit', (e) => e.preventDefault());

    inputBusca.addEventListener('input', () => {
        const termo = inputBusca.value.trim().toLowerCase();
        
        if (termo === '') {
            if(conteudoPrincipal) conteudoPrincipal.style.display = 'block';
            if(allFilmsTitle) allFilmsTitle.textContent = 'Todos os Filmes';
            montarCardsGerais('filmes-container', todosOsFilmes);
        } else {
            if(conteudoPrincipal) conteudoPrincipal.style.display = 'none';
            if(allFilmsTitle) allFilmsTitle.textContent = `Resultados para: "${inputBusca.value}"`;
            
            const filmesFiltrados = todosOsFilmes.filter(filme => 
                filme.nome.toLowerCase().includes(termo) ||
                filme.descricao.toLowerCase().includes(termo)
            );
            montarCardsGerais('filmes-container', filmesFiltrados);
        }
    });
}


// ===================================================================
// LÓGICA DE CARREGAMENTO DE PÁGINAS ESPECÍFICAS
// ===================================================================

async function carregarPaginaPrincipal() {
    await buscarFilmes();
    if (todosOsFilmes.length > 0) {
        montarCarouselDinamico(todosOsFilmes.slice(0, 3));
        montarCardsTop10('top10-container', todosOsFilmes.slice(0, 10));
        montarCardsGerais('filmes-container', todosOsFilmes);
        setupBusca();
    }
}

async function carregarPaginaDetalhes() {
    const params = new URLSearchParams(window.location.search);
    const filmeId = params.get('id');
    const container = document.getElementById("detalhes-filme-container");

    if (!filmeId) {
        if(container) container.innerHTML = "<h1>ID do filme não fornecido.</h1>";
        return;
    };
    
    const filme = await buscarFilmePorId(filmeId);
    
    if (!filme) {
        if(container) container.innerHTML = "<h1>Filme não encontrado.</h1>";
        return;
    }

    const isFavorito = usuarioCorrente.favoritos?.includes(parseInt(filme.id));
    
    document.getElementById("filme-titulo").textContent = filme.nome;
    const heartIcon = document.getElementById("favorite-icon-detalhes");
    heartIcon.className = `fa-solid fa-heart favorite-icon ${isFavorito ? 'favoritado' : ''}`;
    heartIcon.dataset.filmeId = filme.id;

    document.getElementById("filme-banner").src = filme.imagem;
    document.getElementById("filme-banner").alt = `Pôster de ${filme.nome}`;
    document.getElementById("filme-detalhes").innerHTML = `${filme.ano} &bull; ${filme.duracao} &bull; ${filme.classificacaoIdade}`;
    document.getElementById("filme-descricao").textContent = filme.descricao;
    document.getElementById("filme-diretor").textContent = filme.diretor;
    document.getElementById("filme-artistas").textContent = filme.artistas;

    const divFotos = document.querySelector(".div-fotos");
    if (divFotos) {
        divFotos.innerHTML = "";
        if (filme.fotos && filme.fotos.length > 0) {
            filme.fotos.forEach(fotoUrl => {
                const article = document.createElement("article");
                article.className = "foto-filme";
                article.innerHTML = `<img src="${fotoUrl}" alt="Cena do filme ${filme.nome}">`;
                divFotos.appendChild(article);
            });
        } else {
            divFotos.innerHTML = "<p>Não há fotos adicionais para este filme.</p>";
        }
    }
}

async function carregarPaginaFavoritos() {
    if (!usuarioCorrente || !usuarioCorrente.id) {
        alert("Você precisa estar logado para ver seus favoritos.");
        window.location.href = "login.html";
        return;
    }

    await buscarFilmes();
    
    const filmesFavoritos = todosOsFilmes.filter(filme => 
        usuarioCorrente.favoritos.includes(parseInt(filme.id))
    );
    
    montarCardsGerais('favoritos-container', filmesFavoritos);
}

async function carregarPaginaCadastro() {
    // ATUALIZADO: Proteção de rota para administradores
    if (!usuarioCorrente || !usuarioCorrente.admin) {
        alert("Acesso negado. Você precisa ser um administrador para acessar esta página.");
        window.location.href = 'index.html';
        const mainContent = document.querySelector('.main');
        if (mainContent) mainContent.style.display = 'none';
        return;
    }

    const form = document.getElementById('form-filme');
    const tableBody = document.querySelector(".table-container tbody");
    if(!form || !tableBody) return;
    
    let editId = null;

    const popularTabela = async () => {
        const filmes = await buscarFilmes();
        tableBody.innerHTML = "";
        if (!filmes || filmes.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum filme cadastrado.</td></tr>';
            return;
        }
        filmes.forEach(filme => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <th scope="row">${filme.id}</th>
                <td><img src="${filme.imagem}" alt="${filme.nome}" width="50" height="70" onerror="this.onerror=null; this.src='assets/img/placeholder.png';"></td>
                <td>${filme.nome}</td>
                <td>${filme.ano}</td>
                <td>${filme.classificacaoIdade}</td>
                <td>${filme.duracao}</td>
                <td>${filme.diretor}</td>
                <td>
                    <button class="btn btn-sm btn-editar" data-id="${filme.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-excluir" data-id="${filme.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fotosArray = document.getElementById('fotos').value.split(',').map(url => url.trim()).filter(url => url);
        const filmeData = {
            nome: document.getElementById('nome').value,
            ano: parseInt(document.getElementById('ano').value),
            classificacaoIdade: document.getElementById('classificacaoIdade').value,
            imagem: document.getElementById('imagem').value,
            duracao: document.getElementById('duracao').value,
            descricao: document.getElementById('descricao').value,
            diretor: document.getElementById('diretor').value,
            artistas: document.getElementById('artistas').value,
            fotos: fotosArray
        };

        const url = editId ? `${FILMES_API_URL}/${editId}` : FILMES_API_URL;
        const method = editId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filmeData)
            });
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            alert(`Filme ${editId ? 'atualizado' : 'cadastrado'} com sucesso!`);
            form.reset();
            editId = null;
            document.querySelector('#form-filme button[type="submit"]').textContent = 'Cadastrar Filme';
            await popularTabela();
        } catch (error) {
            alert(`Erro ao ${editId ? 'atualizar' : 'cadastrar'} filme.`);
            console.error(error);
        }
    });

    tableBody.addEventListener('click', async (e) => {
        const editButton = e.target.closest('.btn-editar');
        const deleteButton = e.target.closest('.btn-excluir');

        if (editButton) {
            const id = editButton.dataset.id;
            const filme = await buscarFilmePorId(id);
            if (filme) {
                document.getElementById('nome').value = filme.nome;
                document.getElementById('ano').value = filme.ano;
                document.getElementById('classificacaoIdade').value = filme.classificacaoIdade;
                document.getElementById('imagem').value = filme.imagem;
                document.getElementById('duracao').value = filme.duracao;
                document.getElementById('descricao').value = filme.descricao;
                document.getElementById('diretor').value = filme.diretor;
                document.getElementById('artistas').value = filme.artistas;
                document.getElementById('fotos').value = filme.fotos ? filme.fotos.join(', ') : '';
                editId = id;
                document.querySelector('#form-filme button[type="submit"]').textContent = 'Atualizar Filme';
                window.scrollTo(0, 0);
            }
        }

        if (deleteButton) {
            const id = deleteButton.dataset.id;
            if (confirm(`Tem certeza que deseja excluir o filme com ID ${id}?`)) {
                try {
                    await fetch(`${FILMES_API_URL}/${id}`, { method: 'DELETE' });
                    alert('Filme excluído com sucesso!');
                    await popularTabela();
                } catch (error) {
                    alert('Erro ao excluir filme.');
                    console.error(error);
                }
            }
        }
    });
    
    await popularTabela();
}


// ===================================================================
// PONTO DE ENTRADA DA APLICAÇÃO (ROTEADOR)
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnLogin();

    const path = window.location.pathname.split('/').pop();
    if (path === '' || path === 'index.html') {
        carregarPaginaPrincipal();
    } else if (path === 'detalhes.html') {
        carregarPaginaDetalhes();
        const heartIconDetalhes = document.getElementById('favorite-icon-detalhes');
        if (heartIconDetalhes) {
            heartIconDetalhes.addEventListener('click', () => {
                const filmeId = heartIconDetalhes.dataset.filmeId;
                if (filmeId) {
                    toggleFavorito(filmeId);
                }
            });
        }
    } else if (path === 'cadastro_filme.html') {
        carregarPaginaCadastro();
    } else if (path === 'favoritos.html') {
        carregarPaginaFavoritos();
    }
});