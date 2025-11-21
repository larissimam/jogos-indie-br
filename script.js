let cardContainer = document.querySelector(".card-container");
let dados = [];
let searchInput = document.querySelector(".search-input");

document.addEventListener('DOMContentLoaded', carregarDados);
document.querySelector('.search-button').addEventListener('click', iniciarBusca);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') iniciarBusca();
});

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (error) {
        console.error("Erro ao carregar:", error);
        cardContainer.innerHTML = "<p style='color:white'>Erro ao carregar jogos.</p>";
    }
}

function iniciarBusca() {
    const termo = searchInput.value.toLowerCase().trim();
    
    if (termo === '') {
        renderizarCards(dados);
        return;
    }

    const filtrados = dados.filter(jogo => {
        return jogo.name.toLowerCase().includes(termo) ||
               jogo.category.toLowerCase().includes(termo) ||
               jogo.developer.toLowerCase().includes(termo);
    });
    renderizarCards(filtrados);
}

function renderizarCards(jogos) {
    cardContainer.innerHTML = "";

    if (jogos.length === 0) {
        cardContainer.innerHTML = "<p style='color: #888;'>Nenhum jogo encontrado.</p>";
        return;
    }

    for (let jogo of jogos) {
        let article = document.createElement("article");
        article.classList.add("card");

        // Lógica para criar as Tags de Plataforma
        let plataformasArray = Array.isArray(jogo.platforms) ? jogo.platforms : [jogo.platforms];
        let plataformasHTML = plataformasArray.map(plat => 
            `<span class="platform-tag">${plat}</span>`
        ).join('');

        // Montagem do HTML com a nova estrutura
        article.innerHTML = `
            <img src="${jogo.img}" alt="${jogo.name}" loading="lazy">
            
            <div class="card-content">
                <span class="category">${jogo.category}</span>
                <h2>${jogo.name}</h2>
                <p class="description">${jogo.description}</p>
                
                <div class="platforms">
                    ${plataformasHTML}
                </div>
            </div>

            <div class="card-footer">
                <span class="price">${jogo.price}</span>
                <a href="${jogo.url}" target="_blank" class="btn-link">SAIBA MAIS ➜</a>
            </div>
        `;
        
        cardContainer.appendChild(article);
    }
}
// --- Função chamada ao clicar nas Tags ---
function filtrarPorTag(tag) {
    const input = document.querySelector(".search-input");
    
    if (tag === 'Todos') {
        input.value = '';
        renderizarCards(dados); // Mostra tudo
    } else {
        input.value = tag;
        iniciarBusca(); // Dispara a busca com o novo texto
    }
}

// --- Atualize sua função iniciarBusca para olhar as PLATAFORMAS também ---
function iniciarBusca() {
    const termo = searchInput.value.toLowerCase().trim();
    
    if (termo === '') {
        renderizarCards(dados);
        return;
    }

    const filtrados = dados.filter(jogo => {
        // Converte a lista de plataformas em uma string única para facilitar a busca
        // Ex: ["PC", "Xbox"] vira "pc xbox"
        const plataformasTexto = Array.isArray(jogo.platforms) 
            ? jogo.platforms.join(' ').toLowerCase() 
            : (jogo.platforms || '').toLowerCase();

        return jogo.name.toLowerCase().includes(termo) ||
               jogo.category.toLowerCase().includes(termo) ||
               jogo.developer.toLowerCase().includes(termo) ||
               plataformasTexto.includes(termo); // Agora busca também nas plataformas!
    });
    
    renderizarCards(filtrados);
}