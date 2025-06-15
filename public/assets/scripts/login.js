// URLs e constantes para autenticação
const USUARIOS_API_URL = "http://localhost:3000/usuarios";
const LOGIN_PAGE_URL = "login.html";

// Objeto para o usuário corrente, acessível globalmente
let usuarioCorrente = {};

// Função para gerar IDs únicos para novos usuários
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Verifica se um usuário está logado, confrontando login e senha com a API.
 * @param {string} login - O login do usuário.
 * @param {string} senha - A senha do usuário.
 */
async function loginUser(login, senha) {
    try {
        const response = await fetch(USUARIOS_API_URL);
        const usuarios = await response.json();
        const usuarioEncontrado = usuarios.find(u => u.login === login && u.senha === senha);

        if (usuarioEncontrado) {
            usuarioCorrente = usuarioEncontrado;
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
            window.location.href = 'index.html'; // Redireciona para a página principal
        } else {
            alert('Usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
        alert("Falha na comunicação com o servidor.");
    }
}

/**
 * Remove os dados do usuário da sessionStorage e o redireciona para a página de login.
 */
function logoutUser() {
    sessionStorage.removeItem('usuarioCorrente');
    usuarioCorrente = {};
    window.location.href = LOGIN_PAGE_URL;
}

/**
 * Cadastra um novo usuário na API.
 * @param {string} nome 
 * @param {string} email 
 * @param {string} login 
 * @param {string} senha 
 * @returns {boolean} - Retorna true se o cadastro for bem-sucedido.
 */
async function addUser(nome, email, login, senha) {
    const novoUsuario = {
        id: generateUUID(),
        nome,
        email,
        login,
        senha,
        favoritos: [] // Todo novo usuário começa com a lista de favoritos vazia
    };

    try {
        await fetch(USUARIOS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario)
        });
        alert('Usuário cadastrado com sucesso! Por favor, faça o login.');
        return true;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        alert("Falha ao cadastrar usuário.");
        return false;
    }
}

/**
 * INICIALIZAÇÃO DO MÓDULO DE LOGIN
 * Esta parte do código é executada assim que o script é carregado.
 * Ele verifica a sessionStorage e preenche o objeto `usuarioCorrente`.
 */
(() => {
    const usuarioJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioJSON) {
        usuarioCorrente = JSON.parse(usuarioJSON);
    }
})();