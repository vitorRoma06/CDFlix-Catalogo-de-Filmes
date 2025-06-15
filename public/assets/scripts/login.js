const USUARIOS_API_URL = "http://localhost:3000/usuarios";
const LOGIN_PAGE_URL = "login.html";

let usuarioCorrente = {};

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function loginUser(login, senha) {
    try {
        const response = await fetch(USUARIOS_API_URL);
        const usuarios = await response.json();
        const usuarioEncontrado = usuarios.find(u => u.login === login && u.senha === senha);

        if (usuarioEncontrado) {
            usuarioCorrente = usuarioEncontrado;
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
            window.location.href = 'index.html';         } else {
            alert('Usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error("Erro ao tentar fazer login:", error);
        alert("Falha na comunicação com o servidor.");
    }
}


function logoutUser() {
    sessionStorage.removeItem('usuarioCorrente');
    usuarioCorrente = {};
    window.location.href = LOGIN_PAGE_URL;
}

async function addUser(nome, email, login, senha) {
    const novoUsuario = {
        id: generateUUID(),
        nome,
        email,
        login,
        senha,
        favoritos: []     };

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

(() => {
    const usuarioJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioJSON) {
        usuarioCorrente = JSON.parse(usuarioJSON);
    }
})();