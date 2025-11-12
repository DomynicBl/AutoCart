// 20251016214905-add-role-and-market-to-user.js

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'cliente' // Por padrão, todo novo usuário é um 'cliente'
    });
    await queryInterface.addColumn('Usuarios', 'mercadoId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Nulo para clientes, preenchido para admins de mercado
      references: null // Não vamos criar uma FK rígida aqui para simplificar
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'role');
    await queryInterface.removeColumn('Usuarios', 'mercadoId');
  }
};