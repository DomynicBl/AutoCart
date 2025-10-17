// src/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { models } = require('../database');

const router = express.Router();
const { Usuario } = models.autocart;

router.post('/register', async (req, res) => {
    const { nome, email, senha, cpf } = req.body;

    try {
        const senha_hash = await bcrypt.hash(senha, 8);
        const usuario = await Usuario.create({ nome, email, senha_hash, cpf });
        usuario.senha_hash = undefined;
        return res.status(201).json(usuario);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email ou CPF já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (!(await bcrypt.compare(senha, usuario.senha_hash))) {
        return res.status(401).json({ error: 'Senha inválida.' });
    }

    const token = jwt.sign({
        id: usuario.id,
        role: usuario.role,
        mercadoId: usuario.mercadoId
    }, 'seu_segredo_super_secreto_para_o_jwt', { expiresIn: '8h' });

    usuario.senha_hash = undefined;
    return res.json({ usuario: usuario.get({ plain: true }), token });
});

module.exports = router;