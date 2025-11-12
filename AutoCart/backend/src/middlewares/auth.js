// src/middlewares/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

function extractTokenFromHeader(req) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return null;
  // Espera "Bearer <token>"
  const parts = auth.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return parts[1];
  }
  // ou token cru
  return auth;
}

function verifyToken(req, res, next) {
  try {
    const token = extractTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'Token não informado.' });

    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded deve conter id, role, mercadoId (se existir)
    req.user = decoded;
    next();
  } catch (err) {
    console.error('verifyToken error:', err.message);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

function verifyAdmin(req, res, next) {
  // permite admin somente
  try {
    verifyToken(req, res, () => {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Admins somente.' });
      }
      next();
    });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

function verifyClient(req, res, next) {
  // permite client e admin (admin também pode usar rotas de cliente)
  try {
    verifyToken(req, res, () => {
      if (!req.user || (req.user.role !== 'client' && req.user.role !== 'admin')) {
        return res.status(403).json({ error: 'Acesso negado. Cliente autenticado necessário.' });
      }
      next();
    });
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyClient,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
