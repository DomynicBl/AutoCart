module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Admin;
};
