const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');
const path = require('path');

// Configurer Multer pour stocker les fichiers uploadés
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Le dossier où les fichiers seront enregistrés
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Nom unique pour chaque fichier
    }
});

const upload = multer({ storage: storage });

// Route pour uploader un fichier
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Autres routes (récupération et suppression de fichiers) si nécessaire
router.get('/:userId', fileController.getFiles);
router.delete('/:fileId', fileController.deleteFile);

module.exports = router;
