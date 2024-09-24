const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sequelize = require('./config/database'); // Connexion Sequelize à MySQL
const User = require('./models/User'); // Modèle Sequelize pour les utilisateurs
const multer = require('multer'); // Pour l'upload de fichiers
const path = require('path');
const fs = require('fs'); // Pour la gestion des fichiers (suppression)

const app = express();
app.use(express.json()); // Middleware pour gérer les requêtes avec du JSON

// Configuration CORS (autorisation de toutes les origines)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware pour rendre le dossier des fichiers accessible publiquement
app.use('/uploads', express.static('uploads'));

// Synchroniser Sequelize avec la base de données
sequelize.sync({ alter: true })
    .then(() => console.log('Base de données synchronisée avec Sequelize.'))
    .catch(err => console.error('Erreur lors de la synchronisation de la base de données:', err));

// ----------------------------
// ROUTES D'INSCRIPTION ET CONNEXION
// ----------------------------

// Route pour gérer l'inscription
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName, address } = req.body;

    if (!email || !password || !firstName || !lastName || !address) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
    }

    try {
        const userExists = await User.findOne({ where: { Email: email } });
        if (userExists) {
            return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
            Nom: firstName,
            Prenom: lastName,
            Email: email,
            Mot_de_passe: hashedPassword,
            Adresse: address
        });

        return res.status(201).json({ message: 'Inscription réussie, vous pouvez vous connecter.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
    }
});

// Route pour gérer la connexion
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.Mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user.ID_Utilisateur, email: user.Email }, 'secret', { expiresIn: '1h' });

        return res.json({
            message: 'Connexion réussie',
            token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
    }
});

// ----------------------------
// ROUTES DE GESTION DES FICHIERS
// ----------------------------

// Configuration de multer pour gérer les fichiers uploadés
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nomme le fichier avec un horodatage
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accepte le fichier
    } else {
        cb(new Error('Type de fichier non autorisé'), false); // Rejette le fichier
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5 Mo
});

// Route pour uploader un fichier
app.post('/api/files/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier sélectionné ou type de fichier non valide.' });
    }
    res.json({ message: 'Fichier uploadé avec succès.', file: req.file });
});

// Route pour récupérer la liste des fichiers
app.get('/api/files', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des fichiers.' });
        }

        res.json({ files });
    });
});

// Route pour supprimer un fichier
app.delete('/api/files/:fileName', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la suppression du fichier.' });
        }
        res.json({ message: 'Fichier supprimé avec succès.' });
    });
});

// ----------------------------
// GESTION DES ERREURS
// ----------------------------
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err.stack);
    res.status(500).send('Erreur serveur');
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});
