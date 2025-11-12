// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');


const controller = require('../controllers/adminController');

// Todas as rotas daqui exigem ADMIN
router.use(verifyToken);
router.use(verifyAdmin);

router.get('/produtos', controller.listarProdutos);
router.post('/produtos', controller.criarProduto);
router.put('/produtos/:id', controller.atualizarProduto);
router.delete('/produtos/:id', controller.deletarProduto);

module.exports = router;
