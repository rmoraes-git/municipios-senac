const API = "http://127.0.0.1:3000/municipios";
const listagem = document.getElementById("listagem");
console.log('hhhhhhh')

const btnCarregar = document.getElementById("btn");
btnCarregar.addEventListener("click", carregarMunicipios)

const btnSalvar = document.getElementById("btnSalvar");
btnSalvar.addEventListener("click", inserirMunicipio)

async function carregarMunicipios() {
    console.log("teste");
    try {
        //fetch
        const resposta = await fetch(API);
        const dados = await resposta.json();
        listagem.innerHTML = "";
        dados.forEach(municipio => {
            const linha = document.createElement("li");
            linha.textContent = municipio.nome + " " + municipio.caracteristica;
            listagem.appendChild(linha)
        });

    }
    catch (erro) {
        console.log("errorrrrrrrrrrrrr", erro.message)
    }
}

async function inserirMunicipio() {

    const  campoMunicipio = document.getElementById("campoMunicipio").value;
    const  campoUF = document.getElementById("campoUF").value;
    const  campoCaracteristica = document.getElementById("campoCaracteristica").value;
    const novoMunicipio = {
        nome: campoMunicipio,
        estado: campoUF,
        caracteristica: campoCaracteristica
    };

    try {
        const resposta = await fetch(API, {
            method: "POST",
            body: JSON.stringify(novoMunicipio),
            headers: { "Content-Type": "application/json" }
        })

    } catch (erro) {
        console.error("deu ruim ", erro.message)
    }
}