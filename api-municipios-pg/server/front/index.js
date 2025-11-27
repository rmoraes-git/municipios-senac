const API = "http://localhost:3000/municipios";
const listar = document.getElementById("lista-municipios");

const btnCarregar = document.getElementById("btn-carregar");
btnCarregar.addEventListener("click", carregarMunicipios);

const btnInserir = document.getElementById("btn-adicionar");
btnInserir.addEventListener("click", inserinirMunicipio);



async function carregarMunicipios() {
    try {
        //fatch na api de municipios
        listar.innerHTML = "";

        const resposta = await fetch(API);
        const dados = await resposta.json();

        dados.forEach(municipio => {
            const linha = document.createElement("li");
            linha.textContent = municipio.id + ' ' + municipio.nome + ' ' + municipio.estado + ' ' + municipio.caracteristica;
            listar.appendChild(linha);
        });


    }
    catch (err) {
        console.error("Erro ao carregar municípios:", err.message);
    }

}

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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                estado: estado,
                caracteristica: caracteristica
            })
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

function deleteMunicipio(id) {
    //implementar
    
} 


function updateMunicipio(id, nome, estado, caracteristica) {
    //implementar
}
