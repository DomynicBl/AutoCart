// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('../database');
require('dotenv').config();

const { Usuario } = models.autocart;

module.exports = {
    async register(req, res) {
        try {
            const { nome, email, senha } = req.body;

            const existe = await Usuario.findOne({ where: { email } });
            if (existe) return res.status(400).json({ error: "Email já cadastrado" });

            const hash = await bcrypt.hash(senha, Number(process.env.BCRYPT_SALT_ROUNDS));

            const novo = await Usuario.create({
                nome,
                email,
                senha: hash,
                role: "cliente"
            });

            return res.json({ message: "Cadastro realizado com sucesso", novo });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao registrar" });
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            const usuario = await Usuario.findOne({ where: { email } });
            if (!usuario)
                return res.status(404).json({ error: "Usuário não encontrado" });

            const valido = await bcrypt.compare(senha, usuario.senha);
            if (!valido)
                return res.status(401).json({ error: "Senha incorreta" });

            const token = jwt.sign(
                { id: usuario.id, role: usuario.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return res.json({
                message: "Login realizado",
                token,
                role: usuario.role
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao fazer login" });
        }
    }
};
