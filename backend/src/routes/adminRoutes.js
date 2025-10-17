// src/routes/adminRoutes.js
const express = require('express');
const { verifyAdmin } = require('../middlewares/auth');
const { models } = require('../database');

const router = express.Router();
const { Produto, Carrinho } = models.autocart;

router.use(verifyAdmin);

router.get('/produtos', async (req, res) => {
    const { mercadoId } = req.user;
    if (!mercadoId) {
        return res.status(403).json({ error: 'Admin não está associado a um mercado.' });
    }
    try {
        const produtos = await Produto.findAll({ where: { mercadoId } });
        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao listar produtos.', details: error.message });
    }
});

router.post('/produtos', async (req, res) => {
    const { mercadoId } = req.user;
    if (!mercadoId) {
        return res.status(403).json({ error: 'Admin não está associado a um mercado.' });
    }
    const dadosProduto = { ...req.body, mercadoId };
    try {
        const produto = await Produto.create(dadosProduto);
        return res.status(201).json(produto);
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao cadastrar produto.', details: error.message });
    }
});

router.put('/produtos/:id', async (req, res) => {
    const { mercadoId } = req.user;
    const { id } = req.params;
    const dadosAtualizados = req.body;
    if (!mercadoId) {
        return res.status(403).json({ error: 'Admin não está associado a um mercado.' });
    }
    try {
        const produto = await Produto.findOne({ where: { id, mercadoId } });
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        await Produto.update(dadosAtualizados, { where: { id, mercadoId } });
        return res.status(200).json({ message: 'Produto atualizado com sucesso.' });
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao atualizar produto.', details: error.message });
    }
});

router.delete('/produtos/:id', async (req, res) => {
    const { mercadoId } = req.user;
    const { id } = req.params;
    if (!mercadoId) {
        return res.status(403).json({ error: 'Admin não está associado a um mercado.' });
    }
    try {
        const produto = await Produto.findOne({ where: { id, mercadoId } });
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        await Produto.destroy({ where: { id, mercadoId } });
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ error: 'Erro ao deletar produto.', details: error.message });
    }
});

router.get('/carrinhos', async (req, res) => {
    const { mercadoId } = req.user;
    try {
        const carrinhos = await Carrinho.findAll({ where: { mercadoId } });
        return res.status(200).json(carrinhos);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao listar carrinhos.', details: error.message });
    }
});

router.post('/carrinhos', async (req, res) => {
    const { mercadoId } = req.user;
    const { qr_code_id } = req.body;
    try {
        const novoCarrinho = await Carrinho.create({ qr_code_id, mercadoId, status: 'livre' });
        return res.status(201).json(novoCarrinho);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Já existe um carrinho com este QR Code.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar carrinho.', details: error.message });
    }
});

router.delete('/carrinhos/:id', async (req, res) => {
    const { mercadoId } = req.user;
    const { id } = req.params;
    try {
        const carrinho = await Carrinho.findOne({ where: { id, mercadoId } });
        if (!carrinho) {
            return res.status(404).json({ error: 'Carrinho não encontrado.' });
        }
        await Carrinho.destroy({ where: { id, mercadoId } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar carrinho.', details: error.message });
    }
});

module.exports = router;