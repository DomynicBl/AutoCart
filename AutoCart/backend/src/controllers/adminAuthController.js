const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { models } = require("../database");

const Admin = models.autocart.Admin;

module.exports = {
    async login(req, res) {
        const { email, senha } = req.body;


        if (!email || !senha) {
            return res.status(400).json({ error: "Email e senha são obrigatórios" });
        }

        try {
            const admin = await Admin.findOne({ where: { email } });

            if (!admin) {
                return res.status(401).json({ error: "Usuário não encontrado" });
            }

            const senhaCorreta = await bcrypt.compare(senha, admin.senha);

            if (!senhaCorreta) {
                return res.status(401).json({ error: "Senha incorreta" });
            }
            
            const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
            );

            res.json({
                usuario: { id: admin.id, email: admin.email },
                token
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro no servidor ao fazer login" });
        }
    }
};
