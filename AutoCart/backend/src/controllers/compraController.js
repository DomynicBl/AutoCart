// src/controllers/compraController.js
const { models } = require('../database');
const { Produto, Compra, ItemCompra } = models.autocart;

module.exports = {
    async listarProdutos(req, res) {
        const produtos = await Produto.findAll();
        res.json(produtos);
    },

    async iniciarCompra(req, res) {
        try {
            const compra = await Compra.create({
                usuarioId: req.user.id,
                status: "aberta"
            });

            res.json({ message: "Compra iniciada", compraId: compra.id });
        } catch (err) {
            res.status(500).json({ error: "Erro ao iniciar compra" });
        }
    },

    async adicionarItem(req, res) {
        try {
            const { compraId, produtoId, quantidade } = req.body;

            const compra = await Compra.findByPk(compraId);
            if (!compra) return res.status(404).json({ error: "Compra não existe" });

            const produto = await Produto.findByPk(produtoId);
            if (!produto) return res.status(404).json({ error: "Produto não existe" });

            await ItemCompra.create({
                compraId,
                produtoId,
                quantidade,
                precoUnitario: produto.preco
            });

            res.json({ message: "Item adicionado" });

        } catch (err) {
            res.status(500).json({ error: "Erro ao adicionar item" });
        }
    },

    async finalizarCompra(req, res) {
        try {
            const { compraId } = req.body;

            const compra = await Compra.findByPk(compraId, {
                include: [ItemCompra]
            });

            if (!compra) return res.status(404).json({ error: "Compra não existe" });

            compra.status = "finalizada";
            await compra.save();

            res.json({ message: "Compra finalizada" });

        } catch (err) {
            res.status(500).json({ error: "Erro ao finalizar compra" });
        }
    },

    async historicoCompras(req, res) {
        try {
            const compras = await Compra.findAll({
                where: { usuarioId: req.user.id },
                include: [ItemCompra]
            });

            res.json(compras);
        } catch (err) {
            res.status(500).json({ error: "Erro ao buscar histórico" });
        }
    }
};
