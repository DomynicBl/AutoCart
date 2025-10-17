// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, 'seu_segredo_super_secreto_para_o_jwt');

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Rota exclusiva para administradores.' });
        }

        // Adiciona os dados do admin na requisição para uso posterior
        req.user = { id: decoded.id, mercadoId: decoded.mercadoId };

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
}

function verifyClient(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, 'seu_segredo_super_secreto_para_o_jwt');

        // Apenas verificamos se o token é válido e adicionamos os dados do usuário à requisição
        req.user = { id: decoded.id, role: decoded.role };

        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
}

module.exports = { verifyAdmin, verifyClient };