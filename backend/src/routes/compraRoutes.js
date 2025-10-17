// src/routes/compraRoutes.js
const express = require('express');
const { verifyClient } = require('../middlewares/auth');
const { models, connections } = require('../database');

const router = express.Router();
const { Compra, Carrinho, Produto, ItemCompra, Usuario } = models.autocart;
const sequelize = connections.autocart;

router.use(verifyClient);

router.post('/iniciar', async (req, res) => {
    const { carrinhoId } = req.body;
    const usuarioId = req.user.id;
    const t = await sequelize.transaction();
    try {
        const compraAtivaExistente = await Compra.findOne({ where: { usuarioId, status: 'ativa' } });
        if (compraAtivaExistente) {
            await t.rollback();
            return res.status(400).json({ error: 'Usuário já possui uma compra ativa.' });
        }
        const carrinho = await Carrinho.findByPk(carrinhoId);
        if (!carrinho || carrinho.status !== 'livre') {
            await t.rollback();
            return res.status(404).json({ error: 'Carrinho não encontrado ou já está em uso.' });
        }
        const novaCompra = await Compra.create({ usuarioId, carrinhoId, status: 'ativa', valor_total: 0.0 }, { transaction: t });
        carrinho.status = 'em_uso';
        await carrinho.save({ transaction: t });
        await t.commit();
        return res.status(201).json(novaCompra);
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Erro ao iniciar a compra.', details: error.message });
    }
});

router.post('/adicionar-item', async (req, res) => {
    const { codigo_barras } = req.body;
    const usuarioId = req.user.id;
    const t = await sequelize.transaction();
    try {
        const compraAtiva = await Compra.findOne({ where: { usuarioId, status: 'ativa' } });
        if (!compraAtiva) {
            await t.rollback();
            return res.status(404).json({ error: 'Nenhuma compra ativa encontrada para este usuário.' });
        }
        const carrinho = await Carrinho.findByPk(compraAtiva.carrinhoId);
        const produto = await Produto.findOne({ where: { codigo_barras, mercadoId: carrinho.mercadoId } });
        if (!produto) {
            await t.rollback();
            return res.status(404).json({ error: 'Produto não encontrado no catálogo deste mercado.' });
        }
        let item = await ItemCompra.findOne({ where: { compraId: compraAtiva.id, produtoId: produto.id } });
        if (item) {
            item.quantidade += 1;
            await item.save({ transaction: t });
        } else {
            item = await ItemCompra.create({ compraId: compraAtiva.id, produtoId: produto.id, quantidade: 1 }, { transaction: t });
        }
        compraAtiva.valor_total = parseFloat(compraAtiva.valor_total) + parseFloat(produto.preco);
        await compraAtiva.save({ transaction: t });
        await t.commit();
        return res.status(200).json({ message: 'Item adicionado com sucesso!', compra: compraAtiva });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Erro ao adicionar item.', details: error.message });
    }
});

router.get('/ativa', async (req, res) => {
    const usuarioId = req.user.id;
    try {
        const compraAtiva = await Compra.findOne({
            where: { usuarioId, status: 'ativa' },
            include: [{ model: ItemCompra, as: 'itens', include: [{ model: Produto, as: 'produto' }] }]
        });
        if (!compraAtiva) {
            return res.status(404).json({ message: 'Nenhuma compra ativa encontrada.' });
        }
        return res.status(200).json(compraAtiva);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar a compra ativa.', details: error.message });
    }
});

router.post('/remover-item', async (req, res) => {
    const { itemCompraId } = req.body;
    const usuarioId = req.user.id;
    const t = await sequelize.transaction();
    try {
        const compraAtiva = await Compra.findOne({ where: { usuarioId, status: 'ativa' } });
        if (!compraAtiva) {
            await t.rollback();
            return res.status(404).json({ error: 'Nenhuma compra ativa encontrada.' });
        }
        const item = await ItemCompra.findOne({ where: { id: itemCompraId, compraId: compraAtiva.id }, include: [{ model: Produto, as: 'produto' }] });
        if (!item) {
            await t.rollback();
            return res.status(404).json({ error: 'Item não encontrado na sua compra.' });
        }
        compraAtiva.valor_total = parseFloat(compraAtiva.valor_total) - parseFloat(item.produto.preco);
        if (item.quantidade > 1) {
            item.quantidade -= 1;
            await item.save({ transaction: t });
        } else {
            await item.destroy({ transaction: t });
        }
        await compraAtiva.save({ transaction: t });
        await t.commit();
        return res.status(200).json({ message: 'Item atualizado com sucesso!', compra: compraAtiva });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Erro ao remover item.', details: error.message });
    }
});

router.post('/finalizar', async (req, res) => {
    const usuarioId = req.user.id;
    const t = await sequelize.transaction();
    try {
        const compraAtiva = await Compra.findOne({ where: { usuarioId, status: 'ativa' } });
        if (!compraAtiva) {
            await t.rollback();
            return res.status(404).json({ error: 'Nenhuma compra ativa para finalizar.' });
        }
        compraAtiva.status = 'finalizada';
        await compraAtiva.save({ transaction: t });
        const carrinho = await Carrinho.findByPk(compraAtiva.carrinhoId);
        if (carrinho) {
            carrinho.status = 'livre';
            await carrinho.save({ transaction: t });
        }
        await t.commit();
        return res.status(200).json({ message: 'Compra finalizada com sucesso!', compra: compraAtiva });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: 'Erro ao finalizar a compra.', details: error.message });
    }
});

module.exports = router;