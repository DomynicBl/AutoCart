// src/server.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swaggerConfig');

// Importa as rotas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const compraRoutes = require('./routes/compraRoutes');

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

// Define os prefixos para as rotas
app.use('/auth', authRoutes); // Rotas de autenticação
app.use('/admin', adminRoutes); // Rotas de admin 
app.use('/compras', compraRoutes); // Rotas de compras 

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Documentação Swagger

// Rota pública de produtos (se ainda quiser manter)
const { models } = require('./database');
app.get('/produtos', async (req, res) => {
    const { Produto } = models.autocart;
    const produtos = await Produto.findAll();
    return res.json(produtos);
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});