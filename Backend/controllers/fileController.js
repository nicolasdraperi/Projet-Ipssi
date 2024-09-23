const { File, files } = require('../models/File');  // Modèle simulé pour gérer les fichiers

// Fonction pour uploader un fichier
exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier uploadé.' });
    }

    // Ajouter le fichier à une base de données simulée
    const newFile = {
        id: files.length + 1,
        name: req.file.filename,  // Nom du fichier uploadé
        size: req.file.size,  // Taille du fichier
        path: req.file.path,  // Chemin où le fichier est stocké
        userId: req.body.userId || 1  // ID de l'utilisateur associé (par défaut : 1)
    };

    files.push(newFile);

    // Répondre avec succès et les informations du fichier
    res.status(200).json({
        message: 'Fichier uploadé avec succès',
        file: newFile
    });
};

// Récupérer tous les fichiers pour un utilisateur
exports.getFiles = (req, res) => {
    const { userId } = req.params;  // Utiliser l'id de l'utilisateur pour filtrer les fichiers
    const userFiles = files.filter(file => file.userId === parseInt(userId));

    if (userFiles.length === 0) {
        return res.status(404).json({ message: "Aucun fichier trouvé pour cet utilisateur." });
    }

    res.status(200).json(userFiles);
};

// Supprimer un fichier
exports.deleteFile = (req, res) => {
    const { fileId } = req.params;
    const fileIndex = files.findIndex(file => file.id === parseInt(fileId));

    if (fileIndex === -1) {
        return res.status(404).json({ message: "Fichier non trouvé." });
    }

    // Supprimer le fichier du tableau simulé
    const deletedFile = files.splice(fileIndex, 1)[0];

    // Vous pouvez également ajouter une logique pour supprimer le fichier du disque ici
    res.status(200).json({ message: "Fichier supprimé avec succès", file: deletedFile });
};
