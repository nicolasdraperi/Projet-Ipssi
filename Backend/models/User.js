const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    ID_Utilisateur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Adresse: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Ville: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Date_inscription: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',  // Le rôle par défaut est 'user'
    },
    
}, {
    tableName: 'utilisateur',
    timestamps: false,
});

module.exports = User;
