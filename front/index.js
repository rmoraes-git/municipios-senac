const API = "http://localhost:3000/municipios";
const listar = document.getElementById("lista-municipios");

const CLIENT_API_KEY = "SUA_CHAVE_SECRETA_MUITO_FORTE_123456";

const campoMunicipio = document.getElementById("campo-municipio");
const campoUf = document.getElementById("campo-uf");
const campoCaractristica = document.getElementById("campo-caractristica");

let offset = 0;
let limit = 3;
let totalRegistros = 0;

// ------------------------------------------------------------
// SCROLL COM MOUSE (VOLTOU 🎉)
// ------------------------------------------------------------
listar.addEventListener("wheel", (event) => {
    event.preventDefault();

    if (event.deltaY > 0) {
        if (offset < totalRegistros) carregarMunicipios();
    } else {
        voltarMunicipios();
    }
});

// ------------------------------------------------------------
// BOTÕES
// ------------------------------------------------------------
document.getElementById("btn-carregar").addEventListener("click", async () => {
    offset = 0;
    await pegarTotal();
    carregarMunicipios();
});

document.getElementById("btn-mais").addEventListener("click", () => {
    if (offset < totalRegistros) carregarMunicipios();
});

document.getElementById("btn-voltar").addEventListener("click", voltarMunicipios);

document.getElementById("btn-reset").addEventListener("click", () => {
    offset = 0;
    carregarMunicipios();
});

document.getElementById("btn-adicionar").addEventListener("click", inserinirMunicipio);

// ------------------------------------------------------------
// MODAL
// ------------------------------------------------------------
const modal = document.getElementById("modal");
document.getElementById("btn-fechar").addEventListener("click", () => modal.style.display = "none");

function abrirModal(id, nome, estado, caracteristica) {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-nome").value = nome;
    document.getElementById("edit-estado").value = estado;
    document.getElementById("edit-caracteristica").value = caracteristica;
    modal.style.display = "flex";
}

document.getElementById("btn-salvar").addEventListener("click", () => {
    updateMunicipio(
        document.getElementById("edit-id").value,
        document.getElementById("edit-nome").value,
        document.getElementById("edit-estado").value,
        document.getElementById("edit-caracteristica").value
    );
    modal.style.display = "none";
});

// ------------------------------------------------------------
// TOTAL
// ------------------------------------------------------------
async function pegarTotal() {
    const resp = await fetch(API, {
        headers: { "minha-api-key": CLIENT_API_KEY }
    });
    const dados = await resp.json();
    totalRegistros = dados.length;
}

// ------------------------------------------------------------
// LISTAR (ESTRUTURA ANTIGA = CSS BONITO)
// ------------------------------------------------------------
async function carregarMunicipios() {
    listar.innerHTML = "";

    const resp = await fetch(`${API}?limit=${limit}&offset=${offset}`, {
        headers: { "minha-api-key": CLIENT_API_KEY }
    });

    const dados = await resp.json();

    dados.forEach(m => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="linha-texto">
                <strong>${m.id}</strong> — ${m.nome} (${m.estado})<br>
                <span>${m.caracteristica}</span>
            </div>

            <div class="actions">
                <button class="btn-edit"
                    onclick="abrirModal('${m.id}','${m.nome}','${m.estado}','${m.caracteristica}')">
                    ✏ Editar
                </button>
                <button class="btn-delete"
                    onclick="deleteMunicipio('${m.id}')">
                    🗑 Excluir
                </button>
            </div>
        `;

        listar.appendChild(li);
    });

    offset = Math.min(offset + limit, totalRegistros);

    document.getElementById("contador").textContent =
        `Carregados: ${offset} / ${totalRegistros}`;
}

// ------------------------------------------------------------
// VOLTAR
// ------------------------------------------------------------
function voltarMunicipios() {
    offset = Math.max(0, offset - limit * 2);
    carregarMunicipios();
}

// ------------------------------------------------------------
// INSERIR
// ------------------------------------------------------------
async function inserinirMunicipio() {
    const nome = campoMunicipio.value;
    const estado = campoUf.value;
    const caracteristica = campoCaractristica.value;

    if (!nome || !estado || !caracteristica)
        return alert("Preencha todos os campos");

    const resp = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "minha-api-key": CLIENT_API_KEY
        },
        body: JSON.stringify({ nome, estado, caracteristica })
    });

    if (resp.ok) {
        campoMunicipio.value = "";
        campoUf.value = "";
        campoCaractristica.value = "";
        resetarLista();
    }
}

// ------------------------------------------------------------
// DELETAR
// ------------------------------------------------------------
async function deleteMunicipio(id) {
    const resp = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "minha-api-key": CLIENT_API_KEY }
    });

    if (resp.ok) resetarLista();
}

// ------------------------------------------------------------
// ATUALIZAR
// ------------------------------------------------------------
async function updateMunicipio(id, nome, estado, caracteristica) {
    const resp = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "minha-api-key": CLIENT_API_KEY
        },
        body: JSON.stringify({ nome, estado, caracteristica })
    });

    if (resp.ok) resetarLista();
}

// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------
function resetarLista() {
    listar.innerHTML = "";
    offset = 0;
    carregarMunicipios();
}
