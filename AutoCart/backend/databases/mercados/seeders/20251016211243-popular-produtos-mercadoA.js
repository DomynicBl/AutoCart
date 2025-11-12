// backend/databases/mercados/seeders/20251016211243-popular-produtos-mercadoA.js

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Produtos', [
      // Laticínios
      {
        codigo_barras: '7891000055108',
        nome: 'Leite Integral A 1L',
        foto_url: 'https://example.com/leite.jpg',
        preco: 5.99,
        peso_gramas: 1000,
        categoria: 'Laticínios',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        codigo_barras: '7896051111222',
        nome: 'Iogurte Natural A 170g',
        foto_url: 'https://example.com/iogurte.jpg',
        preco: 3.29,
        peso_gramas: 170,
        categoria: 'Laticínios',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Padaria
      {
        codigo_barras: '7891910000197',
        nome: 'Pão de Forma Tradicional A 500g',
        foto_url: 'https://example.com/pao.jpg',
        preco: 8.50,
        peso_gramas: 500,
        categoria: 'Padaria',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Mercearia
      {
        codigo_barras: '7894900011517',
        nome: 'Café Torrado e Moído A 500g',
        foto_url: 'https://example.com/cafe.jpg',
        preco: 15.75,
        peso_gramas: 500,
        categoria: 'Mercearia',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        codigo_barras: '7896004000335',
        nome: 'Arroz Branco Tipo 1 A 5kg',
        foto_url: 'https://example.com/arroz.jpg',
        preco: 28.90,
        peso_gramas: 5000,
        categoria: 'Mercearia',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Bebidas
      {
        codigo_barras: '7894900010015',
        nome: 'Refrigerante Cola A 2L',
        foto_url: 'https://example.com/refri.jpg',
        preco: 9.99,
        peso_gramas: 2000,
        categoria: 'Bebidas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Higiene
      {
        codigo_barras: '7891150000011',
        nome: 'Sabonete A 90g',
        foto_url: 'https://example.com/sabonete.jpg',
        preco: 2.50,
        peso_gramas: 90,
        categoria: 'Higiene',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Produtos', null, {});
  }
}