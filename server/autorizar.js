const pool = require('./db'); // ajuste o caminho se necessário

async function autenticarApiKey(req, res, next) {
    try {
        const apiKey = req.header('minha-api-key');

        if (!apiKey) {
            return res.status(401).json({ mensagem: 'API Key não informada' });
        }

        const result = await pool.query(
            'SELECT * FROM public.api_keys WHERE api_key = $1',
            [apiKey]
        );
        console.log(result.rows.limit, result.rows.consumo);
        if (result.rows.length === 1 ){//{&& result.rows[0].consumo <= result.rows[0].limite) {
            // Incrementar consumo
            await pool.query(
                'UPDATE public.api_keys SET consumo = consumo + 1 WHERE api_key = $1',
                [apiKey]
            );
            
            return next();
        }

        console.log('Chave inválida:', apiKey);
        return res.status(401).json({ mensagem: 'CHAVE INVÁLIDA DA API' });

    } catch (erro) {
        console.error('Erro na autenticação:', erro);
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = autenticarApiKey;
