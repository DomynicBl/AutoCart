// src/middlewares/verifyAdmin.js
module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: "Acesso permitido apenas para ADMIN" });
    }
    next();
};
