'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produtos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo_barras: {
        type: Sequelize.STRING
      },
      nome: {
        type: Sequelize.STRING
      },
      foto_url: {
        type: Sequelize.STRING
      },
      preco: {
        type: Sequelize.FLOAT
      },
      peso_gramas: {
        type: Sequelize.INTEGER
      },
      categoria: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Produtos');
  }
};