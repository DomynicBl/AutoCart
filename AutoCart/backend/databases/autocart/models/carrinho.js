'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carrinho extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    // models/carrinho.js
    static associate(models) {
      // Um Carrinho pode estar associado a muitas Compras (ao longo do tempo)
      this.hasMany(models.Compra, { foreignKey: 'carrinhoId', as: 'historicoCompras' });
    }
  }
  Carrinho.init({
    qr_code_id: DataTypes.STRING,
    status: DataTypes.STRING,
    mercadoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Carrinho',
  });
  return Carrinho;
};