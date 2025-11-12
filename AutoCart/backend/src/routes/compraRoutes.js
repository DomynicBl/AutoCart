// src/routes/compraRoutes.js
const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const verifyClient = require('../middlewares/verifyClient');

const controller = require('../controllers/compraController');

// Todas as rotas de compra exigem CLIENTE (ou admin)
router.use(verifyToken);
router.use(verifyClient);

router.post('/iniciar', controller.iniciarCompra);
router.post('/adicionar-item', controller.adicionarItem);
router.post('/finalizar', controller.finalizarCompra);
router.get('/historico', controller.historicoCompras);
router.get('/produtos', controller.listarProdutos);

module.exports = router;