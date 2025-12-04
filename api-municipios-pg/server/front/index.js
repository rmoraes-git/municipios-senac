const API = "http://localhost:3000/municipios";
const listar = document.getElementById("lista-municipios");

// Botões principais
const btnCarregar = document.getElementById("btn-carregar");
btnCarregar.addEventListener("click", carregarMunicipios);

const btnInserir = document.getElementById("btn-adicionar");
btnInserir.addEventListener("click", inserinirMunicipio);

// ---------------- MODAL ---------------- //
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

// ---------------- FUNÇÃO DE LISTAR ---------------- //
async function carregarMunicipios() {
    try {
        listar.innerHTML = "";

        const resposta = await fetch(API);
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

    } catch (err) {
        console.error("Erro ao carregar municípios:", err.message);
    }
}

// ---------------- FUNÇÃO DE INSERIR ---------------- //
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

// ---------------- FUNÇÃO DE DELETAR ---------------- //
async function deleteMunicipio(id) {
    try {
        const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });

        if (resposta.ok) {
            alert("Município deletado com sucesso!");
            carregarMunicipios();
        }

    } catch (err) {
        console.error("Erro ao deletar município:", err.message);
    }
}

// ---------------- FUNÇÃO DE ATUALIZAR ---------------- //
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
            carregarMunicipios();
        }

    } catch (err) {
        console.error("Erro ao atualizar município:", err.message);
    }
}
