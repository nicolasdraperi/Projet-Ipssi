const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sequelize = require('./config/database'); // Connexion Sequelize à MySQL
const User = require('./models/User'); // Modèle Sequelize pour les utilisateurs

const app = express();
app.use(express.json()); // Middleware pour gérer les requêtes avec du JSON

// Configuration CORS (autorisation de toutes les origines)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Synchroniser Sequelize avec la base de données
sequelize.sync({ alter: true })
    .then(() => console.log('Base de données synchronisée avec Sequelize.'))
    .catch(err => console.error('Erreur lors de la synchronisation de la base de données:', err));

// Route pour gérer l'inscription
app.post('/api/register', async (req, res) => {
    console.log('Route d\'inscription appelée');  // Log pour indiquer que la route est bien appelée
    console.log('Données reçues:', req.body);  // Affiche les données envoyées par l'utilisateur

    const { email, password, firstName, lastName, address } = req.body;

    // Vérification des données reçues
    if (!email || !password || !firstName || !lastName || !address) {
        console.log('Erreur: Informations manquantes');
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
    }

    try {
        // Vérification si l'utilisateur existe déjà
        const userExists = await User.findOne({ where: { Email: email } });
        if (userExists) {
            console.log('Erreur: Utilisateur déjà inscrit avec cet email');
            return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
        }

        // Créer un nouvel utilisateur dans la base de données
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
            Nom: firstName,
            Prenom: lastName,
            Email: email,
            Mot_de_passe: hashedPassword,
            Adresse: address
        });

        console.log('Nouvel utilisateur créé:', newUser);  // Affiche les informations du nouvel utilisateur
        return res.status(201).json({ message: 'Inscription réussie, vous pouvez vous connecter.' });
    } catch (error) {
        console.log('Erreur lors de la création de l\'utilisateur:', error);
        return res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
    }
});

// Route pour gérer la connexion
app.post('/api/login', async (req, res) => {
    console.log('Route de connexion appelée');
    console.log('Données reçues:', req.body);

    const { email, password } = req.body;

    try {
        // Trouver l'utilisateur dans la base de données
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            console.log('Erreur: Utilisateur non trouvé');
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = bcrypt.compareSync(password, user.Mot_de_passe);
        if (!isPasswordValid) {
            console.log('Erreur: Mot de passe incorrect');
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Créer un token JWT
        const token = jwt.sign({ id: user.ID_Utilisateur, email: user.Email }, 'secret', { expiresIn: '1h' });

        console.log('Connexion réussie pour l\'utilisateur:', user);
        return res.json({
            message: 'Connexion réussie',
            token  // Renvoyer le token au front-end
        });
    } catch (error) {
        console.log('Erreur lors de la connexion:', error);
        return res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
});

// Gestion des erreurs non gérées
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err.stack);
    res.status(500).send('Erreur serveur');
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});
