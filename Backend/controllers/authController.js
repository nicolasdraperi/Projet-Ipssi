const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Inscription
exports.register = async (req, res) => {
    const { email, password, firstName, lastName, address, role } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Utilisateur déjà inscrit.' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur avec un rôle (par défaut 'user' si non spécifié)
        const newUser = await User.create({
            email,
            Mot_de_passe: hashedPassword,
            Nom: firstName,
            Prenom: lastName,
            Adresse: address,
            Date_inscription: new Date(),
            role: role || 'user'  // Rôle par défaut : 'user'
        });

        res.status(201).json({ message: 'Inscription réussie.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription.', error });
    }
};

// Connexion
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Trouver l'utilisateur
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.Mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }

        // Créer un token JWT incluant le rôle de l'utilisateur
        const token = jwt.sign({ id: user.ID_Utilisateur, email: user.email, role: user.role }, 'secret_key', { expiresIn: '1h' });

        res.json({
            message: 'Connexion réussie.',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion.', error });
    }
};

// Middleware d'authentification avec JWT
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token non fourni.' });
    }

    jwt.verify(token.split(' ')[1], 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide.' });
        }

        req.user = decoded;  // Stocker les informations décodées dans req.user
        next();
    });
};

// Middleware pour vérifier si l'utilisateur est admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès interdit : Administrateur requis.' });
    }
    next();
};
