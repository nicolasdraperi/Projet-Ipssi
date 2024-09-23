const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define('File', {
    ID_Fichier: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Nom_fichier: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Taille: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    Date_upload: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ID_Utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'utilisateur',
            key: 'ID_Utilisateur',
        },
    },
}, {
    tableName: 'fichier',
    timestamps: false,  // Désactiver les timestamps automatiques (createdAt, updatedAt)
});

module.exports = File;
