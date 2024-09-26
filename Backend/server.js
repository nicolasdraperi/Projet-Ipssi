const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sequelize = require('./config/database'); // Connexion Sequelize à MySQL
const User = require('./models/User'); // Modèle Sequelize pour les utilisateurs
const multer = require('multer'); // Pour l'upload de fichiers
const path = require('path');
const fs = require('fs'); // Pour la gestion des fichiers (suppression)
const File = require('./models/File');
const userRoutes = require('./routes/userRoutes');  // Chemin vers ton fichier userRoutes.js






// Importer le middleware de vérification du token
const verifyToken = require('./middleware/verifyToken');

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
app.use('/api', userRoutes);
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
        // Récupère l'ID utilisateur depuis le token JWT
        const userId = req.userId;  // Stocké par le middleware `verifyToken`
        const userDirectoryPath = path.join(__dirname, 'uploads', String(userId));

        // Crée le dossier utilisateur s'il n'existe pas encore
        if (!fs.existsSync(userDirectoryPath)) {
            fs.mkdirSync(userDirectoryPath, { recursive: true });
        }

        cb(null, userDirectoryPath);  // Enregistre les fichiers dans le dossier de l'utilisateur
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Ajoute un horodatage au nom du fichier
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

// Route pour uploader un fichier et l'enregistrer dans la base de données
app.post('/api/files/upload', verifyToken, upload.single('file'), async (req, res) => {
    console.log('Requête d\'upload reçue');
    
    if (!req.file) {
        console.log('Aucun fichier reçu ou type de fichier non valide');
        return res.status(400).json({ message: 'Aucun fichier sélectionné ou type de fichier non valide.' });
    }

    console.log('Fichier uploadé avec succès :', req.file);

    try {
        // Enregistrer le fichier dans la base de données
        const newFile = await File.create({
            Nom_fichier: req.file.filename,
            Taille: req.file.size,
            ID_Utilisateur: req.userId, // Assurez-vous que verifyToken définit bien req.userId
            Date_upload: new Date()
        });

        // Répondre avec succès et les informations sur le fichier enregistré
        res.json({ message: 'Fichier uploadé et enregistré avec succès.', file: newFile });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du fichier dans la base de données :', error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement du fichier dans la base de données.' });
    }
});

// Route pour récupérer la liste des fichiers de l'utilisateur
app.get('/api/files', verifyToken, (req, res) => {
    const userId = req.userId;  // Utilisateur authentifié
    const userDirectoryPath = path.join(__dirname, 'uploads', String(userId));

    // Lire les fichiers dans le dossier de l'utilisateur
    fs.readdir(userDirectoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des fichiers.' });
        }

        const fileList = files.map(file => {
            const filePath = path.join(userDirectoryPath, file);
            const stats = fs.statSync(filePath);  // Récupérer les informations sur chaque fichier
            return {
                name: file,
                size: stats.size,  // Taille du fichier
                uploadDate: stats.birthtime,  // Date d'upload du fichier
                url: `http://localhost:5000/uploads/${userId}/${file}`  // URL du fichier
            };
        });

        res.json({ files: fileList });  // Renvoyer les informations des fichiers en tant qu'objets JSON
    });
});

// Route pour supprimer un fichier
app.delete('/api/files/:fileName', verifyToken, (req, res) => {
    const userId = req.userId;
    const filePath = path.join(__dirname, 'uploads', String(userId), req.params.fileName);

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
// definition relations entres les models file et user 
// Définir les relations entre les modèles
User.hasMany(File, { foreignKey: 'ID_Utilisateur' });
File.belongsTo(User, { foreignKey: 'ID_Utilisateur' });
// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});
