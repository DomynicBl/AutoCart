'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // models/compra.js
    static associate(models) {
      // Uma Compra pertence a um único Usuário
      this.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

      // Uma Compra pertence a um único Carrinho
      this.belongsTo(models.Carrinho, { foreignKey: 'carrinhoId', as: 'carrinho' });

      // Uma Compra tem muitos Itens
      this.hasMany(models.ItemCompra, { foreignKey: 'compraId', as: 'itens' });
    }
  }
  Compra.init({
    status: DataTypes.STRING,
    valor_total: DataTypes.FLOAT,
    usuarioId: DataTypes.INTEGER,
    carrinhoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Compra',
  });
  return Compra;
};