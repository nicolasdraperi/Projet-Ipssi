const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Assurez-vous que le fichier de configuration est correct

// Définition du modèle Invoice avec Sequelize
const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    clientType: {
        type: DataTypes.ENUM('particulier', 'professionnel'),
        allowNull: false,
        defaultValue: 'particulier'
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    siret: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    vatNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,  // Ajoute les colonnes createdAt et updatedAt automatiquement
    tableName: 'invoices', // Nom de la table dans la base de données
});

// Synchronisation avec la base de données (créer la table si elle n'existe pas encore)
sequelize.sync()
    .then(() => {
        console.log('Table des factures synchronisée avec succès.');
    })
    .catch(error => {
        console.error('Erreur lors de la synchronisation de la table des factures:', error);
    });

module.exports = Invoice;
