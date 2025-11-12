'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    const senha_hash = await bcrypt.hash('Admin@12345', saltRounds);
    return queryInterface.bulkInsert('Usuarios', [{
      nome: 'Administrador',
      email: 'admin@autocart.local',
      cpf: '00000000000',
      senha_hash,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Usuarios', { email: 'admin@autocart.local' }, {});
  }
};