# 🎬 CDFlix

![CDFlix Banner](public/assets/img/CDFLIX.png)

> **Catálogo de Filmes desenvolvido como trabalho da disciplina _Desenvolvimento de Interfaces Web_ (1º período - Engenharia de Software - PUC Minas)**

---

## 📚 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Demonstração](#demonstração)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Autor](#autor)

---

## 📝 Sobre o Projeto

O **CDFlix** é um catálogo de filmes pensado para quem gosta de explorar novos títulos. Usuários podem:

- Descobrir filmes de diversos gêneros
- Conferir informações detalhadas
- Criar uma lista de favoritos
- Cadastrar e editar filmes (admin)
- Visualizar gráficos de distribuição dos filmes

---

## 🚀 Funcionalidades

- 🔎 **Busca de filmes** por título ou descrição
- 🏆 **Top 10 filmes** do Brasil
- 📋 **Detalhes completos** de cada filme
- ❤️ **Favoritar filmes** (requer login)
- 👤 **Cadastro e login de usuários**
- 🛠️ **Cadastro, edição e exclusão de filmes** (admin)
- 📊 **Gráfico de distribuição por gênero**
- 📱 **Responsivo** para dispositivos móveis

---

## 🖼️ Demonstração

![Demonstração](public/assets/img/print-cdflix.png)

---

## 📁 Estrutura de Pastas

```plaintext
tp-2/
├── db/
│   └── db.json                # Banco de dados simulado (JSON Server)
├── public/
│   ├── index.html             # Página inicial
│   ├── detalhes.html          # Página de detalhes do filme
│   ├── favoritos.html         # Página de favoritos do usuário
│   ├── cadastro_filme.html    # Cadastro e edição de filmes (admin)
│   ├── login.html             # Login e cadastro de usuário
│   ├── graficos.html          # Página de gráficos
│   └── assets/
│       ├── css/
│       │   └── styles.css     # Estilos customizados
│       ├── img/               # Imagens e ícones do projeto
│       └── scripts/
│           ├── app.js         # Lógica principal do frontend
│           ├── login.js       # Lógica de autenticação
│           └── graficos.js    # Lógica dos gráficos
├── package.json               # Dependências e scripts do projeto
└── README.md                  # Este arquivo
```

---

## 🛠️ Tecnologias Utilizadas

- [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS) (com [Bootstrap 5](https://getbootstrap.com/))
- [JavaScript (ES6+)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [JSON Server](https://github.com/typicode/json-server) (backend fake)
- [Chart.js](https://www.chartjs.org/) + [chartjs-plugin-datalabels](https://chartjs-plugin-datalabels.netlify.app/)
- [Font Awesome](https://fontawesome.com/) (ícones)

---

## ▶️ Como Rodar o Projeto

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/seu-repo.git
   cd tp-2
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Inicie o JSON Server:**
   ```sh
   npm start
   ```
   O servidor estará disponível em `http://localhost:3000/`.

4. **Abra o arquivo `public/index.html` no navegador** (ou use uma extensão como Live Server no VSCode).

---

## 👤 Autor

- **Nome:** Vitor de Roma Honório
- **Curso:** Engenharia de Software - 1º Período
- **Disciplina:** Desenvolvimento de Interfaces Web (PUC Minas)
- [![GitHub](https://img.shields.io/badge/GitHub-vitorRoma06-181717?style=flat&logo=github)](https://github.com/vitorRoma06)
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-vitordroma-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/vitordroma/)

---


