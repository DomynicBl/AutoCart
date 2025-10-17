'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // models/produto.js
    static associate(models) {
      // Um Produto pode estar em muitos Itens de Compra
      this.hasMany(models.ItemCompra, { foreignKey: 'produtoId', as: 'vendas' });
    }
  }
  Produto.init({
    codigo_barras: DataTypes.STRING,
    nome: DataTypes.STRING,
    foto_url: DataTypes.STRING,
    preco: DataTypes.FLOAT,
    peso_gramas: DataTypes.INTEGER,
    categoria: DataTypes.STRING,
    mercadoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Produto',
  });
  return Produto;
};