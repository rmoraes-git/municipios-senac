
//ler a chave liberada
const api_key = process.env.API_KEY_SECRET;


function autenticarAPIKey(req, res, next){

    const api_key_front = req.header('minha-chave');

    if(api_key_front === api_key){
        console.log("chave válida",api_key_front,api_key)
        next();
    }
    else{
         console.log("chave inválida",api_key_front,api_key)
         return res.status(500).json({mensagem: "Chave Inválida"});
    }

}

module.exports =  autenticarAPIKey;