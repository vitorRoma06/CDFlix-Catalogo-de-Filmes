const API_URL = "http://localhost:3000/filmes";

async function buscarFilmes() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const filmes = await response.json();
        return filmes;
    } catch (error) {
        console.error("Falha ao buscar filmes:", error);
        return []; 
    }
}

async function buscarFilmePorId(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const filme = await response.json();
        return filme;
    } catch (error) {
        console.error(`Falha ao buscar filme com ID ${id}:`, error);
        return null; 
    }
}

async function cadastrarFilme(filmeData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filmeData),
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const novoFilme = await response.json();
        alert("Filme cadastrado com sucesso!");
        return novoFilme;
    } catch (error) {
        console.error("Falha ao cadastrar filme:", error);
        alert("Erro ao cadastrar filme. Verifique o console.");
        return null;
    }
}

async function atualizarFilme(id, filmeData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filmeData),
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const filmeAtualizado = await response.json();
        alert("Filme atualizado com sucesso!");
        return filmeAtualizado;
    } catch (error) {
        console.error(`Falha ao atualizar filme com ID ${id}:`, error);
        alert("Erro ao atualizar filme. Verifique o console.");
        return null;
    }
}

async function excluirFilme(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        alert("Filme excluído com sucesso!");
        return true; 
    } catch (error) {
        console.error(`Falha ao excluir filme com ID ${id}:`, error);
        alert("Erro ao excluir filme. Verifique o console.");
        return false; 
    }
}


function montarCards(containerId, filmesArray, top10 = false) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container com ID '${containerId}' não encontrado.`);
        return;
    }
    container.innerHTML = ""; 

    filmesArray.forEach((filme, index) => {
        const article = document.createElement("article");
        article.className = top10 ? "banner-filme-top10 d-flex align-items-center" : "banner-filme-padrao align-items-center m-0";
        article.id = `filme-${filme.id}`;

        const imagePath = filme.imagem;

        article.innerHTML = `
        ${top10 ? `<p class="position-relative">${index + 1}</p>` : ''}
        <a href="detalhes.html?id=${filme.id}" class="d-flex align-items-end justify-content-center position-relative text-decoration-none text-reset">
          <img src="${imagePath}" alt="${filme.nome}">
        </a>
      `;
        container.appendChild(article);
    });
}

function montarDetalhesFilme(filme) {
    if (!filme) {
        document.getElementById("detalhes-filme-container").innerHTML = "<p>Filme não encontrado.</p>";
        return;
    }

    document.getElementById("filme-titulo").textContent = filme.nome;

    const imagem = filme.imagem;

    document.getElementById("filme-banner").src = imagem;
    document.getElementById("filme-descricao").textContent = filme.descricao;
    document.getElementById("filme-detalhes").textContent = `${filme.ano} • ${filme.duracao} • ${filme.classificacaoIdade}`;
    document.getElementById("filme-diretor").textContent = `Diretor: ${filme.diretor}`;
    document.getElementById("filme-artistas").textContent = `Artistas: ${filme.artistas}`;

    montarFotos(filme); 
}

function montarFotos(filme) {
    const divFotos = document.querySelector(".div-fotos");
    if (!divFotos) return;
    divFotos.innerHTML = "";

    if (!filme.fotos || filme.fotos.length === 0) {
        divFotos.innerHTML = "<p>Não há fotos disponíveis para este filme.</p>";
        return;
    }

    filme.fotos.forEach((fotoUrl) => {
        const article = document.createElement("article");
        article.className = "foto-filme d-flex align-items-center justify-content-center flex-column gap-1";

        const img = document.createElement("img");

        const caminhoImg = fotoUrl;

        img.src = caminhoImg;

        article.appendChild(img);
        divFotos.appendChild(article);
    });
}

function popularTabelaFilmes(filmes) {
    const tbody = document.querySelector(".table-container tbody");
    if (!tbody) return;
    tbody.innerHTML = ""; 

    if (filmes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum filme cadastrado.</td></tr>';
        return;
    }

    filmes.forEach(filme => {
        const tr = document.createElement("tr");
        const imageUrl = filme.imagem || 'assets/img/placeholder.png';
        tr.innerHTML = `
            <th scope="row">${filme.id}</th>
            <td><img src="${imageUrl}" alt="${filme.nome}" width="50" height="70" onerror="this.onerror=null; this.src='assets/img/placeholder.png';"></td>
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
        tbody.appendChild(tr);
    });
}

async function carregarPaginaPrincipal() {
    const todosOsFilmes = await buscarFilmes();
    if (todosOsFilmes.length > 0) {
        montarCards("categoria-acao", todosOsFilmes);
        montarCards("top10-filmes", todosOsFilmes.slice(0, 10), true);
        montarCards("categoria-aventura", todosOsFilmes);
    }
}

async function carregarPaginaDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const filmeId = urlParams.get('id');

    if (filmeId) {
        const filme = await buscarFilmePorId(filmeId);
        if (filme) {
            montarDetalhesFilme(filme);
        } else {
            document.getElementById("detalhes-filme-container").innerHTML = "<h1>Filme não encontrado</h1><p>O filme que você está procurando não existe ou foi removido.</p>";
        }
    } else {
        document.getElementById("detalhes-filme-container").innerHTML = "<h1>ID do Filme não especificado</h1><p>Por favor, forneça um ID de filme na URL.</p>";
    }
}

async function carregarPaginaCadastro() {
    const filmes = await buscarFilmes();
    popularTabelaFilmes(filmes);

    const form = document.getElementById('form-filme');
    const tableBody = document.querySelector('.table-container tbody');
    let editId = null; 

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

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

            let sucesso;
            if (editId) {
                sucesso = await atualizarFilme(editId, filmeData);
            } else {
                sucesso = await cadastrarFilme(filmeData);
            }

            if (sucesso) {
                form.reset(); 
                editId = null; 
                document.querySelector('#form-filme button[type="submit"]').textContent = 'Cadastrar Filme'; 
                const filmesAtualizados = await buscarFilmes();
                popularTabelaFilmes(filmesAtualizados);
            }
        });

        form.addEventListener('reset', () => {
             editId = null;
             document.querySelector('#form-filme button[type="submit"]').textContent = 'Cadastrar Filme';
        });
    }

    if (tableBody) {
        tableBody.addEventListener('click', async (event) => {
            const target = event.target;
            const editButton = target.closest('.btn-editar');
            const deleteButton = target.closest('.btn-excluir');

            if (editButton) {
                const id = editButton.getAttribute('data-id');
                const filmeParaEditar = await buscarFilmePorId(id);
                if (filmeParaEditar && form) {
                    document.getElementById('nome').value = filmeParaEditar.nome;
                    document.getElementById('ano').value = filmeParaEditar.ano;
                    document.getElementById('classificacaoIdade').value = filmeParaEditar.classificacaoIdade;
                    document.getElementById('imagem').value = filmeParaEditar.imagem; 
                    document.getElementById('duracao').value = filmeParaEditar.duracao;
                    document.getElementById('descricao').value = filmeParaEditar.descricao;
                    document.getElementById('diretor').value = filmeParaEditar.diretor;
                    document.getElementById('artistas').value = filmeParaEditar.artistas;
                    document.getElementById('fotos').value = filmeParaEditar.fotos.join(', ');

                    editId = id;
                    document.querySelector('#form-filme button[type="submit"]').textContent = 'Atualizar Filme'; 
                    window.scrollTo(0, 0); 
                }
            }

            if (deleteButton) {
                const id = deleteButton.getAttribute('data-id');
                if (confirm(`Tem certeza que deseja excluir o filme com ID ${id}?`)) {
                    const sucesso = await excluirFilme(id);
                    if (sucesso) {
                        const filmesAtualizados = await buscarFilmes();
                        popularTabelaFilmes(filmesAtualizados);
                        if (editId === id) {
                            form.reset();
                        }
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('/') || path.endsWith('index.html')) {
        carregarPaginaPrincipal();
    } else if (path.endsWith('detalhes.html')) {
        carregarPaginaDetalhes();
    } else if (path.endsWith('cadastro_filme.html')) {
        carregarPaginaCadastro();
    }
});

