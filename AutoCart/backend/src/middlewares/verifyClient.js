// src/middlewares/verifyClient.js
module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (req.user.role !== 'cliente' && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Acesso restrito aos clientes" });
    }

    next();
};
