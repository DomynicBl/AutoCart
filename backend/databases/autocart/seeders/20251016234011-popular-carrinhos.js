// backend/databases/autocart/seeders/20251016234011-popular-carrinhos.js

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Carrinhos', [
      // 3 Carrinhos para o Mercado A (mercadoId: 1)
      { qr_code_id: 'MKT1-CART01', mercadoId: 1, status: 'livre', createdAt: new Date(), updatedAt: new Date() },
      { qr_code_id: 'MKT1-CART02', mercadoId: 1, status: 'livre', createdAt: new Date(), updatedAt: new Date() },
      { qr_code_id: 'MKT1-CART03', mercadoId: 1, status: 'em_manutencao', createdAt: new Date(), updatedAt: new Date() },

      // 3 Carrinhos para o Mercado B (mercadoId: 2)
      { qr_code_id: 'MKT2-CART01', mercadoId: 2, status: 'livre', createdAt: new Date(), updatedAt: new Date() },
      { qr_code_id: 'MKT2-CART02', mercadoId: 2, status: 'livre', createdAt: new Date(), updatedAt: new Date() },
      { qr_code_id: 'MKT2-CART03', mercadoId: 2, status: 'livre', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carrinhos', null, {});
  }
};