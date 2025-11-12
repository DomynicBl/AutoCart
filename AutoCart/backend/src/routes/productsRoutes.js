const express = require("express");
const router = express.Router();

const { models } = require("../database");
const Produto = models.autocart.Produto;

const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", async (req, res) => {
    try {
        const produtos = await Produto.findAll();
        res.json(produtos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { barcode, name, price, weight, category, image } = req.body;

        const novoProduto = await Produto.create({
            codigo_barras: barcode,
            nome: name,
            preco: price,
            peso_gramas: weight,
            categoria: category,
            foto_url: image,
            mercadoId: 1
        });

        res.json(novoProduto);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar produto" });
    }
});

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        await Produto.destroy({ where: { id: req.params.id } });
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erro ao deletar produto" });
    }
});

router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        await Produto.update(req.body, { where: { id: req.params.id } });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
});

module.exports = router;
