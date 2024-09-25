const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuration de multer pour gérer le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Validation des types de fichiers
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé'), false);
    }
};

// Limite de taille de fichier (5 Mo)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // Limite à 5 Mo
});

// Route pour uploader un fichier
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier sélectionné ou type de fichier non valide.' });
    }
    res.json({ message: 'Fichier uploadé avec succès.', file: req.file });
});

// Route pour récupérer la liste des fichiers avec pagination
router.get('/', (req, res) => {
    const filesDirectory = path.join(__dirname, '../uploads');
    
    const page = parseInt(req.query.page) || 1;  // Numéro de page, par défaut 1
    const limit = 5;  // Nombre de fichiers par page
    const startIndex = (page - 1) * limit;  // Point de départ pour la pagination

    // Lire le dossier des fichiers
    fs.readdir(filesDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers.' });
        }

        // Pagination : récupérer un sous-ensemble de fichiers
        const paginatedFiles = files.slice(startIndex, startIndex + limit);
        const totalPages = Math.ceil(files.length / limit);  // Calculer le nombre total de pages

        // Retourner les informations nécessaires
        res.json({ 
            files: paginatedFiles.map((file, index) => {
                const filePath = path.join(filesDirectory, file);
                const fileSize = fs.statSync(filePath).size;

                return {
                    id: index + startIndex,  // Générer un ID fictif (pour l'UI frontend)
                    name: file,
                    size: fileSize,
                    url: `http://localhost:5000/uploads/${file}`  // URL d'accès pour afficher ou télécharger le fichier
                };
            }), 
            totalPages  // Retourner le nombre total de pages
        });
    });
});

// Route pour supprimer un fichier
router.delete('/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const filePath = path.join(__dirname, '../uploads', fileId);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression du fichier.' });
        }
        res.json({ message: 'Fichier supprimé avec succès.' });
    });
});

module.exports = router;
