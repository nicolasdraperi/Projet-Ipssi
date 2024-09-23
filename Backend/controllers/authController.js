const File = require('../models/File');
const User = require('../models/User');

// Fonction pour uploader un fichier
exports.uploadFile = async (req, res) => {
    try {
        const { userId } = req.body;
        const newFile = await File.create({
            Nom_fichier: req.file.filename,
            Taille: req.file.size,
            Date_upload: new Date(),
            ID_Utilisateur: userId || null,
        });

        res.status(200).json({
            message: 'Fichier uploadé avec succès',
            file: newFile
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'upload du fichier', error });
    }
};

// Récupérer tous les fichiers pour un utilisateur
exports.getFiles = async (req, res) => {
    try {
        const { userId } = req.params;
        const files = await File.findAll({ where: { ID_Utilisateur: userId } });

        if (files.length === 0) {
            return res.status(404).json({ message: 'Aucun fichier trouvé pour cet utilisateur.' });
        }

        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des fichiers', error });
    }
};

// Supprimer un fichier
exports.deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const file = await File.findByPk(fileId);

        if (!file) {
            return res.status(404).json({ message: 'Fichier non trouvé.' });
        }

        await file.destroy();
        res.status(200).json({ message: 'Fichier supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du fichier', error });
    }
};
