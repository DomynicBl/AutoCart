// src/controllers/adminController.js
const { models } = require('../database');
const { Produto } = models.autocart;

module.exports = {
    async listarProdutos(req, res) {
        try {
            const produtos = await Produto.findAll();
            res.json(produtos);
        } catch (err) {
            res.status(500).json({ error: "Erro ao listar produtos" });
        }
    },

    async criarProduto(req, res) {
        try {
            const { nome, preco, categoria, estoque } = req.body;
            const produto = await Produto.create({ nome, preco, categoria, estoque });
            res.json(produto);
        } catch (err) {
            res.status(500).json({ error: "Erro ao criar produto" });
        }
    },

    async atualizarProduto(req, res) {
        try {
            const { id } = req.params;
            const { nome, preco, categoria, estoque } = req.body;

            const prod = await Produto.findByPk(id);
            if (!prod) return res.status(404).json({ error: "Produto não encontrado" });

            prod.nome = nome;
            prod.preco = preco;
            prod.categoria = categoria;
            prod.estoque = estoque;

            await prod.save();
            res.json(prod);

        } catch (err) {
            res.status(500).json({ error: "Erro ao atualizar produto" });
        }
    },

    async deletarProduto(req, res) {
        try {
            const { id } = req.params;
            const prod = await Produto.findByPk(id);

            if (!prod) return res.status(404).json({ error: "Produto não encontrado" });

            await prod.destroy();
            res.json({ message: "Produto deletado" });

        } catch (err) {
            res.status(500).json({ error: "Erro ao deletar produto" });
        }
    }
};
