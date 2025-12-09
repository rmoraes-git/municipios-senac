const API = "http://localhost:3000/municipios";
const listar = document.getElementById("lista-municipios");
window.addEventListener("scroll", async () => {
});
let offset = 0;
let limit = 3;
let totalRegistros = 0;

// Botões principais
const btnCarregar = document.getElementById("btn-carregar");
btnCarregar.addEventListener("click", async () => {
    offset = 0;
    await pegarTotal();
    carregarMunicipios();
});

const btnMais = document.getElementById("btn-mais");
btnMais.addEventListener("click", () => {
    if (offset < totalRegistros) {
        carregarMunicipios();
    }
});

const btnVoltar = document.getElementById("btn-voltar");
btnVoltar.addEventListener("click", voltarMunicipios);

const btnReset = document.getElementById("btn-reset");
btnReset.addEventListener("click", () => {
    offset = 0;
    carregarMunicipios();
});

const btnInserir = document.getElementById("btn-adicionar");
btnInserir.addEventListener("click", inserinirMunicipio);

const listaElement = document.getElementById("lista-municipios");

listaElement.addEventListener("wheel", (event) => {
    event.preventDefault(); 

    if (event.deltaY > 0) {
        // Scroll para baixo → próxima página
        if (offset < totalRegistros) {
            carregarMunicipios();
        }
    } else {
        // Scroll para cima → voltar página
        voltarMunicipios();
    }
});

// ----------------------------------// MODAL// ------------------------
const modal = document.getElementById("modal");
const btnFechar = document.getElementById("btn-fechar");
const btnSalvar = document.getElementById("btn-salvar");

btnFechar.addEventListener("click", () => modal.style.display = "none");

function abrirModal(id, nome, estado, caracteristica) {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-nome").value = nome;
    document.getElementById("edit-estado").value = estado;
    document.getElementById("edit-caracteristica").value = caracteristica;
    modal.style.display = "flex";
}

btnSalvar.addEventListener("click", () => {
    const id = document.getElementById("edit-id").value;
    const nome = document.getElementById("edit-nome").value;
    const estado = document.getElementById("edit-estado").value;
    const caracteristica = document.getElementById("edit-caracteristica").value;

    updateMunicipio(id, nome, estado, caracteristica);
    modal.style.display = "none";
});

// ------------------------------------------------------------
// PEGAR TOTAL DE REGISTROS
// ------------------------------------------------------------
async function pegarTotal() {
    const resp = await fetch(API);
    const dados = await resp.json();
    totalRegistros = dados.length;
}

// ------------------------------------------------------------
// LISTAR COM PAGINAÇÃO
// ------------------------------------------------------------
async function carregarMunicipios() {
    try {
        listar.innerHTML = ""; // sempre limpa

        const resposta = await fetch(`${API}?limit=${limit}&offset=${offset}`);
        const dados = await resposta.json();

        dados.forEach(municipio => {
            const li = document.createElement("li");

            li.innerHTML = `
                <div class="linha-texto">
                    <strong>${municipio.id}</strong> — ${municipio.nome} (${municipio.estado})<br>
                    <span>${municipio.caracteristica}</span>
                </div>

                <div class="actions">
                    <button class="btn-edit"
                        onclick="abrirModal('${municipio.id}', '${municipio.nome}', '${municipio.estado}', '${municipio.caracteristica}')">
                        ✏ Editar
                    </button>

                    <button class="btn-delete"
                        onclick="deleteMunicipio('${municipio.id}')">
                        🗑 Excluir
                    </button>
                </div>
            `;

            listar.appendChild(li);
        });

        // Atualiza offset sem ultrapassar o total
        if (offset + limit < totalRegistros) {
            offset += limit;
        } else {
            offset = totalRegistros;
        }

        // Atualiza contador
        let exibidos = offset;
        if (exibidos > totalRegistros) exibidos = totalRegistros;

        document.getElementById("contador").textContent =
            `Carregados: ${exibidos} / ${totalRegistros}`;

    } catch (err) {
        console.error("Erro ao carregar municípios:", err.message);
    }
}

// ------------------------------------------------------------
// VOLTAR NA PAGINAÇÃO
// ------------------------------------------------------------
function voltarMunicipios() {
    if (offset - limit * 2 <= 0) {
        offset = 0;
    } else {
        offset -= limit * 2;
    }

    carregarMunicipios();
}

// ------------------------------------------------------------
// INSERIR
// ------------------------------------------------------------
async function inserinirMunicipio() {
    const nome = document.getElementById("campo-municipio").value;
    const estado = document.getElementById("campo-uf").value;
    const caracteristica = document.getElementById("campo-caractristica").value;

    if (!nome || !estado || !caracteristica) {
        alert("Por favor, preencha todos os campos");
        return;
    }

    try {
        const resposta = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, estado, caracteristica })
        });

        if (resposta.ok) {
            alert("Município adicionado com sucesso!");
            document.getElementById("campo-municipio").value = "";
            document.getElementById("campo-uf").value = "";
            document.getElementById("campo-caractristica").value = "";
        }

    } catch (err) {
        console.error("Erro ao adicionar município:", err.message);
    }
}

// ------------------------------------------------------------
// DELETAR
// ------------------------------------------------------------
async function deleteMunicipio(id) {
    try {
        const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });

        if (resposta.ok) {
            alert("Município deletado com sucesso!");
            resetarLista();
        }

    } catch (err) {
        console.error("Erro ao deletar município:", err.message);
    }
}

// ------------------------------------------------------------
// ATUALIZAR
// ------------------------------------------------------------
async function updateMunicipio(id, nome, estado, caracteristica) {
    if (!nome || !estado || !caracteristica) {
        alert("Por favor, preencha todos os campos");
        return;
    }

    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, estado, caracteristica })
        });

        if (resposta.ok) {
            alert("Município atualizado com sucesso!");
            resetarLista();
        }

    } catch (err) {
        console.error("Erro ao atualizar município:", err.message);
    }
}

// ------------------------------------------------------------
// RESETAR LISTA
// ------------------------------------------------------------
function resetarLista() {
    listar.innerHTML = "";
    offset = 0;
    carregarMunicipios();
}
