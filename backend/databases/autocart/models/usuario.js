// backend/databases/autocart/models/usuario.js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Compra, { foreignKey: 'usuarioId', as: 'compras' });
    }
  }
  Usuario.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha_hash: DataTypes.STRING,
    cpf: DataTypes.STRING,

    // ADICIONE ESTAS DUAS LINHAS:
    role: DataTypes.STRING,
    mercadoId: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};