// backend/databases/mercados/seeders/20251016211511-popular-produtos-mercadoB.js

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Produtos', [
      // Laticínios (mesmo produto, preço diferente)
      {
        codigo_barras: '7891000055108',
        nome: 'Leite Integral B 1L',
        foto_url: 'https://example.com/leite.jpg',
        preco: 5.89,
        peso_gramas: 1000,
        categoria: 'Laticínios',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Padaria (produto diferente)
      {
        codigo_barras: '7898887776665',
        nome: 'Pão de Forma Integral B 450g',
        foto_url: 'https://example.com/pao-integral.jpg',
        preco: 9.20,
        peso_gramas: 450,
        categoria: 'Padaria',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Mercearia (mesmo produto, preço diferente)
      {
        codigo_barras: '7896004000335',
        nome: 'Arroz Branco Tipo 1 B 5kg',
        foto_url: 'https://example.com/arroz.jpg',
        preco: 27.99,
        peso_gramas: 5000,
        categoria: 'Mercearia',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Hortifruti (categoria nova)
      {
        codigo_barras: '1112223334445',
        nome: 'Maçã Fuji Kg',
        foto_url: 'https://example.com/maca.jpg',
        preco: 12.99,
        peso_gramas: 1000, // Preço por quilo
        categoria: 'Hortifruti',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Limpeza (categoria nova)
      {
        codigo_barras: '7891150042400',
        nome: 'Detergente Líquido B 500ml',
        foto_url: 'https://example.com/detergente.jpg',
        preco: 4.10,
        peso_gramas: 500,
        categoria: 'Limpeza',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Produtos', null, {});
  }
};