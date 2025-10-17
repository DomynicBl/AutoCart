// backend/swaggerConfig.js

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AutoCart API',
            version: '1.0.0',
            description: 'Documentação da API do projeto de Carrinho de Compras Inteligente.',
        },
        servers: [
            {
                url: 'http://localhost:3333',
                description: 'Servidor de Desenvolvimento'
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;