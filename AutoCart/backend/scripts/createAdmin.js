// backend/scripts/createAdmin.js

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { models } = require("../src/database");

(async () => {
    try {
        const Admin = models.autocart.Admin;

        if (!Admin) {
            throw new Error("Model Admin não foi carregado. Verifique o index.js.");
        }

        const email = process.env.ADMIN_EMAIL;
        const senha = process.env.ADMIN_PASSWORD;

        if (!email || !senha) {
            throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD não definidos no .env");
        }

        const hash = await bcrypt.hash(senha, 10);

        const admin = await Admin.create({ email, senha: hash });

        console.log("✅ Admin criado com sucesso:");
        console.log(admin.toJSON());
        process.exit(0);

    } catch (err) {
        console.error("❌ Erro ao criar admin:", err);
        process.exit(1);
    }
})();
