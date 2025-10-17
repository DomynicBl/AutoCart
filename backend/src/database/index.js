// backend/src/database/index.js

const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/config.json');
const path = require('path'); // <-- ADICIONE ESTA LINHA

// Inicializa uma conexão para cada configuração no config.json
const connections = {
    autocart: new Sequelize(dbConfig.autocart),
    mercadoA: new Sequelize(dbConfig.mercadoA),
    mercadoB: new Sequelize(dbConfig.mercadoB)
};

// Função auxiliar para carregar modelos de um diretório específico
const loadModels = (connection, modelsPath) => {
    const fs = require('fs');
    // const path = require('path');  <-- Você pode remover daqui se já importou no topo
    const models = {};

    fs.readdirSync(modelsPath)
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            const model = require(path.join(modelsPath, file))(connection, Sequelize.DataTypes);
            models[model.name] = model;
        });

    Object.values(models).forEach(model => {
        if (model.associate) {
            model.associate(models);
        }
    });

    return models;
};

// Carrega os modelos para cada conexão
const models = {
    autocart: loadModels(connections.autocart, path.resolve(__dirname, '../../databases/autocart/models')),
    mercados: loadModels(connections.mercadoA, path.resolve(__dirname, '../../databases/mercados/models'))
};

module.exports = { connections, models };