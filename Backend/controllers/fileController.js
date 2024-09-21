const { File, files } = require('../models/File');
const multer = require('multer');
const path = require('path');

// Configurer multer pour l'upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

exports.uploadFile = (req, res) => {
  const { userId } = req.body;
  const newFile = new File(files.length + 1, req.file.filename, req.file.size, userId);
  files.push(newFile);

  res.status(200).json({ message: 'Fichier uploadé avec succès', file: newFile });
};
