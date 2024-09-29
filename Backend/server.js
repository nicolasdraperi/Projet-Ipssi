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
const { isAuthenticated, isAdmin } = require('./middleware/authMiddleware');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const paypal = require('paypal-rest-sdk');



//Config Paypal
paypal.configure({
    'mode': 'sandbox', 
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
}); 

//Config Mail
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL, 
        pass: process.env.MDP_GG   
    }
});

// Importer le middleware de vérification du token
const verifyToken = require('./middleware/verifyToken');

const app = express();
app.use(express.json()); // Middleware pour gérer les requêtes avec du JSON

// Configuration CORS (autorisation de toutes les origines)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
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
        
        const token = jwt.sign(
            { id: user.ID_Utilisateur, email: user.Email, role: user.role },  // Inclure le rôle ici
            'secret',  // Remplacez par votre clé secrète
            { expiresIn: '1h' }
        );
        
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


app.post('/api/change-role', isAuthenticated, isAdmin, async (req, res) => {
    const { userId, newRole } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        user.role = newRole;
        await user.save();

        res.json({ message: `Le rôle de l'utilisateur a été mis à jour en ${newRole}.`, user });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle.', error });
    }
});

app.post('/api/delete-user', isAuthenticated, isAdmin, async (req, res) => {
    const { userId } = req.body;

    try {

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User non trouvé.' });
        }

        await user.destroy();
        res.json({ message: `User ${userId} has été supprimé.` });
    } catch (error) {
        console.error('Erreur durant la suppression:', error);
        res.status(500).json({ message: 'Erreur durant la suppression:' });
    }
});


app.get('/api/admin/user-stats', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['ID_Utilisateur', 'Nom', 'Prenom', 'Email', 'role'],
            include: [{
                model: File,
                attributes: [
                    [sequelize.fn('COUNT', sequelize.col('Files.ID_Fichier')), 'fileCount'],
                    [sequelize.fn('SUM', sequelize.col('Files.Taille')), 'totalSize']
                ]
            }],
            group: ['User.ID_Utilisateur'] 
        });
        const userData = users.map(user => {
            const fileData = user.Files[0] ? user.Files[0].dataValues : { fileCount: 0, totalSize: 0 };
            return {
                id: user.ID_Utilisateur,
                name: user.Nom,
                surname: user.Prenom,
                email: user.Email,
                role: user.role,
                fileCount: fileData.fileCount || 0, 
                totalSize: fileData.totalSize || 0  
            };
        });

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques des utilisateurs.' });
    }
});

app.delete('/api/delete-account', isAuthenticated, async (req, res) => {
    const userId = req.user.id; 
    try {
        const user = await User.findByPk(userId, {
            include: [File]
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const fileCount = user.Files.length;
        const totalSize = user.Files.reduce((acc, file) => acc + file.Taille, 0);

        for (let file of user.Files) {
            const filePath = path.join(__dirname, 'uploads', String(userId), file.Nom_fichier);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);  
            }
            await file.destroy();  
        }

        await user.destroy();

        const userMailOptions = {
            from: process.env.MAIL,
            to: user.Email,
            subject: 'Confirmation de suppression de compte',
            text: `Votre compte et ${fileCount} fichier(s) associé(s) ont été supprimés avec succès.`
        };
        await transporter.sendMail(userMailOptions);

        const adminMailOptions = {
            from: process.env.MAIL,
            to: process.env.MAIL,  
            subject: 'Suppression de compte utilisateur',
            text: `L'utilisateur ${user.Email} (ID: ${userId}) a supprimé son compte, supprimant ${fileCount} fichier(s) pour un total de ${totalSize} octets.`
        };
        await transporter.sendMail(adminMailOptions);

        res.json({ message: 'Compte et fichiers supprimés avec succès.' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du compte.' });
    }
});

app.post('/api/purchase-storage', isAuthenticated, (req, res) => {
    const montantHT = 20.00;
    const montantTTC = montantHT * 1.20; 

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:5000/api/success?userId=${req.user.id}`, 
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Espace supplémentaire",
                    "sku": "001",
                    "price": montantTTC.toFixed(2),
                    "currency": "EUR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "EUR",
                "total": montantTTC.toFixed(2)
            },
            "description": "Achat de 20 Go d'espace supplémentaire"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    return res.json({ redirectUrl: payment.links[i].href });
                }
            }
        }
    });
});

app.get('/api/success', async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const userId = req.query.userId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": "24.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            try {
                
                const user = await User.findByPk(userId);

                if (!user) {
                    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
                }

                user.Capacite_stockage += 20;
                await user.save();

                const invoicePath = `./factures/facture_${payment.id}.pdf`;
                const doc = new PDFDocument();

                doc.pipe(fs.createWriteStream(invoicePath));

                doc.fontSize(25).text('Facture', { align: 'center' });
                doc.moveDown();
                doc.text(`Date : ${new Date().toISOString().split('T')[0]}`);
                doc.text(`Montant HT : 20.00 €`);
                doc.text(`Montant TTC : 24.00 €`);
                doc.moveDown();
                doc.text('Télécharger la facture', {
                    link: `http://localhost:5000/api/telecharger-pdf/${payment.id}`,
                    underline: true,
                });

                doc.end();

                
                res.json({ message: 'Paiement validé. 20 Go ont été ajoutés à votre compte.' });
            } catch (err) {
                console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
                res.status(500).json({ message: 'Erreur lors de la mise à jour de la capacité de stockage.' });
            }
        }
    });
});

app.get('/api/telecharger-pdf/:id', (req, res) => {
    const invoicePath = path.join(__dirname, 'factures', `facture_${req.params.id}.pdf`);
    res.download(invoicePath, `facture_${req.params.id}.pdf`);
});



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});


