'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemCompra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // models/itemcompra.js
    static associate(models) {
      // Um ItemCompra pertence a uma única Compra
      this.belongsTo(models.Compra, { foreignKey: 'compraId', as: 'compra' });

      // Um ItemCompra se refere a um único Produto
      this.belongsTo(models.Produto, { foreignKey: 'produtoId', as: 'produto' });
    }
  }
  ItemCompra.init({
    quantidade: DataTypes.INTEGER,
    compraId: DataTypes.INTEGER,
    produtoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ItemCompra',
  });
  return ItemCompra;
};