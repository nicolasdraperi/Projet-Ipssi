const { Sequelize } = require('sequelize');
require('dotenv').config();  // Charger les variables d'environnement

// Connexion à la base de données MySQL avec Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,  // Désactiver les logs SQL pour plus de clarté
});

sequelize.authenticate()
    .then(() => console.log('Connexion à MySQL réussie avec Sequelize.'))
    .catch(err => console.error('Impossible de se connecter à la base de données:', err));

module.exports = sequelize;
