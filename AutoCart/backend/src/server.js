// src/server.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swaggerConfig');
require('dotenv').config();

// Rotas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const compraRoutes = require('./routes/compraRoutes');
const produtosRoutes = require('./routes/productsRoutes');

const app = express();
const PORT = process.env.PORT || 3333;

/* CORS */
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

/* Tratamento para JSON inválido */
app.use(express.json({
    verify: (req, res, buf) => {
        try { JSON.parse(buf) } catch (e) {
            throw new Error("JSON inválido");
        }
    }
}));

// Middleware para capturar JSON inválido
app.use((err, req, res, next) => {
    if (err.message === "JSON inválido") {
        return res.status(400).json({ error: "Corpo da requisição com JSON inválido" });
    }
    next(err);
});

// Rotas
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/compras', compraRoutes);
app.use('/produtos', produtosRoutes);

// Swagger opcional
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/* Rota pública de produtos (vamos substituir depois) */
const { models } = require('./database');

app.get('/public/produtos', async (req, res) => {
    try {
        const { Produto } = models.autocart;
        const produtos = await Produto.findAll();
        return res.json(produtos);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

/* Tratamento global de erros */
app.use((err, req, res, next) => {
    console.error("🔥 ERRO NO SERVIDOR:", err);
    return res.status(500).json({
        error: "Erro interno no servidor",
        detalhes: process.env.NODE_ENV === "development" ? err.message : undefined
    });
});

/* Teste de conexão com o banco */
const { connections } = require('./database');

// Teste de conexão com TODOS os bancos SQLite
Object.keys(connections).forEach(async (key) => {
    try {
        await connections[key].authenticate();
        console.log(`✅ Banco "${key}" conectado com sucesso`);
    } catch (err) {
        console.error(`❌ Erro ao conectar ao banco "${key}":`, err);
    }
});



app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
