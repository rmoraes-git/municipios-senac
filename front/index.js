//const API = "http://127.0.0.1:3000/municipios";
const API = "https://municipios-senac.onrender.com/municipios"

const CLIENT_API_KEY = "SUA_CHAVE_SECRETA_MUITO_FORTE_123456";


const listagem = document.getElementById("listagem");
const btnCarregar = document.getElementById("btn");

let offset = 0;
const LIMIT = 3;

// --------------------------------------------------
// BUSCAR (limit + offset)
// --------------------------------------------------
async function buscarMunicipios() {
    try {
        const url = `${API}?limit=${LIMIT}&offset=${offset}`;

        const resposta = await fetch(url, {
            headers: {
                'minha-chave': CLIENT_API_KEY
            }
        });

        const dados = await resposta.json();

        // Se não voltar mais dados, não faz nada
        if (dados.length === 0) return;

        dados.forEach(m => criarCard(m));

    } catch (erro) {
        console.error("Erro ao buscar:", erro.message);
    }
}

// --------------------------------------------------
// Carregar do zero (limpa tudo)
// --------------------------------------------------
async function carregarMunicipios() {
    listagem.innerHTML = "";
    offset = 0;
    await buscarMunicipios();
}

// Botão inicia carregamento manual
btnCarregar.addEventListener("click", carregarMunicipios);

// --------------------------------------------------
// CRIA CARD
// --------------------------------------------------
function criarCard(m) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h3>${m.nome} (${m.estado})</h3>
        <p>${m.caracteristica}</p>
        <button onclick="deletar(${m.id})">Excluir</button>
        <button onclick="abrirModal(${m.id})">Editar</button>
    `;

    listagem.appendChild(card);
}

// --------------------------------------------------
// SCROLL INFINITO (limit + offset)
// --------------------------------------------------
let bloqueado = false;

window.addEventListener("scroll", async () => {

    const scrollTop = window.scrollY;
    const alturaPagina = document.documentElement.scrollHeight;
    const alturaJanela = window.innerHeight;

    // Scroll para baixo
    if (scrollTop + alturaJanela >= alturaPagina - 5) {
        if (!bloqueado) {
            bloqueado = true;
            offset += LIMIT;
            await buscarMunicipios();
            bloqueado = false;
        }
    }

    // Scroll para cima → carregar páginas anteriores
    if (scrollTop === 0) {
        if (offset >= LIMIT) {
            offset -= LIMIT;
            listagem.innerHTML = "";
            for (let i = 0; i <= offset; i += LIMIT) {
                await buscarMunicipios();
            }
        }
    }
});

// --------------------------------------------------
// DELETAR
// --------------------------------------------------
async function deletar(id) {
    await fetch(API + "/" + id, { method: "DELETE" });
    carregarMunicipios();
}

// --------------------------------------------------
// MODAL (Editar)
// --------------------------------------------------
async function abrirModal(id) {
    const resp = await fetch(API + "/" + id);
    const m = await resp.json();

    document.getElementById("editId").value = m.id;
    document.getElementById("editNome").value = m.nome;
    document.getElementById("editUF").value = m.estado;
    document.getElementById("editCaract").value = m.caracteristica;

    document.getElementById("modalEditar").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalEditar").style.display = "none";
}

// --------------------------------------------------
// SALVAR ALTERAÇÃO (PUT)
// --------------------------------------------------
document.getElementById("btnSalvarEdicao").addEventListener("click", async () => {

    const id = document.getElementById("editId").value;
    const nome = document.getElementById("editNome").value;
    const estado = document.getElementById("editUF").value;
    const caracteristica = document.getElementById("editCaract").value;

    const atualizado = { nome, estado, caracteristica };

    await fetch(API + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado)
    });

    fecharModal();
    carregarMunicipios();
});

btnSalvar.addEventListener("click", async () => {
    const nome = document.getElementById("campoMunicipio").value;
    const estado = document.getElementById("campoUF").value;
    const caracteristica = document.getElementById("campoCaracteristica").value;

    const novoMunicipio = { nome, estado, caracteristica };

    await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "minha-chave": CLIENT_API_KEY,

        },
        body: JSON.stringify(novoMunicipio)
    });

    carregarMunicipios();
});