const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const cors = require('cors');
app.use(express.json());  // Middleware pour gérer les requêtes avec du JSON
const sequelize = require('./config/database');

// Synchroniser Sequelize avec la base de données
sequelize.sync({ alter: true })  // alter: true permet de mettre à jour la table si nécessaire
    .then(() => console.log('Base de données synchronisée avec Sequelize.'))
    .catch(err => console.error('Erreur lors de la synchronisation de la base de données:', err));

// Autoriser toutes les origines (non recommandé pour la production)
app.use(cors({
    origin: '*',  // Autoriser toutes les origines
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Autoriser les méthodes HTTP
    credentials: true  // Si vous devez gérer les cookies ou les en-têtes d'authentification
}));
// Simuler une base de données utilisateur
const users = [
    {
        id: 1,
        email: 'user@example.com',
        password: bcrypt.hashSync('password', 10),  // Hasher le mot de passe
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Rue Example'
    }
];

// Route pour gérer l'inscription
app.post('/api/register', (req, res) => {
    console.log('Route d\'inscription appelée');  // Log pour indiquer que la route est bien appelée
    console.log('Données reçues:', req.body);  // Affiche les données envoyées par l'utilisateur

    const { email, password, firstName, lastName, address } = req.body;

    // Vérification des données reçues
    if (!email || !password || !firstName || !lastName || !address) {
        console.log('Erreur: Informations manquantes');
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
    }

    // Vérification si l'utilisateur existe déjà
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        console.log('Erreur: Utilisateur déjà inscrit avec cet email');
        return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
    }

    // Créer un nouvel utilisateur
    const newUser = {
        id: users.length + 1,
        email,
        password: bcrypt.hashSync(password, 10),  // Hachage du mot de passe
        firstName,
        lastName,
        address
    };

    users.push(newUser);  // Ajout de l'utilisateur à la "base de données"

    console.log('Nouvel utilisateur créé:', newUser);  // Affiche les informations du nouvel utilisateur
    return res.status(201).json({ message: 'Inscription réussie, vous pouvez vous connecter.' });
});

// Route pour gérer la connexion
app.post('/api/login', (req, res) => {
    console.log('Route de connexion appelée');
    console.log('Données reçues:', req.body);

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = users.find(u => u.email === email);
    if (!user) {
        console.log('Erreur: Utilisateur non trouvé');
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        console.log('Erreur: Mot de passe incorrect');
        return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });

    console.log('Connexion réussie pour l\'utilisateur:', user);
    return res.json({
        message: 'Connexion réussie',
        token  // Renvoyer le token au front-end
    });
});
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err.stack);
    res.status(500).send('Erreur serveur');
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});
