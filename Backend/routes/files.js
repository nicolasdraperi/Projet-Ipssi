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
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Route pour uploader un fichier
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier sélectionné ou type de fichier non valide.' });
    }
    res.json({ message: 'Fichier uploadé avec succès.', file: req.file });
});

// Route pour récupérer la liste des fichiers
router.get('/', (req, res) => {
    // Logique pour récupérer la liste des fichiers de l'utilisateur
    const filesDirectory = path.join(__dirname, '../uploads');
    fs.readdir(filesDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers.' });
        }
        res.json({ files });
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
