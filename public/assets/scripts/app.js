const API_URL = "http://localhost:3000/filmes";
let todosOsFilmes = [];

// 1. FUNÇÕES DE API (Não precisam de alteração)
async function buscarFilmes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        todosOsFilmes = await response.json();
        return todosOsFilmes;
    } catch (error) {
        console.error("Falha ao buscar filmes:", error);
        return [];
    }
}

async function buscarFilmePorId(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Falha ao buscar filme com ID ${id}:`, error);
        return null;
    }
}

async function toggleFavorito(filmeId, novoStatus) {
    try {
        const response = await fetch(`${API_URL}/${filmeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorito: novoStatus }),
        });
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Falha ao atualizar favorito para o filme ${filmeId}:`, error);
        return null;
    }
}

// 2. FUNÇÕES DE RENDERIZAÇÃO DA PÁGINA PRINCIPAL (Não precisam de alteração)
function adicionarLogicaFavorito(icon, filme) {
    icon.addEventListener('click', async (event) => {
        event.stopPropagation();
        event.preventDefault();
        
        const novoStatus = !filme.favorito;
        const filmeAtualizado = await toggleFavorito(filme.id, novoStatus);

        if (filmeAtualizado) {
            filme.favorito = novoStatus;
            document.querySelectorAll(`.favorite-icon[data-id='${filme.id}']`).forEach(i => {
                i.classList.toggle('favoritado', novoStatus);
            });
        }
    });
}

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
        const imagemSrc = filme.fotos && filme.fotos.length > 0 ? filme.fotos[0] : filme.imagem;
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
        const article = document.createElement("article");
        article.className = "banner-filme-top10";

        const link = document.createElement("a");
        link.href = `detalhes.html?id=${filme.id}`;
        link.innerHTML = `<img src="${filme.imagem}" alt="Pôster de ${filme.nome}" onerror="this.onerror=null; this.src='assets/img/placeholder.png';">`;

        const heartIcon = document.createElement('i');
        heartIcon.className = `fa-solid fa-heart favorite-icon ${filme.favorito ? 'favoritado' : ''}`;
        heartIcon.setAttribute('data-id', filme.id);
        
        link.prepend(heartIcon);
        adicionarLogicaFavorito(heartIcon, filme);

        article.innerHTML = `<p class="top10-number">${index + 1}</p>`;
        article.appendChild(link);
        container.appendChild(article);
    });
}

function montarCardsGerais(containerId, filmesArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    if (filmesArray.length === 0) {
        container.innerHTML = `<p class="text-center col-12">Nenhum filme encontrado com este termo.</p>`;
        return;
    }

    filmesArray.forEach(filme => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3";
        
        const card = document.createElement("div");
        card.className = "card-filme";

        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';
        imgContainer.innerHTML = `<a href="detalhes.html?id=${filme.id}"><img src="${filme.imagem}" alt="${filme.nome}" onerror="this.onerror=null; this.src='assets/img/placeholder.png';"></a>`;

        const heartIcon = document.createElement('i');
        heartIcon.className = `fa-solid fa-heart favorite-icon ${filme.favorito ? 'favoritado' : ''}`;
        heartIcon.setAttribute('data-id', filme.id);
        
        imgContainer.prepend(heartIcon);
        adicionarLogicaFavorito(heartIcon, filme);

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

// 3. LÓGICA DE BUSCA (Não precisa de alteração)
function setupBusca() {
    const formBusca = document.getElementById('form-busca');
    const inputBusca = document.getElementById('input-busca');
    const conteudoPrincipal = document.getElementById('conteudo-principal');
    const allFilmsTitle = document.getElementById('all-films-title');

    formBusca.addEventListener('submit', (e) => e.preventDefault());

    inputBusca.addEventListener('input', () => {
        const termo = inputBusca.value.trim().toLowerCase();
        
        if (termo === '') {
            conteudoPrincipal.style.display = 'block';
            allFilmsTitle.textContent = 'Todos os Filmes';
            montarCardsGerais('filmes-container', todosOsFilmes);
        } else {
            conteudoPrincipal.style.display = 'none';
            allFilmsTitle.textContent = `Resultados para: "${inputBusca.value}"`;
            
            const filmesFiltrados = todosOsFilmes.filter(filme => 
                filme.nome.toLowerCase().includes(termo) ||
                filme.descricao.toLowerCase().includes(termo)
            );
            montarCardsGerais('filmes-container', filmesFiltrados);
        }
    });
}

// 4. INICIALIZAÇÃO E LÓGICA DE PÁGINAS
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
    if (!filmeId) return;
    const filme = await buscarFilmePorId(filmeId);
    if (!filme) return;
    document.getElementById("filme-titulo").textContent = filme.nome;
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

// LÓGICA DA PÁGINA DE CADASTRO (COMPLETA E CORRIGIDA)
async function carregarPaginaCadastro() {
    const form = document.getElementById('form-filme');
    const tableBody = document.querySelector(".table-container tbody");
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

    // LÓGICA DE SUBMISSÃO DO FORMULÁRIO (CRIAR/ATUALIZAR)
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
            fotos: fotosArray,
            favorito: false
        };

        const url = editId ? `${API_URL}/${editId}` : API_URL;
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

    // LÓGICA DOS BOTÕES DA TABELA (EDITAR/DELETAR)
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
                    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
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


// 5. ROTEADOR
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/').pop();
    if (path === '' || path === 'index.html') {
        carregarPaginaPrincipal();
    } else if (path === 'detalhes.html') {
        carregarPaginaDetalhes();
    } else if (path === 'cadastro_filme.html') {
        carregarPaginaCadastro();
    }
});