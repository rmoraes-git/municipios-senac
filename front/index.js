const API = "http://127.0.0.1:3000/municipios";

const listagem = document.getElementById("listagem");
const btnCarregar = document.getElementById("btn");

let todosDados = [];
let posicao = 0;
const LIMITE = 3;

// Carregar dados ao clicar
btnCarregar.addEventListener("click", carregarMunicipios);

// --------------------------------------------------
// BUSCAR TODOS
// --------------------------------------------------
async function carregarMunicipios() {
    try {
        const resposta = await fetch(API);
        todosDados = await resposta.json();

        listagem.innerHTML = "";
        posicao = 0;

        carregarMais();

    } catch (erro) {
        console.error("Erro:", erro.message);
    }
}

// --------------------------------------------------
// MOSTRAR MAIS 3
// --------------------------------------------------
function carregarMais() {
    const parte = todosDados.slice(posicao, posicao + LIMITE);
    parte.forEach(m => criarCard(m));
    posicao += LIMITE;
}

// --------------------------------------------------
// VOLTAR 3
// --------------------------------------------------
function carregarAnterior() {
    posicao = Math.max(0, posicao - LIMITE * 2);
    listagem.innerHTML = "";
    carregarMais();
}

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
// SCROLL GLOBAL
// --------------------------------------------------
window.addEventListener("scroll", () => {
    const top = window.scrollY;
    const alturaPagina = document.documentElement.scrollHeight;
    const alturaJanela = window.innerHeight;
    console.log("alturaPagina ", alturaPagina)
    console.log("alturaJanela ", alturaPagina)
    console.log( (top + alturaJanela >= alturaPagina - 5))

    // Scroll para baixo → carregar mais
    if (top + alturaJanela >= alturaPagina - 5) {
        console.log("⬇ Rolou para BAIXO");
        carregarMais();
    }

    // Scroll topo → voltar
    if (top === 0) {
        console.log("⬆ Rolou para CIMA");
        carregarAnterior();
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
// SALVAR ALTERAÇÃO
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